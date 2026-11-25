// Everything Soham may want to change lives in this file.
// Phone, stock colours, gallery items and their "from ₹" prices.

export const SHOP = {
  name: "Buildit3D",
  area: "Thane West",
  // Shown on the site (calls) and used for the WhatsApp link.
  phoneDisplay: "099675 76250",
  phoneIntl: "919967576250", // +91 99675 76250, digits only for wa.me and tel:
  email: "buildit3d.services@gmail.com", // fallback for people without WhatsApp
  mapsUrl: "https://maps.app.goo.gl/BejPh5ueeDmM4NKa7",
  googleRating: "5.0",
  googleReviews: 38,
};

export const telLink = `tel:+${SHOP.phoneIntl}`;
export const waLink = (text?: string) =>
  `https://wa.me/${SHOP.phoneIntl}` + (text ? `?text=${encodeURIComponent(text)}` : "");

// Filaments in stock (keep in step with stock.json in the print-shop folder).
export const STOCK: Record<string, string[]> = {
  PLA: ["White", "Black", "Baby pink", "Yellow", "Sea green (pista)", "Skin"],
  PETG: ["White"],
  ABS: ["Silver"],
};

export type GalleryItem = {
  title: string;
  caption: string;
  /** "from ₹" price. Soham fills it; null shows "Price on WhatsApp". Never guess. */
  priceFrom: number | null;
  /** Photo in client/public/gallery/. null shows a placeholder tile. */
  image: string | null;
  tag: "Gift" | "College project" | "Useful part";
};

// Real prints from the shop. Add a photo and a price per item before launch.
export const GALLERY: GalleryItem[] = [
  { title: "Ganesha bust", caption: "Fine detail, a gift people keep for years.", priceFrom: null, image: null, tag: "Gift" },
  { title: "Name sign", caption: "Your name or a loved one's name for a desk or door.", priceFrom: null, image: null, tag: "Gift" },
  { title: "Couple-name gift", caption: "Two names, one gift. For anniversaries and weddings.", priceFrom: null, image: null, tag: "Gift" },
  { title: "Pet miniature from a photo", caption: "Send a photo of your pet. We make a small copy.", priceFrom: null, image: null, tag: "Gift" },
  { title: "Truck model", caption: "A model truck for a boy, changed until it was just right.", priceFrom: null, image: null, tag: "Gift" },
  { title: "Floor-plan model", caption: "A floor plan turned into a model you can hold.", priceFrom: null, image: null, tag: "College project" },
  { title: "Drone casing", caption: "A strong ABS casing for a drone project.", priceFrom: null, image: null, tag: "Useful part" },
  { title: "Cable organiser", caption: "Keeps your desk cables tidy.", priceFrom: null, image: null, tag: "Useful part" },
];
