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

// Swatch colours for the 3D preview and colour picker (approximate on screen).
export const COLOUR_HEX: Record<string, string> = {
  White: "#f3f3f1", Black: "#2a2a2c", "Baby pink": "#f5b7c9", Yellow: "#f6d23a",
  "Sea green (pista)": "#93d5b4", Skin: "#e9c4a2", Silver: "#b9bdc4", "Not sure": "#1399ec",
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

// Real prints from the shop (photos from our Google Maps listing, 2026-11-25). Soham sets each "from ₹" price.
const g = (title: string, caption: string, image: string, tag: GalleryItem["tag"]): GalleryItem =>
  ({ title, caption, image, tag, priceFrom: null });

export const GALLERY: GalleryItem[] = [
  g("Ganesha bust", "Fine detail in white. A gift people keep for years.", "/gallery/ganesha.webp", "Gift"),
  g("Hanuman figure", "Detailed idol, finished to look like stone.", "/gallery/hanuman.webp", "Gift"),
  g("Name sign", "Any name, any colour, for a desk or a door.", "/gallery/name-sign.webp", "Gift"),
  g("Heart", "A soft-textured heart, made as a gift.", "/gallery/heart.webp", "Gift"),
  g("Cactus planter", "A cute two-colour planter with a cactus.", "/gallery/cactus-planter.webp", "Gift"),
  g("Sheep figurine", "A small figurine on its own stand.", "/gallery/sheep.webp", "Gift"),
  g("Pen holder", "Light voronoi pattern, only possible with 3D printing.", "/gallery/pen-holder.webp", "Gift"),
  g("Hotel floor-plan model", "A floor plan turned into a model you can hold, with furniture.", "/gallery/floor-plan.webp", "College project"),
  g("Robot car body", "Custom body for a student robot car, with space for the electronics.", "/gallery/robot-car.webp", "College project"),
  g("Robot arm", "Servo-driven arm parts that fit together.", "/gallery/robot-arm.webp", "College project"),
  g("Drone casing", "A strong ABS casing for a drone project.", "/gallery/drone-casing.webp", "Useful part"),
  g("Number plates", "House or locker numbers in two colours.", "/gallery/number-plates.webp", "Useful part"),
  g("Storage boxes", "Labelled boxes made to size.", "/gallery/storage-boxes.webp", "Useful part"),
];
