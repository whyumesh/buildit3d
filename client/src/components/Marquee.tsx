import { COLOUR_HEX } from "../config";

const WORDS = ["Gifts", "Name signs", "Idols", "College projects", "Robot parts", "Prototypes", "Keychains", "Planters", "Drone casings", "Spare parts", "Miniatures", "Architecture models"];
const SWATCH = Object.entries(COLOUR_HEX).filter(([k]) => k !== "Not sure");

/** A slow moving strip: what we make, with filament colours in between. */
export default function Marquee() {
  const row = WORDS.map((w, i) => (
    <span key={w} className="flex shrink-0 items-center gap-6">
      <span className="font-display text-xl font-bold tracking-tight text-ink/80 sm:text-2xl">{w}</span>
      <span className="h-4 w-4 rounded-full border border-black/10 shadow-inner" style={{ background: SWATCH[i % SWATCH.length][1] }} />
    </span>
  ));
  return (
    <div className="relative mt-6 overflow-hidden border-y border-line bg-white/70 py-5 backdrop-blur [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]" aria-hidden>
      <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-6 motion-reduce:animate-none">
        {row}
        {row}
      </div>
    </div>
  );
}
