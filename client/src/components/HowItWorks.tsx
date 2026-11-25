import { useEffect, useRef } from "react";
import { Send, Search, ThumbsUp, Printer } from "lucide-react";

const STEPS = [
  { icon: Send, t: "Send", d: "Your 3D file, or photos and your idea, on WhatsApp." },
  { icon: Search, t: "We check", d: "A person looks at every job and replies with the price." },
  { icon: ThumbsUp, t: "You say yes", d: "Only a photo? We design it and show you first." },
  { icon: Printer, t: "We print", d: "Pick it up from our shop in Thane West." },
];

export default function HowItWorks() {
  const line = useRef<HTMLSpanElement>(null);
  const box = useRef<HTMLOListElement>(null);
  useEffect(() => {
    // the line between the steps draws itself as the section scrolls into view
    const onScroll = () => {
      const r = box.current!.getBoundingClientRect();
      const p = Math.min(Math.max((window.innerHeight * 0.85 - r.top) / (r.height + window.innerHeight * 0.4), 0), 1);
      line.current!.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <section id="how" className="scroll-mt-16">
      <div className="section">
        <p className="eyebrow">Simple</p>
        <h2 className="h2 mt-4">How it works</h2>
        <ol ref={box} className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
          <span aria-hidden className="absolute left-6 top-6 hidden h-0.5 w-[calc(100%-3rem)] bg-line md:block" />
          <span ref={line} aria-hidden className="absolute left-6 top-6 hidden h-0.5 w-[calc(100%-3rem)] origin-left bg-gradient-to-r from-brand to-sky-400 transition-transform duration-150 md:block" style={{ transform: "scaleX(0)" }} />
          {STEPS.map(({ icon: Icon, t, d }, i) => (
            <li key={t} className="reveal relative flex gap-4 md:block" style={{ transitionDelay: `${i * 90}ms` }}>
              <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-white shadow-[0_10px_24px_-10px_rgba(19,153,236,0.8)]">
                <Icon className="h-5 w-5" />
              </span>
              <div className="md:mt-5">
                <p className="font-display text-lg font-bold"><span className="text-brand">0{i + 1}</span> {t}</p>
                <p className="mt-1 leading-relaxed text-mute">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
