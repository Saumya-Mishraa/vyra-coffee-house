# VYRA — Coffee House Experience

A responsive React + Vite café storefront concept designed for a portfolio presentation. The design uses an editorial, warm-toned identity rather than copying the supplied reference layout pixel-for-pixel.

## Features
- Responsive phone, tablet, and desktop layouts
- Motion-powered entrance/reveal transitions and layout animation
- Interactive menu filters and live search
- Product favourites and frontend cart with quantity controls
- Mobile bottom navigation and animated mobile menu/cart drawers
- Responsive image cards, hover treatments, ticker, and reduced-motion support
- Frontend-only demo checkout (not connected to payments or a backend)

## Run locally
1. Install Node.js (18+ recommended).
2. In this folder run `npm install`.
3. Run `npm run dev` and open the local URL Vite prints.
4. Run `npm run build` to create the production build in `dist/`.

## Customization
- Edit products, copy and image URLs in `src/main.jsx`; type is Instrument Serif + Manrope.
- Adjust color tokens and responsive breakpoints in `src/styles.css`.
- Photos currently load from Unsplash URLs and Google Fonts load from Google Fonts, so an internet connection is needed for those assets.

## Note
This is a frontend portfolio demo. Cart and search interactions run in the browser; checkout, ordering, authentication, and inventory are not connected to a backend.
