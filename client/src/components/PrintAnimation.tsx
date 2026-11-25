import { useEffect, useRef } from "react";

/**
 * Hero visual: an object being 3D printed, layer by layer, with a glowing nozzle.
 * Pure canvas, no libraries. Cycles through a few shapes. Static when the visitor prefers reduced motion.
 */

type Shape = { name: string; layers: number; sides: number; twist: number; radius: (h: number) => number; tall?: number };

const SHAPES: Shape[] = [
  // the cube from the Buildit3D logo
  { name: "cube", layers: 40, sides: 4, twist: 0, radius: () => 0.8, tall: 0.62 },
  // twisted hexagon vase
  { name: "vase", layers: 64, sides: 6, twist: Math.PI / 2.2, radius: (h) => 0.62 + 0.28 * Math.sin(h * Math.PI * 1.1 + 0.3) - 0.12 * h },
  // round planter
  { name: "planter", layers: 52, sides: 96, twist: 0, radius: (h) => 0.55 + 0.32 * Math.sqrt(h) - 0.1 * h * h },
  // low-poly bust-like column
  { name: "column", layers: 70, sides: 8, twist: -Math.PI / 3, radius: (h) => 0.45 + 0.35 * Math.pow(Math.sin(h * Math.PI), 0.8) * (1 - 0.4 * h) },
];

const BLUE = [19, 153, 236]; // logo blue #1399EC

export default function PrintAnimation({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0, h = 0, dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const LAYER_MS = 55, HOLD_MS = 1800, FADE_MS = 700;
    let shapeIdx = 0;
    let start = performance.now();
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);

    const pts = (s: Shape, layer: number, R: number) => {
      const hNorm = layer / s.layers;
      const rr = s.radius(hNorm) * R;
      const rot = s.twist * hNorm;
      const n = s.sides;
      const out: [number, number][] = [];
      // walk the polygon with extra points per edge so the nozzle moves smoothly
      const per = n > 24 ? 1 : 10;
      for (let i = 0; i <= n * per; i++) {
        const k = Math.floor(i / per), f = (i % per) / per;
        const a1 = rot + (k / n) * Math.PI * 2, a2 = rot + ((k + 1) / n) * Math.PI * 2;
        const x = Math.cos(a1) * (1 - f) + Math.cos(a2) * f;
        const y = Math.sin(a1) * (1 - f) + Math.sin(a2) * f;
        out.push([x * rr, y * rr]);
      }
      return out;
    };

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible && !reduce) return;
      const s = SHAPES[shapeIdx];
      const buildMs = s.layers * LAYER_MS;
      let t = reduce ? buildMs + 1 : now - start;
      if (!reduce && t > buildMs + HOLD_MS + FADE_MS) {
        shapeIdx = (shapeIdx + 1) % SHAPES.length;
        start = now; t = 0;
      }
      const fade = !reduce && t > buildMs + HOLD_MS ? 1 - (t - buildMs - HOLD_MS) / FADE_MS : 1;
      const progress = Math.min(t / LAYER_MS, s.layers);
      const done = Math.floor(progress);
      const frac = progress - done;

      ctx.clearRect(0, 0, w, h);
      const size = Math.min(w, h);
      const cx = w / 2, base = h * 0.8;
      const R = size * 0.27;
      const tilt = 0.5; // ellipse squash = viewing angle
      const height = size * 0.52 * (s.tall ?? 1);
      const layerH = height / s.layers;

      // print bed: faint dot grid ellipse
      ctx.fillStyle = "rgba(10,10,10,0.13)";
      for (let gx = -8; gx <= 8; gx++) for (let gy = -8; gy <= 8; gy++) {
        const px = gx / 8, py = gy / 8;
        if (px * px + py * py > 1) continue;
        ctx.beginPath();
        ctx.arc(cx + px * R * 1.7, base + py * R * 1.7 * tilt + layerH, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      const project = (x: number, y: number, layer: number): [number, number] => [cx + x, base + y * tilt - layer * layerH];

      const drawLayer = (layer: number, upto: number, alpha: number, width: number) => {
        const p = pts(s, layer, R);
        const last = Math.max(1, Math.floor(upto * (p.length - 1)));
        for (const pass of ["back", "front"] as const) {
          ctx.beginPath();
          let pen = false;
          for (let i = 0; i <= last; i++) {
            const [x, y] = p[i];
            const isFront = y >= 0;
            if ((pass === "front") !== isFront) { pen = false; continue; }
            const [sx, sy] = project(x, y, layer);
            if (!pen) { ctx.moveTo(sx, sy); pen = true; } else ctx.lineTo(sx, sy);
          }
          const a = (pass === "front" ? alpha : alpha * 0.22) * fade;
          ctx.strokeStyle = `rgba(${BLUE[0]},${BLUE[1]},${BLUE[2]},${a})`;
          ctx.lineWidth = width;
          ctx.stroke();
        }
        return p[last];
      };

      for (let L = 0; L < done; L++) {
        const age = done - L;
        const alpha = 0.45 + 0.5 * Math.max(0, 1 - age / 40); // newer layers glow a little more
        drawLayer(L, 1, alpha, 1.1);
      }

      if (done < s.layers && !reduce) {
        const tip = drawLayer(done, frac, 1, 1.6);
        const [nx, ny] = project(tip[0], tip[1], done);
        // soft glow where the plastic comes out
        const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, 18);
        g.addColorStop(0, "rgba(19,153,236,0.45)");
        g.addColorStop(1, "rgba(19,153,236,0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(nx, ny, 18, 0, Math.PI * 2); ctx.fill();
        // gantry rail
        ctx.strokeStyle = "rgba(10,10,10,0.10)";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, ny - 40); ctx.lineTo(w, ny - 40); ctx.stroke();
        // print head drawn like the logo: outlined block, arm to the right, cone tip
        ctx.strokeStyle = "#1399ec";
        ctx.fillStyle = "#ffffff";
        ctx.lineWidth = 2.4;
        ctx.lineJoin = "round"; ctx.lineCap = "round";
        const bw = 30, bh = 18, top = ny - 50;
        ctx.beginPath(); ctx.roundRect(nx - bw / 2, top, bw, bh, 4); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(nx + bw / 2, top + bh / 2); ctx.lineTo(nx + bw / 2 + 16, top + bh / 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(nx - 7, top + bh); ctx.lineTo(nx + 7, top + bh); ctx.lineTo(nx + 3, ny - 12); ctx.lineTo(nx - 3, ny - 12); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(nx, ny - 12); ctx.lineTo(nx, ny - 3); ctx.stroke();
      }
    };
    raf = requestAnimationFrame(draw);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
