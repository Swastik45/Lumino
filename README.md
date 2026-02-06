

# My App — Unsplash Image Gallery

[![Code of Conduct](https://img.shields.io/badge/code%20of%20conduct-Contributor%20Covenant-ff69b4.svg)](CODE_OF_CONDUCT.md) [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## About this App
A simple image gallery built with **Next.js** that lets you search for high-quality photos via the **Unsplash** API. Search results are displayed in a responsive masonry layout with a preview modal for each image.

> 🔧 Built to demonstrate client-side search, serverless API routes, and a responsive image gallery.

---

## Live Demo
[Lumino](https://lumino-five.vercel.app/)

---

## Folder Structure
```
my-app/
  app/
    globals.css
    layout.tsx
    page.tsx
    [pageno]/
      page.tsx
    api/
      unsplash/
        route.ts        # GET /api/unsplash?query=... -> random photo for a query
      unsplash-search/
        route.ts        # GET /api/unsplash-search?query=...&page=...&per_page=...
    components/
      Header.tsx
  public/
  next.config.ts
  package.json
  tsconfig.json
  README.md
```

---

## Features ✅
- Search Unsplash for photos
- Responsive masonry layout (uses `react-masonry-css`)
- Preview modal with photo details (description, photographer)
- Serverless API routes that proxy requests to Unsplash (keeps API key server-side)

---

## Tools & Tech Stack 🔧
- **Next.js** (app router)
- **React**
- **Tailwind CSS** (see `postcss.config.mjs`)
- **Unsplash API** (photo search and random photo endpoints)
- **react-masonry-css** for layout

---

## Requirements
- Node.js 18 or newer
- npm (or yarn / pnpm)
- An **Unsplash Developer** account and an access key
  - Create an app and get a key at: `https://unsplash.com/developers`

---

## Installation & Local Development
1. Clone the repo:

```bash
git clone <repo-url>
cd my-app
```

2. Install dependencies:

```bash
npm install
# or: pnpm install | yarn
```

3. Create a `.env.local` in the project root with your Unsplash key:

```
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

4. Run the dev server:

```bash
npm run dev
# open http://localhost:3000
```

---

## API Routes (internal)
- `GET /api/unsplash?query=YOUR_QUERY` — returns a random photo for the query (url, description, photographer)
- `GET /api/unsplash-search?query=YOUR_QUERY&page=1&per_page=8` — returns Unsplash search results (matches Unsplash response schema)

Example using `curl`:
```bash
curl "http://localhost:3000/api/unsplash-search?query=mountains&page=1&per_page=8"
```

---

## Scripts
- `npm run dev` — start development server
- `npm run build` — build for production
- `npm run start` — start built app
- `npm run lint` — run ESLint

---

## Deployment
Recommended: **Vercel**. When you deploy, add the `UNSPLASH_ACCESS_KEY` environment variable to your project's settings on the host.

---

## Contributing
Feel free to open issues or PRs. Replace `Your Name` in the author/credits as needed.

---

## License
MIT — see `LICENSE` (add one if you need a license file).


