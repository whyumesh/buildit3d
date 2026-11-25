// Text used both on the page and in the search-engine data (JSON-LD), so they never disagree.
import { SHOP, STOCK } from "./config";

const materials = Object.entries(STOCK)
  .map(([m, cs]) => `${m} (${cs.map((c) => c.toLowerCase()).join(", ")})`)
  .join(", ");

export const FAQ = [
  { q: "Do I need a 3D file?", a: "No. Send a photo or tell us your idea and we design it for you. If you do have a file (STL, 3MF or STEP), drop it on this page to see it in 3D with a rough price, then send it on WhatsApp." },
  { q: "How much does 3D printing cost?", a: "It depends on size, material, colour and quantity. Drop your 3D file on this page for a rough estimate. For a photo or idea, we reply on WhatsApp with the price before we print." },
  { q: "How big can you print?", a: "One piece can be up to about 25 cm long, 25 cm wide and 25 cm tall. Something bigger? Ask us on WhatsApp." },
  { q: "How long does it take?", a: "Most prints are ready in 1 to 2 days. Bigger prints take longer. We confirm the date together with the price." },
  { q: "Do you deliver?", a: `You can pick up from our shop in ${SHOP.area}, Thane. Or we book a Porter or Borzo delivery to you, at your choice and cost.` },
  { q: "What materials do you use?", a: `Right now: ${materials}. Not sure which is right? Tell us how you will use it and we will suggest one.` },
  { q: "Is the price fixed before you print?", a: "Yes. A person checks every request and sends the price on WhatsApp before anything is printed." },
];
