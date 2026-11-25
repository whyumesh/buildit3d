import { ImageIcon } from "lucide-react";
import { GALLERY } from "../config";

const inr = (n: number) => n.toLocaleString("en-IN");

export default function Gallery() {
  return (
    <section id="gallery" className="scroll-mt-16 bg-slate-50">
      <div className="section">
        <h2 className="h2">Things we have made</h2>
        <p className="mt-1 text-sm text-slate-600">
          <span lang="mr">आम्ही बनवलेल्या वस्तू</span> · <span lang="hi">हमारी बनाई चीज़ें</span>
        </p>
        <p className="mt-3 text-slate-700">Real prints from our shop. Your idea can be next.</p>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {GALLERY.map((item) => (
            <figure key={item.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {item.image ? (
                <img src={item.image} alt={item.title} loading="lazy" className="aspect-square w-full object-cover" />
              ) : (
                <div className="flex aspect-square w-full flex-col items-center justify-center gap-1 bg-slate-100 text-slate-400">
                  <ImageIcon className="h-8 w-8" />
                  <span className="text-xs">Photo coming</span>
                </div>
              )}
              <figcaption className="p-3">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-brand">{item.tag}</span>
                <p className="font-semibold leading-snug">{item.title}</p>
                <p className="mt-1 text-xs text-slate-600">{item.caption}</p>
                <p className="mt-2 text-sm font-semibold">
                  {item.priceFrom != null ? `from ₹${inr(item.priceFrom)}` : "Price on WhatsApp"}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">Prices depend on size, colour and quantity. We confirm the exact price on WhatsApp before printing.</p>
      </div>
    </section>
  );
}
