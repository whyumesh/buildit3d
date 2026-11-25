import { useState } from "react";
import { MessageCircle, Phone, Star, FileBox, Camera, MapPin, Mail } from "lucide-react";
import { SHOP, telLink, waLink } from "./config";
import EnquiryForm, { type Path } from "./components/EnquiryForm";
import Gallery from "./components/Gallery";
import HowItWorks from "./components/HowItWorks";
import Faq from "./components/Faq";

export default function App() {
  const [path, setPath] = useState<Path | null>(null);

  const choose = (p: Path) => {
    setPath(p);
    requestAnimationFrame(() =>
      document.getElementById("enquiry")?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <a href="#top" className="flex items-center gap-2 text-lg font-bold text-brand">
            <img src="/favicon.svg" alt="" className="h-8 w-8" />
            {SHOP.name}
          </a>
          <nav className="flex items-center gap-2 text-sm">
            <a href="#gallery" className="hidden px-2 py-1 hover:text-brand sm:inline">Our prints</a>
            <a href="#how" className="hidden px-2 py-1 hover:text-brand sm:inline">How it works</a>
            <a href="#faq" className="hidden px-2 py-1 hover:text-brand sm:inline">FAQ</a>
            <a href={telLink} className="btn-ghost px-3 py-2" aria-label={`Call ${SHOP.phoneDisplay}`}>
              <Phone className="h-4 w-4" /> <span className="hidden sm:inline">{SHOP.phoneDisplay}</span>
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="bg-gradient-to-b from-brand-soft to-white">
          <div className="section pb-10 sm:pb-14">
            <p className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-brand">
              <MapPin className="h-4 w-4" /> {SHOP.area}, Thane
            </p>
            <h1 className="text-3xl font-bold leading-tight sm:text-5xl">Custom 3D printing in Thane West</h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-700">
              Gifts, college projects and useful parts. Send a file or just a photo. We reply on WhatsApp with a price.
            </p>
            <p lang="mr" className="mt-3 text-slate-700">ठाण्यात तुमच्या कल्पनेची 3D प्रिंट. फाईल असो वा फक्त फोटो, आम्ही बनवून देतो.</p>
            <p lang="hi" className="mt-1 text-slate-700">आपका आइडिया, हमारी 3D प्रिंट। फाइल हो या सिर्फ फोटो, हम बना देते हैं।</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href={waLink("Hi Buildit3D, I want to get something 3D printed.")} className="btn-wa" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" /> WhatsApp us
              </a>
              <a href={telLink} className="btn-ghost">
                <Phone className="h-5 w-5" /> Call {SHOP.phoneDisplay}
              </a>
            </div>
            <a href={SHOP.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm text-slate-600 hover:text-brand">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {SHOP.googleRating} on Google, {SHOP.googleReviews} reviews
            </a>
          </div>

          {/* Two equal paths */}
          <div className="mx-auto grid max-w-5xl gap-4 px-4 pb-14 sm:grid-cols-2">
            <PathCard
              active={path === "file"}
              onClick={() => choose("file")}
              icon={<FileBox className="h-8 w-8" />}
              title="I have a 3D file"
              mr="माझ्याकडे 3D फाईल आहे"
              hi="मेरे पास 3D फाइल है"
              line="Send your STL, 3MF or STEP file. Tell us material and colour. We check it and reply with a price."
            />
            <PathCard
              active={path === "photo"}
              onClick={() => choose("photo")}
              icon={<Camera className="h-8 w-8" />}
              title="I have a photo or idea"
              mr="माझ्याकडे फोटो किंवा कल्पना आहे"
              hi="मेरे पास फोटो या आइडिया है"
              line="No file? No problem. Send photos or tell us what you want. We design it and print it."
            />
          </div>
        </section>

        {path && <EnquiryForm path={path} onSwitch={setPath} />}

        <Gallery />
        <HowItWorks />
        <Faq />
      </main>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-5xl space-y-2 px-4 py-10 text-sm text-slate-600">
          <p className="font-semibold text-ink">{SHOP.name}, custom 3D printing in {SHOP.area}</p>
          <p>
            WhatsApp or call <a href={telLink} className="font-semibold text-brand">{SHOP.phoneDisplay}</a>
            {" · "}
            <a href={`mailto:${SHOP.email}`} className="inline-flex items-center gap-1 hover:text-brand"><Mail className="h-3.5 w-3.5" />{SHOP.email}</a>
            {" · "}
            <a href={SHOP.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand">Find us on Google Maps</a>
          </p>
          <p lang="mr">Buildit3D, ठाणे पश्चिम. WhatsApp किंवा कॉल: {SHOP.phoneDisplay}</p>
          <p lang="hi">Buildit3D, ठाणे वेस्ट। WhatsApp या कॉल: {SHOP.phoneDisplay}</p>
        </div>
      </footer>

      {/* Floating WhatsApp button */}
      <a
        href={waLink("Hi Buildit3D, I want to get something 3D printed.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-wa text-white shadow-lg hover:bg-wa-dark"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </>
  );
}

function PathCard(props: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  mr: string;
  hi: string;
  line: string;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      aria-pressed={props.active}
      className={`flex h-full flex-col rounded-2xl border-2 bg-white p-6 text-left shadow-sm transition hover:border-brand hover:shadow-md ${
        props.active ? "border-brand ring-4 ring-brand/15" : "border-slate-200"
      }`}
    >
      <span className="mb-3 text-brand">{props.icon}</span>
      <span className="text-xl font-bold">{props.title}</span>
      <span lang="mr" className="text-sm text-slate-600">{props.mr}</span>
      <span lang="hi" className="text-sm text-slate-600">{props.hi}</span>
      <span className="mt-3 text-slate-700">{props.line}</span>
      <span className="btn-brand mt-5 self-start">Start here</span>
    </button>
  );
}
