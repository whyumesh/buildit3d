import { FAQ } from "../content";

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 bg-soft">
      <div className="section max-w-3xl">
        <p className="eyebrow">Good to know</p>
        <h2 className="h2 mt-4">Questions</h2>
        <div className="mt-10 divide-y divide-line rounded-3xl border border-line bg-white">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-6 py-5">
              <summary className="cursor-pointer list-none font-semibold marker:hidden">
                <span className="flex items-center justify-between gap-4">
                  {f.q}
                  <span className="text-brand transition group-open:rotate-45 text-xl leading-none">+</span>
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-mute">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
