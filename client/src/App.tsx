import { useEffect, useState } from "react";
import { MessageCircle, Phone, Star, ArrowRight, ArrowUpRight, MapPin, Mail } from "lucide-react";
import { SHOP, telLink, waLink } from "./config";
import EnquiryForm, { type Path } from "./components/EnquiryForm";
import Gallery from "./components/Gallery";
import HowItWorks from "./components/HowItWorks";
import Faq from "./components/Faq";
import PrintAnimation from "./components/PrintAnimation";

const HELLO = "Hi Buildit3D, I want to get something 3D printed.";

/** Fade sections in as they scroll into view. */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

export default function App() {
  const [path, setPath] = useState<Path | null>(null);
  useReveal();

  const choose = (p: Path) => {
    setPath(p);
    requestAnimationFrame(() => document.getElementById("enquiry")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <>
      <a href="#start" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-white">
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-30 border-b border-line/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
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
        {/* Hero */}
        <section className="relative overflow-hidden pt-20">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_55%,rgba(19,153,236,0.12),transparent_70%)]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-4 px-5 pb-10 pt-10 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:pb-24 lg:pt-20">
            <div>
              <p className="eyebrow inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {SHOP.area} · Thane</p>
              <h1 className="mt-5 font-display text-[2.5rem] font-extrabold leading-[1.04] tracking-tightest sm:text-6xl lg:text-7xl">
                Custom 3D printing in <span className="text-brand">Thane West</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute">
                Gifts, college projects and useful parts. Send a file or just a photo. We reply on WhatsApp with a price.
              </p>
              <div className="mt-5 space-y-1 text-[15px] text-ink/70">
                <p lang="mr">ठाण्यात तुमच्या कल्पनेची 3D प्रिंट. फाईल असो वा फक्त फोटो, आम्ही बनवून देतो.</p>
                <p lang="hi">आपका आइडिया, हमारी 3D प्रिंट। फाइल हो या सिर्फ फोटो, हम बना देते हैं।</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#start" className="btn-brand">Get a price <ArrowRight className="h-4 w-4" /></a>
                <a href={waLink(HELLO)} className="btn-ghost" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" /> WhatsApp us
                </a>
              </div>
              <a href={SHOP.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm text-mute hover:text-ink">
                <span className="flex">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</span>
                {SHOP.googleRating} on Google · {SHOP.googleReviews} reviews
              </a>
            </div>
            <PrintAnimation className="-mx-5 aspect-square w-[calc(100%+2.5rem)] sm:mx-auto sm:w-full sm:max-w-[560px]" />
          </div>
        </section>

        {/* Two equal paths */}
        <section id="start" className="scroll-mt-16 bg-soft">
          <div className="section pb-16 sm:pb-20">
            <div className="reveal max-w-2xl">
              <p className="eyebrow">Start here</p>
              <h2 className="h2 mt-4">What do you have?</h2>
              <p className="mt-4 text-mute">Pick one. It takes a minute, and your answers go straight to our WhatsApp.</p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2">
              <PathCard
                n="01" active={path === "file"} onClick={() => choose("file")}
                title="I have a 3D file" mr="माझ्याकडे 3D फाईल आहे" hi="मेरे पास 3D फाइल है"
                line="Send your STL, 3MF or STEP file. Tell us material and colour. We check it and reply with a price."
                art={<FileArt />}
              />
              <PathCard
                n="02" active={path === "photo"} onClick={() => choose("photo")}
                title="I have a photo or idea" mr="माझ्याकडे फोटो किंवा कल्पना आहे" hi="मेरे पास फोटो या आइडिया है"
                line="No file? No problem. Send photos or tell us what you want. We design it and print it."
                art={<PhotoArt />}
              />
            </div>
          </div>
          {path && <EnquiryForm path={path} onSwitch={setPath} />}
        </section>

        <Gallery />
        <HowItWorks />
        <Faq />

        {/* Closing call to action */}
        <section className="border-t border-line">
          <div className="section reveal text-center">
            <h2 className="mx-auto max-w-3xl font-display text-4xl font-extrabold tracking-tightest sm:text-6xl">
              Have something in mind? <span className="text-brand">Let’s print it.</span>
            </h2>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a href={waLink(HELLO)} className="btn-wa" target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" /> WhatsApp {SHOP.phoneDisplay}</a>
              <a href={telLink} className="btn-ghost"><Phone className="h-4 w-4" /> Call us</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 text-sm text-mute sm:grid-cols-[1.4fr_1fr] sm:px-8">
          <div>
            <p className="flex items-center gap-2"><img src="/logo-icon.png" alt="" className="h-8 w-auto" /><Wordmark className="text-lg" /></p>
            <p className="mt-3">Custom 3D printing in {SHOP.area}.</p>
            <p lang="mr" className="mt-1">Buildit3D, ठाणे पश्चिम. WhatsApp किंवा कॉल: {SHOP.phoneDisplay}</p>
            <p lang="hi">Buildit3D, ठाणे वेस्ट। WhatsApp या कॉल: {SHOP.phoneDisplay}</p>
          </div>
          <ul className="space-y-2">
            <li><a href={telLink} className="inline-flex items-center gap-2 hover:text-ink"><Phone className="h-4 w-4" />{SHOP.phoneDisplay}</a></li>
            <li><a href={waLink(HELLO)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-ink"><MessageCircle className="h-4 w-4" />WhatsApp</a></li>
            <li><a href={`mailto:${SHOP.email}`} className="inline-flex items-center gap-2 hover:text-ink"><Mail className="h-4 w-4" />{SHOP.email}</a></li>
            <li><a href={SHOP.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-ink"><MapPin className="h-4 w-4" />Find us on Google Maps <ArrowUpRight className="h-3.5 w-3.5" /></a></li>
          </ul>
        </div>
      </footer>

      {/* Floating WhatsApp button */}
      <a
        href={waLink(HELLO)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-wa text-white shadow-[0_8px_30px_rgba(31,168,85,0.35)] transition hover:scale-105 hover:bg-wa-dark"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </>
  );
}

function PathCard(props: {
  n: string; active: boolean; onClick: () => void; title: string; mr: string; hi: string; line: string; art: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      aria-pressed={props.active}
      className={`reveal group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white p-7 text-left transition duration-300 hover:-translate-y-0.5 hover:border-brand/60 hover:shadow-[0_20px_50px_-20px_rgba(19,153,236,0.35)] sm:p-9 ${
        props.active ? "border-brand shadow-[0_0_0_4px_rgba(19,153,236,0.14)]" : "border-line"
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="font-display text-sm text-mute">{props.n}</span>
        <span className="text-brand transition duration-500 group-hover:scale-105">{props.art}</span>
      </div>
      <span className="mt-8 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{props.title}</span>
      <span lang="mr" className="mt-2 text-sm text-mute">{props.mr}</span>
      <span lang="hi" className="text-sm text-mute">{props.hi}</span>
      <span className="mt-5 max-w-md leading-relaxed text-ink/80">{props.line}</span>
      <span className="mt-8 inline-flex items-center gap-2 font-semibold text-brand">
        Start <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </button>
  );
}

/** Line-art: a cube in wireframe (3D file). */
function FileArt() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M32 8 54 20v24L32 56 10 44V20z" />
      <path d="M10 20l22 12 22-12M32 32v24" />
      <path d="M21 14l22 12M43 14 21 26" strokeOpacity=".35" />
    </svg>
  );
}

/** Line-art: a photo turning into layers (photo or idea). */
function PhotoArt() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="10" width="30" height="24" rx="4" />
      <circle cx="15" cy="19" r="3" />
      <path d="M6 30l9-8 8 7 5-4 8 6" />
      <path d="M40 54h18M42 49h14M44 44h10M46 39h6" />
      <path d="M36 22c8 0 12 4 13 12" strokeDasharray="2 3" />
    </svg>
  );
}

/** "BUILDIT3D" set in the logo's style: bold black with "3D" in brand blue. */
function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-extrabold uppercase tracking-tight ${className}`}>
      Buildit<span className="text-brand">3D</span>
    </span>
  );
}
