# buildit3d.in

One-page website for Buildit3D, custom 3D printing in Thane West.
React + Vite + Tailwind, built to static files and hosted on Netlify. No server, no database.

## Run locally
```
npm install
npm run dev        # http://localhost:5000
npm run build      # output in dist/public
npm run preview    # serve the built site on http://localhost:5000
```

## How enquiries work
The two paths ("I have a 3D file" / "I have a photo or idea") are short forms. "Send on WhatsApp" opens
WhatsApp to the shop number with the answers typed out; the customer attaches the file or photos in that chat.
Nothing is uploaded to or stored by this website. Quotes are reviewed by the shop and sent back on WhatsApp.

## What to edit
`client/src/config.ts`: phone number, email, Maps link, rating, filaments in stock, gallery items and "from ₹" prices.
Gallery photos go in `client/public/gallery/` (see the README there).

Rules for this site: prices in ₹ only, never invented; no GST line (not registered); no claims we cannot back up;
no characters owned by others in the gallery.
