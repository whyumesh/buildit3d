import { useEffect, useState } from "react";
import { MessageCircle, Phone, Star, ArrowDown, ArrowUpRight, MapPin, Mail, Store, ShieldCheck } from "lucide-react";
import { SHOP, telLink, waLink } from "./config";
import Studio, { type Path } from "./components/Studio";
import Gallery from "./components/Gallery";
import HowItWorks from "./components/HowItWorks";
import Faq from "./components/Faq";

const HELLO = "Hi Buildit3D, I want to get something 3D printed.";

/** Fade elements in as they scroll into view. */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

export default function App() {
  const [path, setPath] = useState<Path>("file");
  useReveal();

  const go = (p: Path) => {
    setPath(p);
    document.getElementById("studio")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <a href="#studio" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-white">
        Skip to the price check
      </a>

      <header className="fixed inset-x-0 top-0 z-30 border-b border-line/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
          <a href="#top" className="flex items-center gap-2" aria-label="Buildit3D home">
            <img src="/logo-icon.png" alt="" className="h-9 w-auto" />
            <Wordmark className="text-xl" />
          </a>
          <nav className="flex items-center gap-1 text-sm text-mute">
            <a href="#gallery" className="hidden rounded-full px-3 py-2 hover:text-ink md:inline">Our prints</a>
            <a href="#how" className="hidden rounded-full px-3 py-2 hover:text-ink md:inline">How it works</a>
            <a href="#faq" className="hidden rounded-full px-3 py-2 hover:text-ink md:inline">Questions</a>
            <a href={telLink} className="ml-2 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-ink hover:border-ink/30" aria-label={`Call ${SHOP.phoneDisplay}`}>
              <Phone className="h-4 w-4" /> <span className="hidden sm:inline">{SHOP.phoneDisplay}</span>
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* Hero + studio */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-soft via-white to-white pt-20">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(19,153,236,0.16)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
          <div className="relative mx-auto max-w-6xl px-5 pb-8 pt-10 sm:px-8 sm:pt-16">
            <div className="grid items-end gap-8 lg:grid-cols-[1.35fr_1fr]">
              <div>
                <p className="eyebrow inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {SHOP.area} · Thane</p>
                <h1 className="mt-4 font-display text-[2.5rem] font-extrabold leading-[1.04] tracking-tightest sm:text-6xl lg:text-[4.4rem]">
                  Custom 3D printing in <span className="text-brand">Thane West</span>
                </h1>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-mute">
                  Gifts, college projects and useful parts. Drop your 3D file to see it and get a rough price, or send us a photo of your idea.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => go("file")} className="btn-brand">I have a 3D file <ArrowDown className="h-4 w-4" /></button>
                  <button onClick={() => go("photo")} className="btn-ghost">I have a photo or idea</button>
                </div>
              </div>
              <ul className="grid gap-3 text-sm sm:grid-cols-3 lg:grid-cols-1">
                <Trust icon={<Star className="h-4 w-4 fill-amber-400 text-amber-400" />} href={SHOP.mapsUrl}>
                  <b>{SHOP.googleRating} on Google</b> · {SHOP.googleReviews} reviews
                </Trust>
                <Trust icon={<ShieldCheck className="h-4 w-4 text-brand" />}>
                  <b>A person checks every job</b> · final price on WhatsApp
                </Trust>
                <Trust icon={<Store className="h-4 w-4 text-brand" />}>
                  <b>Pick up in Thane West</b> · talk in मराठी, हिंदी or English
                </Trust>
              </ul>
            </div>
          </div>

          <div className="relative mx-auto max-w-6xl px-3 pb-20 sm:px-8 sm:pb-28">
            <Studio path={path} setPath={setPath} />
          </div>
        </section>

        {/* Marathi / Hindi, said once and properly */}
        <section className="border-y border-line bg-ink text-white">
          <div className="mx-auto grid max-w-6xl gap-6 px-5 py-12 sm:px-8 md:grid-cols-2">
            <p lang="mr" className="reveal text-xl leading-snug sm:text-2xl">
              फोटो पाठवा किंवा फाईल. तुमची वस्तू आम्ही <span className="text-brand">3D प्रिंट करून</span> देतो.
            </p>
            <p lang="hi" className="reveal text-xl leading-snug sm:text-2xl">
              फोटो भेजिए या फाइल. आपकी चीज़ हम <span className="text-brand">3D प्रिंट करके</span> देंगे।
            </p>
          </div>
        </section>

        <Gallery />
        <HowItWorks />
        <Faq />

        <section>
          <div className="section reveal text-center">
            <h2 className="mx-auto max-w-3xl font-display text-4xl font-extrabold tracking-tightest sm:text-6xl">
              Have something in mind? <span className="text-brand">Let’s print it.</span>
            </h2>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <button onClick={() => go("file")} className="btn-brand">Check my 3D file</button>
              <a href={waLink(HELLO)} className="btn-wa" target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" /> WhatsApp {SHOP.phoneDisplay}</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-soft">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 text-sm text-mute sm:grid-cols-[1.4fr_1fr] sm:px-8">
          <div>
            <p className="flex items-center gap-2"><img src="/logo-icon.png" alt="" className="h-8 w-auto" /><Wordmark className="text-lg text-ink" /></p>
            <p className="mt-3 max-w-sm">Custom 3D printing in {SHOP.area}: gifts, college projects and useful parts.</p>
          </div>
          <ul className="space-y-2">
            <li><a href={telLink} className="inline-flex items-center gap-2 hover:text-ink"><Phone className="h-4 w-4" />{SHOP.phoneDisplay}</a></li>
            <li><a href={waLink(HELLO)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-ink"><MessageCircle className="h-4 w-4" />WhatsApp</a></li>
            <li><a href={`mailto:${SHOP.email}`} className="inline-flex items-center gap-2 hover:text-ink"><Mail className="h-4 w-4" />{SHOP.email}</a></li>
            <li><a href={SHOP.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-ink"><MapPin className="h-4 w-4" />Find us on Google Maps <ArrowUpRight className="h-3.5 w-3.5" /></a></li>
          </ul>
        </div>
      </footer>

      <a
        href={waLink(HELLO)} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-wa text-white shadow-[0_8px_30px_rgba(31,168,85,0.35)] transition hover:scale-105 hover:bg-wa-dark"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </>
  );
}

function Trust({ icon, href, children }: { icon: React.ReactNode; href?: string; children: React.ReactNode }) {
  const inner = (
    <span className="flex items-center gap-3 rounded-2xl border border-line bg-white/80 px-4 py-3 text-ink/80 backdrop-blur">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft">{icon}</span>
      <span>{children}</span>
    </span>
  );
  return <li>{href ? <a href={href} target="_blank" rel="noopener noreferrer" className="block transition hover:-translate-y-0.5">{inner}</a> : inner}</li>;
}

/** "BUILDIT3D" in the logo's style: bold black with "3D" in brand blue. */
function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-extrabold uppercase tracking-tight ${className}`}>
      Buildit<span className="text-brand">3D</span>
    </span>
  );
}
