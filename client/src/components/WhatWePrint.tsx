import { Gift, GraduationCap, Wrench } from "lucide-react";

// Real kinds of jobs the shop has done (from reviews and the Maps photos). Plain words people search for.
const GROUPS = [
  { icon: Gift, h: "Custom 3D printed gifts", items: ["Name signs and couple-name gifts", "Ganesha and other idols", "Keychains, including company logo keychains", "Miniatures made from a photo", "Planters, pen holders and desk décor"] },
  { icon: GraduationCap, h: "College and school projects", items: ["Architecture and floor-plan models", "Robot car bodies and robot arm parts", "Drone casings and enclosures", "Final-year project parts, with help on sizes", "Models for presentations and exhibitions"] },
  { icon: Wrench, h: "Functional parts and prototypes", items: ["Replacement parts and brackets", "Electronics enclosures and boxes", "Cable organisers and holders", "Prototypes before you make many", "Small batches in PLA, PETG or ABS"] },
];

export default function WhatWePrint() {
  return (
    <section id="services" className="scroll-mt-16">
      <div className="section">
        <p className="eyebrow">What we print</p>
        <h2 className="h2 mt-4 max-w-3xl">3D printing service in Thane for gifts, projects and parts</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-mute">
          Buildit3D is a 3D printing shop in Thane West. Customers come to us from across Thane and Mumbai: pick up from the shop,
          or we book a Porter or Borzo delivery to you. No 3D file? We design it from your photo or sketch.
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {GROUPS.map(({ icon: Icon, h, items }, i) => (
            <div key={h} className="reveal rounded-3xl border border-line bg-white p-7 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(19,153,236,0.5)]" style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand"><Icon className="h-6 w-6" /></span>
              <h3 className="mt-5 font-display text-xl font-bold tracking-tight">{h}</h3>
              <ul className="mt-4 space-y-2 text-[15px] text-ink/75">
                {items.map((t) => <li key={t} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{t}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
