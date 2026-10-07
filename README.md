# ESCANER-AR

Vite + plain JS prototype: scan a book barcode (ISBN) with ZXing, look it up in
`public/books.json`, then show an AR-style looping animation over the camera feed.
The AR view is a placeholder; real image tracking (MindAR) is marked with TODOs in `src/ar.js`.

## Local development
```
npm install
npm run dev      # open the printed URL; camera needs HTTPS or localhost
npm run build
```
Without a camera, type the ISBN in the input (sample: `9780140328721`).

## Structure
- `src/main.js` – flow: scan → lookup → AR / not-found
- `src/scanner.js` – ZXing scanning
- `src/books.js` – loads and queries `books.json`
- `src/ar.js` – AR placeholder overlay (TODO: MindAR tracking)
- `public/books.json` – `{ "<isbn>": { "title", "target", "animation" } }`
- `public/animations/` – looping assets (`.mp4`, `.webm`, `.gif`, `.svg`; MP4 is safest on iOS)
- `public/targets/` – compiled MindAR `.mind` files, one per cover (compile at the MindAR image target compiler)

## Adding a book
1. Add the ISBN (digits only) to `public/books.json`.
2. Put the animation in `public/animations/` and (later) the `.mind` file in `public/targets/`.

## Deploy to Vercel
1. Push to GitHub, then "Add New Project" in Vercel and import the repo.
2. Framework preset: Vite (build `npm run build`, output `dist`; set in `vercel.json`).
3. Deploy. Vercel serves HTTPS, which is required for camera access. Test on a real phone.
