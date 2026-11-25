import { GALLERY } from "../config";

const inr = (n: number) => n.toLocaleString("en-IN");

export default function Gallery() {
  return (
    <section id="gallery" className="scroll-mt-16 bg-soft">
      <div className="section">
        <p className="eyebrow">Our prints</p>
        <h2 className="h2 mt-4">Things we have made</h2>
        <p className="mt-2 text-sm text-mute">
          <span lang="mr">आम्ही बनवलेल्या वस्तू</span> · <span lang="hi">हमारी बनाई चीज़ें</span>
        </p>
        <p className="mt-3 text-mute">Real prints from our shop. Your idea can be next.</p>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {GALLERY.map((item) => (
            <figure key={item.title} className="reveal group overflow-hidden rounded-3xl border border-line bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-24px_rgba(19,153,236,0.45)]">
              {item.image ? (
                <img src={item.image} alt={item.title} loading="lazy" className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
              ) : (
                <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-gradient-to-br from-brand-soft to-white">
                  <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle,rgba(19,153,236,0.18)_1px,transparent_1px)] [background-size:14px_14px]" />
                  <img src="/logo-icon.png" alt="" className="relative h-1/3 w-auto opacity-30" />
                  <span className="absolute bottom-3 text-[11px] font-medium text-brand/70">Photo coming soon</span>
                </div>
              )}
              <figcaption className="p-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">{item.tag}</span>
                <p className="mt-1 font-display font-bold leading-snug">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-mute">{item.caption}</p>
                <p className="mt-3 text-sm font-semibold text-ink">
                  {item.priceFrom != null ? `from ₹${inr(item.priceFrom)}` : "Price on WhatsApp"}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-xs text-mute">Prices depend on size, colour and quantity. We confirm the exact price on WhatsApp before printing.</p>
      </div>
    </section>
  );
}
