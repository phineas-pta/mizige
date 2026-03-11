# 米字格 (Mǐzìgé) — Chinese Character Practice Sheet Generator

A web app for generating printable Chinese character practice worksheets with stroke order guides, pinyin annotations, and PDF export.

Built to help elementary students learn to write Chinese characters correctly.

## Features

- **Stroke Order Guide** — progressive stroke-by-stroke visualization using vector paths from [hanzi-writer-data](https://github.com/chanind/hanzi-writer-data)
- **米字格 / 田字格 grids** — toggle between diagonal-guide and cross-guide grid styles
- **Pinyin annotations** — auto-generated tone-marked pinyin above reference characters
- **Configurable layout** — adjust trace cells, blank cells, cell size, and max stroke frames
- **PDF export** — multi-page A4 or Letter output
- **LXGW WenKai font** — KaiTi-style font optimized for character education

## Tech Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · jsPDF · html2canvas-pro · pinyin-pro

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## License

Private
