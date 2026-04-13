# RDZN Studio Website

Homepage for **RDZN Studio** — a full-service creative house crafting 3D cinematics and CG content for gaming, esports, and global IPs.

## Structure

```
RDZN_WEBSITE/
├── index.html           # Main entry point
├── css/
│   └── style.css        # All styles
├── js/
│   └── main.js          # All interactivity
├── font/
│   ├── Phonk-Contrast.otf
│   └── BebasNeue-Regular.otf
├── media/
│   ├── RDZN_LOGO_TYPE_WHITE.png
│   ├── RDZN_LOGO_WHITE.png
│   ├── website_background.mp4
│   ├── website_homepage_design.png
│   └── website_loading.gif
└── skills/              # Plugin/skill modules
```

## Tech Stack

- **HTML5** — Semantic structure
- **Vanilla CSS** — Custom properties, animations, responsive layout
- **Vanilla JS** — Custom cursor, loading screen, modals, contact copy
- **Custom Fonts** — Phonk Contrast, Bebas Neue

## Features

- Cinematic loading screen with animated GIF intro
- Full-screen background video hero section
- Custom animated cursor with contextual states
- Contact modal with email copy-to-clipboard
- Video showreel modal (placeholder)
- Infinite scrolling partner ticker
- Zero dependencies — no build tools required

## Local Development

Open `index.html` directly in a browser, or use any local server:

```bash
npx serve .
```
