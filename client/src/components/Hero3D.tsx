import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/**
 * Hero: our own designs printing themselves on a 3D print bed.
 * A clipping plane rises through each model (the "print"), a glowing band marks the current layer and a
 * print head sweeps over it. Models are Buildit3D's own CAD, packed by tools/pack_models.py.
 */

type Item = { file: string; label: string; color: number; scale?: number; rotateZ?: number };
const ITEMS: Item[] = [
  { file: "/models/gearbox.bin", label: "Herringbone planetary gearbox", color: 0x1399ec, scale: 1.55 },
  { file: "/models/vase.bin", label: "Twisted vase", color: 0xf5b7c9, scale: 1.15 },
  { file: "/models/truck-cab.bin", label: "Toy truck cab, part of a custom model", color: 0xf6d23a, scale: 1.7, rotateZ: 0.5 },
  { file: "/models/cube.bin", label: "The Buildit3D cube", color: 0x93d5b4, scale: 1.5, rotateZ: Math.PI / 4 },
];
const PRINT_S = 5.2, HOLD_S = 2.6, FADE_S = 0.6;
const LAYER = 0.6; // visual layer thickness (mm) for the line texture

async function loadBin(url: string): Promise<THREE.BufferGeometry> {
  const buf = await (await fetch(url)).arrayBuffer();
  const dv = new DataView(buf);
  const nV = dv.getUint32(0, true), nT = dv.getUint32(4, true);
  const min = [0, 1, 2].map((i) => dv.getFloat32(8 + i * 4, true));
  const max = [0, 1, 2].map((i) => dv.getFloat32(20 + i * 4, true));
  const q = new Uint16Array(buf, 32, nV * 3);
  const pos = new Float32Array(nV * 3);
  for (let i = 0; i < nV * 3; i++) {
    const k = i % 3;
    pos[i] = min[k] + (q[i] / 65535) * (max[k] - min[k]);
  }
  const idxOff = 32 + nV * 6;
  const idx = new Uint32Array(buf.slice(idxOff, idxOff + nT * 12));
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  g.translate(-(min[0] + max[0]) / 2, -(min[1] + max[1]) / 2, -min[2]);
  g.computeVertexNormals();
  g.computeBoundingBox();
  return g;
}

/** Standard material with fine horizontal layer lines, like a real FDM print. */
function printedMaterial(color: number, planes: THREE.Plane[]) {
  const m = new THREE.MeshPhysicalMaterial({ color, roughness: 0.48, metalness: 0, clearcoat: 0.25, clearcoatRoughness: 0.6, clippingPlanes: planes, side: THREE.DoubleSide });
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vZ;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvZ = (modelMatrix * vec4(position,1.0)).z;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", `#include <common>\nvarying float vZ;`)
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>\nfloat ln = abs(fract(vZ / ${LAYER.toFixed(2)}) - 0.5);\ndiffuseColor.rgb *= 0.9 + 0.1 * smoothstep(0.0, 0.25, ln);`,
      );
  };
  return m;
}

export default function Hero3D({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState(ITEMS[0].label);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = host.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, touch ? 1.5 : 2));
    renderer.localClippingEnabled = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 1, 3000);
    camera.up.set(0, 0, 1);
    camera.position.set(190, -230, 150);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd6ecfb, 1.5));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(120, -160, 260);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    Object.assign(key.shadow.camera, { left: -120, right: 120, top: 120, bottom: -120, near: 10, far: 700 });
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x8fd0ff, 1.4);
    rim.position.set(-200, 180, 120);
    scene.add(rim);

    // Print bed: a round white build plate with fine blue rings (no hard corners to crop)
    const bedGroup = new THREE.Group();
    const plate = new THREE.Mesh(
      new THREE.CylinderGeometry(105, 105, 5, 128),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }),
    );
    plate.rotation.x = Math.PI / 2;
    plate.position.z = -2.51;
    plate.receiveShadow = true;
    bedGroup.add(plate);
    const edgeRing = new THREE.Mesh(new THREE.TorusGeometry(105, 1.2, 12, 160), new THREE.MeshStandardMaterial({ color: 0x1399ec, roughness: 0.35 }));
    edgeRing.position.z = -0.2;
    bedGroup.add(edgeRing);
    const ringMat = new THREE.LineBasicMaterial({ color: 0x9ccdf0, transparent: true, opacity: 0.55 });
    for (let rr = 15; rr < 105; rr += 15) {
      const pts = Array.from({ length: 129 }, (_, i) => new THREE.Vector3(Math.cos((i / 128) * Math.PI * 2) * rr, Math.sin((i / 128) * Math.PI * 2) * rr, 0.03));
      bedGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), ringMat));
    }
    const shadowCatcher = new THREE.Mesh(new THREE.CircleGeometry(104, 96), new THREE.ShadowMaterial({ opacity: 0.14 }));
    shadowCatcher.position.z = 0.04;
    shadowCatcher.receiveShadow = true;
    bedGroup.add(shadowCatcher);
    scene.add(bedGroup);

    // Print head + gantry rail
    const head = new THREE.Group();
    const body = new THREE.Mesh(new RoundedBoxGeometry(22, 22, 16, 3, 3), new THREE.MeshStandardMaterial({ color: 0xf4f6f8, roughness: 0.4 }));
    body.position.z = 18;
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(22.4, 22.4, 3), new THREE.MeshStandardMaterial({ color: 0x1399ec, roughness: 0.4 }));
    stripe.position.z = 14;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(4, 8, 24), new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.8, roughness: 0.3 }));
    cone.rotation.x = -Math.PI / 2;
    cone.position.z = 6;
    const glow = new THREE.PointLight(0x5cc0ff, 900, 60, 2);
    glow.position.z = 1;
    head.add(body, stripe, cone, glow);
    head.traverse((o) => ((o as THREE.Mesh).castShadow = true));
    scene.add(head);
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 230, 16), new THREE.MeshStandardMaterial({ color: 0x2a2f36, metalness: 0.6, roughness: 0.35 }));
    rail.rotation.z = Math.PI / 2;
    scene.add(rail);

    // Clipping: model shows below `cut`; the glow band shows between cut - band and cut
    const cut = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);
    const bandTop = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);
    const bandBottom = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const bandMat = new THREE.MeshBasicMaterial({ color: 0x7fd2ff, clippingPlanes: [bandTop, bandBottom], side: THREE.DoubleSide, transparent: true, opacity: 0.95 });

    const models: { geo: THREE.BufferGeometry; item: Item }[] = [];
    let current: { mesh: THREE.Mesh; band: THREE.Mesh; mat: THREE.MeshPhysicalMaterial; h: number; r: number } | null = null;
    let idx = 0, t0 = 0;

    const show = (i: number) => {
      if (current) { scene.remove(current.mesh, current.band); current.mat.dispose(); }
      const { geo, item } = models[i];
      const mat = printedMaterial(item.color, [cut]);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.scale.setScalar(item.scale ?? 1);
      mesh.rotation.z = item.rotateZ ?? 0;
      const band = new THREE.Mesh(geo, bandMat);
      band.scale.copy(mesh.scale);
      band.rotation.copy(mesh.rotation);
      scene.add(mesh, band);
      const bb = geo.boundingBox!;
      const h = (bb.max.z - bb.min.z) * (item.scale ?? 1);
      const r = Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y) * (item.scale ?? 1) / 2;
      current = { mesh, band, mat, h, r };
      setLabel(item.label);
      t0 = performance.now();
    };

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.autoRotate = !reduce;
    controls.autoRotateSpeed = 0.9;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = 1.35;
    controls.target.set(0, 0, 18);
    if (touch) controls.enabled = false; // let phones scroll the page; the scene still turns by itself
    let idleTimer = 0;
    controls.addEventListener("start", () => { controls.autoRotate = false; clearTimeout(idleTimer); });
    controls.addEventListener("end", () => { idleTimer = window.setTimeout(() => (controls.autoRotate = !reduce), 2500); });

    const resize = () => {
      const { width, height } = el.getBoundingClientRect();
      renderer.setSize(width, height, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = width / Math.max(height, 1);
      // keep the bed in frame on narrow screens
      const d = camera.aspect < 1 ? 390 / camera.aspect ** 0.45 : 400;
      camera.position.setLength(d);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    let raf = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || !current) return;
      const t = (now - t0) / 1000;
      const { h, r, mesh, mat } = current;
      const p = reduce ? 1 : Math.min(t / PRINT_S, 1);
      const eased = p < 1 ? p : 1;
      const z = eased * h + (p >= 1 ? 1 : 0);
      cut.constant = z;
      bandTop.constant = z;
      bandBottom.constant = -(z - 0.9);
      current.band.visible = p < 1;

      // print head: sweep a rounded path over the part at the current layer
      const s = now / 1000;
      const a = s * 5.2;
      const rr = r * (0.55 + 0.4 * Math.sin(s * 1.7));
      const hz = p < 1 ? z : h + 25 + Math.min((t - PRINT_S) * 30, 40);
      head.position.set(Math.cos(a) * rr, Math.sin(a) * rr, hz + 0.6);
      glow.intensity = p < 1 ? 900 : 0;
      rail.position.set(0, head.position.y, hz + 18);

      // hold, then fade out and switch model
      const end = PRINT_S + HOLD_S;
      if (!reduce && t > end) {
        const f = Math.min((t - end) / FADE_S, 1);
        mat.transparent = true;
        mat.opacity = 1 - f;
        mesh.position.z = f * 6;
        if (f >= 1) show((idx = (idx + 1) % models.length));
      } else {
        mat.opacity = 1;
        mesh.position.z = 0;
      }
      controls.update();
      renderer.render(scene, camera);
    };

    let cancelled = false;
    Promise.all(ITEMS.map((it) => loadBin(it.file).then((geo) => ({ geo, item: it })))).then((list) => {
      if (cancelled) return;
      models.push(...list);
      show(0);
      setReady(true);
      raf = requestAnimationFrame(tick);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(idleTimer);
      ro.disconnect();
      io.disconnect();
      controls.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div ref={host} className={`h-full w-full transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"} md:cursor-grab md:active:cursor-grabbing`} />
      <div className={`pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-line bg-white/85 px-4 py-2 text-xs font-medium shadow-sm backdrop-blur transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}>
        <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-brand" /></span>
        Printing: {label}
      </div>
    </div>
  );
}
