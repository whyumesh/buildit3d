import { STOCK } from "../config";

const materials = Object.entries(STOCK)
  .map(([m, cs]) => `${m} (${cs.map((c) => c.toLowerCase()).join(", ")})`)
  .join(", ");

const FAQ = [
  { q: "Do I need a 3D file?", a: "No. Send a photo or tell us your idea. We design it for you. If you do have a file (STL, 3MF or STEP), send it and we will check it." },
  { q: "How big can you print?", a: "One piece can be up to about 25 cm long, 25 cm wide and 25 cm tall. Something bigger? Ask us on WhatsApp." },
  { q: "How long does it take?", a: "Small items can be quick, bigger items take longer. We tell you the date together with the price." },
  { q: "How do I pay, and how do I collect?", a: "We agree the price on WhatsApp first. Ask us there about payment. You collect from our shop in Thane West." },
  { q: "What materials do you use?", a: `Right now: ${materials}. Not sure which is right? Tell us how you will use it and we will suggest one.` },
  { q: "Is the price fixed before you print?", a: "Yes. We check every request and send the price on WhatsApp. There is no instant price on this website." },
];

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 bg-slate-50">
      <div className="section max-w-3xl">
        <h2 className="h2">Questions</h2>
        <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {FAQ.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="cursor-pointer list-none font-semibold marker:hidden">
                <span className="flex items-center justify-between gap-4">
                  {f.q}
                  <span className="text-brand transition group-open:rotate-45 text-xl leading-none">+</span>
                </span>
              </summary>
              <p className="mt-3 text-slate-700">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
