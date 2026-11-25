const STEPS = [
  { en: "Send us your file, or photos and your idea, on WhatsApp.", mr: "WhatsApp वर फाईल किंवा फोटो पाठवा.", hi: "WhatsApp पर फाइल या फोटो भेजें।" },
  { en: "We check it and reply with a price. Every request is checked by a person.", mr: "आम्ही तपासून किंमत सांगतो.", hi: "हम देखकर कीमत बताते हैं।" },
  { en: "You say yes. If you only have a photo, we design it for you first.", mr: "तुम्ही हो म्हणता.", hi: "आप हां कहें।" },
  { en: "We print it. You pick it up from our shop in Thane West.", mr: "आम्ही प्रिंट करतो, तुम्ही घ्यायला या.", hi: "हम प्रिंट करते हैं, आप ले जाएं।" },
];

export default function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-16">
      <div className="section">
        <h2 className="h2">How it works</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={i} className="rounded-2xl border border-slate-200 p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white font-bold">{i + 1}</span>
              <p className="mt-3 font-medium">{s.en}</p>
              <p lang="mr" className="mt-2 text-sm text-slate-600">{s.mr}</p>
              <p lang="hi" className="text-sm text-slate-600">{s.hi}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
