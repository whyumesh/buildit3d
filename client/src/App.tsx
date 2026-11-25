import { lazy, Suspense, useEffect, useState } from "react";
import { MessageCircle, Phone, Star, ArrowDown, ArrowUpRight, MapPin, Mail, Store, ShieldCheck } from "lucide-react";
import { SHOP, telLink, waLink } from "./config";
import Studio, { type Path } from "./components/Studio";
import Gallery from "./components/Gallery";
import HowItWorks from "./components/HowItWorks";
import Faq from "./components/Faq";
import Marquee from "./components/Marquee";

const Hero3D = lazy(() => import("./components/Hero3D"));

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
          <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] animate-[float_14s_ease-in-out_infinite] rounded-full bg-brand/20 blur-[120px]" />
          <div aria-hidden className="pointer-events-none absolute -left-32 top-1/3 h-[380px] w-[380px] animate-[float_18s_ease-in-out_infinite_reverse] rounded-full bg-sky-300/25 blur-[110px]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-2 px-5 pt-8 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pt-12">
            <div className="lg:pb-10">
              <p className="eyebrow inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {SHOP.area} · Thane</p>
              <h1 className="mt-4 font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-tightest sm:text-6xl lg:text-[4.6rem]">
                <span className="block animate-[rise_.9s_cubic-bezier(.2,.7,.2,1)_both]">Custom 3D</span>
                <span className="block animate-[rise_.9s_.08s_cubic-bezier(.2,.7,.2,1)_both]">printing in</span>
                <span className="block animate-[rise_.9s_.16s_cubic-bezier(.2,.7,.2,1)_both] bg-gradient-to-r from-brand via-sky-400 to-brand bg-[length:200%_auto] bg-clip-text text-transparent [animation:rise_.9s_.16s_cubic-bezier(.2,.7,.2,1)_both,shine_6s_linear_infinite]">Thane West</span>
              </h1>
              <p className="mt-5 max-w-xl animate-[rise_.9s_.24s_cubic-bezier(.2,.7,.2,1)_both] text-lg leading-relaxed text-mute">
                Gifts, college projects and useful parts. Drop your 3D file to see it and get a rough price, or send us a photo of your idea.
              </p>
              <div className="mt-7 flex animate-[rise_.9s_.32s_cubic-bezier(.2,.7,.2,1)_both] flex-wrap gap-3">
                <button onClick={() => go("file")} className="btn-brand">I have a 3D file <ArrowDown className="h-4 w-4" /></button>
                <button onClick={() => go("photo")} className="btn-ghost">I have a photo or idea</button>
              </div>
              <ul className="mt-8 flex animate-[rise_.9s_.4s_cubic-bezier(.2,.7,.2,1)_both] flex-wrap gap-x-6 gap-y-2 text-sm text-ink/75">
                <li><a href={SHOP.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-ink"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /><b>{SHOP.googleRating}</b> on Google · {SHOP.googleReviews} reviews</a></li>
                <li className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-brand" />A person checks every job</li>
                <li className="inline-flex items-center gap-1.5"><Store className="h-4 w-4 text-brand" />Pick up in Thane West</li>
              </ul>
            </div>
            <Suspense fallback={<div className="h-[360px] sm:h-[460px] lg:h-[560px]" />}>
              <Hero3D className="-mx-5 h-[360px] sm:mx-0 sm:h-[460px] lg:h-[560px]" />
            </Suspense>
          </div>

          <Marquee />

          <div className="relative mx-auto max-w-6xl px-3 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-16">
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

/** "BUILDIT3D" in the logo's style: bold black with "3D" in brand blue. */
function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-extrabold uppercase tracking-tight ${className}`}>
      Buildit<span className="text-brand">3D</span>
    </span>
  );
}
