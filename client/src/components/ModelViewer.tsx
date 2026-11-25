import { useEffect, useRef } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { ThreeMFLoader } from "three/examples/jsm/loaders/3MFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { BED_MM, measure, type Geometry } from "../estimate";

/** Read an STL or 3MF in the browser (nothing is uploaded) and return one non-indexed geometry in mm, Z up. */
export async function loadModel(file: File): Promise<{ geometry: THREE.BufferGeometry; info: Geometry }> {
  const buf = await file.arrayBuffer();
  const ext = file.name.toLowerCase().split(".").pop();
  let geom: THREE.BufferGeometry;
  if (ext === "stl") {
    geom = new STLLoader().parse(buf);
  } else if (ext === "3mf") {
    const group = new ThreeMFLoader().parse(buf);
    group.updateMatrixWorld(true);
    const parts: THREE.BufferGeometry[] = [];
    group.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        const g = (m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone()).applyMatrix4(m.matrixWorld);
        for (const k of Object.keys(g.attributes)) if (k !== "position") g.deleteAttribute(k);
        parts.push(g);
      }
    });
    if (!parts.length) throw new Error("No model found in this 3MF.");
    geom = mergeGeometries(parts)!;
  } else {
    throw new Error("Preview works for STL and 3MF files.");
  }
  if (geom.index) geom = geom.toNonIndexed();
  geom.computeBoundingBox();
  const bb = geom.boundingBox!;
  const size = new THREE.Vector3();
  bb.getSize(size);
  const { volumeMm3, areaMm2 } = measure(geom.attributes.position.array as Float32Array);
  // sit the model on the bed, centred
  geom.translate(-(bb.min.x + bb.max.x) / 2, -(bb.min.y + bb.max.y) / 2, -bb.min.z);
  geom.computeVertexNormals();
  return {
    geometry: geom,
    info: { volumeCm3: volumeMm3 / 1000, areaCm2: areaMm2 / 100, size: [size.x, size.y, size.z] },
  };
}

export default function ModelViewer({ geometry, color, scale }: { geometry: THREE.BufferGeometry; color: string; scale: number }) {
  const host = useRef<HTMLDivElement>(null);
  const meshRef = useRef<THREE.Mesh>();
  const frameRef = useRef<(s: number) => void>();

  useEffect(() => {
    const el = host.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 5000);
    camera.up.set(0, 0, 1); // Z up, like the printer

    scene.add(new THREE.HemisphereLight(0xffffff, 0xcfe6f7, 1.6));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(200, -300, 400);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x9fd3f7, 0.8);
    rim.position.set(-300, 300, 150);
    scene.add(rim);

    // print bed 256 x 256 mm with a 16 mm grid, for scale
    const bed = new THREE.Group();
    const plate = new THREE.Mesh(
      new THREE.PlaneGeometry(BED_MM, BED_MM),
      new THREE.MeshBasicMaterial({ color: 0xeef6fd, transparent: true, opacity: 0.9 }),
    );
    bed.add(plate);
    const grid = new THREE.GridHelper(BED_MM, 16, 0x9ccdf0, 0xcfe4f4);
    grid.rotation.x = Math.PI / 2;
    grid.position.z = 0.05;
    bed.add(grid);
    const edge = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(BED_MM, BED_MM, 0.1)),
      new THREE.LineBasicMaterial({ color: 0x1399ec }),
    );
    bed.add(edge);
    scene.add(bed);

    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.05 }),
    );
    meshRef.current = mesh;
    scene.add(mesh);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.4;
    controls.addEventListener("start", () => (controls.autoRotate = false));

    let lastScale = 1;
    const frame = (s: number) => {
      lastScale = s;
      geometry.computeBoundingSphere();
      const r = Math.max(geometry.boundingSphere!.radius * s, 12);
      const zMid = (geometry.boundingBox!.max.z * s) / 2;
      controls.target.set(0, 0, zMid);
      // fit the bounding sphere in the narrower of the two view angles, with some air around it
      const vFov = THREE.MathUtils.degToRad(camera.fov);
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
      const d = (r / Math.sin(Math.min(vFov, hFov) / 2)) * 1.35;
      const dir = new THREE.Vector3(0.62, -0.78, 0.52).normalize();
      camera.position.copy(dir.multiplyScalar(d)).add(controls.target);
      camera.near = d / 100;
      camera.far = d * 20;
      camera.updateProjectionMatrix();
      controls.update();
    };
    frameRef.current = frame;

    const resize = () => {
      const { width, height } = el.getBoundingClientRect();
      renderer.setSize(width, height, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      frame(lastScale);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      controls.update();
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [geometry]);

  useEffect(() => {
    (meshRef.current?.material as THREE.MeshStandardMaterial | undefined)?.color.set(color);
  }, [color]);

  useEffect(() => {
    meshRef.current?.scale.setScalar(scale);
    frameRef.current?.(scale);
  }, [scale]);

  return <div ref={host} className="h-full w-full cursor-grab active:cursor-grabbing" />;
}
