# Lumino — AI-Powered Image Discovery

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)

**Lumino** is an AI-powered image discovery platform that combines curated stock photography from Unsplash with AI-generated imagery. Search millions of photos or create unique visuals from text prompts — all in one beautiful interface.

---

## ✨ Live Demo

[lumino-five.vercel.app](https://lumino-five.vercel.app/)

---

## Features

### 🔍 Browse Mode
- **Search Unsplash** — Search millions of curated, high-quality photos
- **Quick Filters** — One-click search suggestions (architecture, portrait, ocean, abstract, forest, city lights, macro, travel)
- **Responsive Masonry Grid** — Beautiful layout with featured images spanning columns
- **Lightbox Preview** — Click any image for full-size viewing with photographer credits

### 🤖 AI Studio
- **Text-to-Image Generation** — Create unique images from descriptive prompts
- **Style Presets** — Photorealistic, Cinematic, Oil Painting, Pencil Sketch, Watercolor, Neon Noir
- **Quick Ideas** — Pre-built creative prompts to get you started
- **Variation Control** — Adjust output diversity (1-5 variations)
- **Loading Animations** — Polished generation state UI with shimmer effects

### 🌓 Theme System
- **Dark/Light Mode** — Toggle between dark and light themes
- **System Preference** — Auto-detects OS color scheme on first visit
- **Persistent** — Saves preference to localStorage

### 📱 Responsive Design
- **Desktop** — Full masonry grid with sidebar potential
- **Tablet** — Adapted 2-column layouts
- **Mobile** — Single column with touch-friendly controls and overlay search

---

## Tech Stack

| Category | Technology |
|----------|-------------|
| Framework | Next.js 15 (App Router) |
| UI | React 19 |
| Styling | Tailwind CSS + CSS-in-JS (inline styles) |
| Stock Photos | Unsplash API |
| AI Generation | Pollinations.ai API |
| Deployment | Vercel |

---

## Project Structure

```
lumino/
├── app/
│   ├── page.tsx                    # Main home page (Browse + AI Studio tabs)
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                # Global styles
│   ├── [pageno]/page.tsx           # Dynamic route (/nature, /ocean, etc.)
│   ├── api/
│   │   ├── unsplash-search/       # Unsplash search proxy
│   │   │   └── route.ts
│   │   └── ai-proxy/               # Pollinations.ai image generation
│   │       └── route.ts
│   └── components/
│       ├── Header.tsx             # Sticky header with search + theme toggle
│       └── AIGenerate.tsx           # AI image generation component
├── public/
├── next.config.ts
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or pnpm / yarn)

### Environment Variables

Create a `.env.local` file in the root directory:

```env
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

Get your free Unsplash API key at [unsplash.com/developers](https://unsplash.com/developers)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd lumino

# Install dependencies
npm install
# or: pnpm install | yarn install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## API Routes

### Unsplash Search

```
GET /api/unsplash-search?query=mountains&page=1&per_page=12
```

Returns Unsplash search results with full image metadata.

### AI Image Generation

```
GET /api/ai-proxy?prompt=a%20cyberpunk%20city&seed=12345
```

Generates an image from text using Pollinations.ai. Returns a JPEG blob.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add `UNSPLASH_ACCESS_KEY` to Environment Variables
4. Deploy

Every deployment gets automatic:
- Edge runtime optimization
- Global CDN
- SSL certificates

---

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## License

MIT — see [LICENSE](LICENSE) for details.
