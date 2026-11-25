import { useState } from "react";
import { GALLERY, type GalleryItem } from "../config";

const inr = (n: number) => n.toLocaleString("en-IN");
const FILTERS: ("All" | GalleryItem["tag"])[] = ["All", "Gift", "College project", "Useful part"];
const LABEL: Record<string, string> = { All: "All", Gift: "Gifts", "College project": "College projects", "Useful part": "Useful parts" };

export default function Gallery() {
  const [f, setF] = useState<(typeof FILTERS)[number]>("All");
  const items = GALLERY.filter((i) => f === "All" || i.tag === f);
  return (
    <section id="gallery" className="scroll-mt-16 bg-soft">
      <div className="section">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Our prints</p>
            <h2 className="h2 mt-4">Things we have made</h2>
            <p className="mt-3 text-mute">Real prints from our shop. Your idea can be next.</p>
          </div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter prints">
            {FILTERS.map((x) => (
              <button key={x} role="tab" aria-selected={f === x} onClick={() => setF(x)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${f === x ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-ink/30"}`}>
                {LABEL[x]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {items.map((item) => (
            <figure key={item.title} className="group overflow-hidden rounded-3xl border border-line bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-24px_rgba(19,153,236,0.45)]">
              {item.image ? (
                <img src={item.image} alt={item.title} loading="lazy" className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
              ) : (
                <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-gradient-to-br from-brand-soft to-white">
                  <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle,rgba(19,153,236,0.18)_1px,transparent_1px)] [background-size:14px_14px]" />
                  <img src="/logo-icon.png" alt="" className="relative h-1/3 w-auto opacity-30 transition duration-500 group-hover:scale-110 group-hover:opacity-50" />
                  <span className="absolute bottom-3 text-[11px] font-medium text-brand/70">Photo coming soon</span>
                </div>
              )}
              <figcaption className="p-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">{item.tag}</span>
                <p className="mt-1 font-display font-bold leading-snug">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-mute">{item.caption}</p>
                <p className="mt-3 text-sm font-semibold">{item.priceFrom != null ? `from ₹${inr(item.priceFrom)}` : "Price on WhatsApp"}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-xs text-mute">Prices depend on size, colour and quantity. We confirm the exact price on WhatsApp before printing.</p>
      </div>
    </section>
  );
}
