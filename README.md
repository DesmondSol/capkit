### CapKit

![CapKit](https://img.shields.io/badge/CapKit-AI%20Startup%20Studio-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Build](https://img.shields.io/badge/Build-Vite%206-orange?style=flat-square)
![Runtime](https://img.shields.io/badge/React-19-informational?style=flat-square)

CapKit is an AI‑powered startup studio template that helps founders move from idea to investor‑ready collateral, research, and initial go‑to‑market plans—fast.

Live: `https://capkit.vercel.app`

---

### Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [FAQ](#faq)
- [Contributing](#contributing)
- [Code of Conduct](#code-of-conduct)
- [License](#license)

---

### Features

- **Market Research**: Competitor scans, segmentation, and JTBD insights
- **Personas & JTBD**: Buyer personas and job stories
- **Product Planning**: Brainstorming, feature planning, action board, feedback aggregation
- **Copywriting**: Pitches, one‑pagers, social posts, and strategies
- **Sales & GTM**: Go‑to‑market plans and simple CRM scaffolding
- **Economics**: Unit economics, burn‑rate, and lightweight projections
- **Mindset & Coaching**: Goals, assessments, and AI coach
- **PDF Export**: Shareable PDFs via `jspdf`

---

### Tech Stack

- React 19 + Vite 6 (TypeScript)
- Google Gemini via `@google/genai`
- PDF generation via `jspdf`
- Lightweight i18n via `locales.ts`

---

### Getting Started

Prerequisites: Node.js 18+

1) Install dependencies
```bash
npm install
```

2) Configure environment
Create `.env.local` in the project root:
```bash
GEMINI_API_KEY=your_api_key_here
```

3) Run the app
```bash
npm run dev
```

Open `http://localhost:5173` in your browser (Vite default).

---

### Scripts

- `npm run dev` — Start local dev server
- `npm run build` — Production build
- `npm run preview` — Preview the production build

---

### Project Structure

- `App.tsx` — App shell and navigation
- `components/*` — Feature modules (Market Research, Product, Copywriting, Sales, Economics, Mindset)
- `services/geminiService.ts` — Centralized AI client
- `utils/pdfUtils.ts` — PDF helpers
- `locales.ts` — Locale strings

---

### Configuration

- `GEMINI_API_KEY` in `.env.local` is required for AI features.
- Update `locales.ts` to add or modify language strings.

---

### Development

- Keep modules cohesive by feature area.
- Prefer explicit types and descriptive names.
- Add small, focused commits with meaningful messages.

---

### Deployment

- Vercel is recommended. Build command: `npm run build`. Output directory: `dist`.
- Ensure `GEMINI_API_KEY` is set in your Vercel Project Environment Variables.
- Optionally add preview deployments for PRs.

---

### Screenshots

You can add images in `docs/` and reference them here.

Example placeholders:

![Banner](docs/banner.png)

![Quickstart](docs/quickstart.gif)

---

### FAQ

- **Why do I need a Gemini API key?**
  AI features depend on Google Gemini via `@google/genai`.
- **Can I use another LLM?**
  Yes. Abstract or swap the client in `services/geminiService.ts`.
- **How do I export PDFs?**
  Use flows that call helpers in `utils/pdfUtils.ts`.

---

### Security & Privacy

- Never commit API keys. `.env.local` is for local development only.
- Treat prompts and outputs as potentially sensitive business context.

---

### Roadmap (suggested)

- Project workspaces and versioned saves
- Collaborative editing and comments
- Data sources (web, uploads) for research
- Multi‑model strategies and evaluation
- Theming and white‑label exports

---

### Contributing

We welcome issues and PRs! For larger changes, open a discussion first.

Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) before submitting a PR.

---

### Code of Conduct

By participating, you agree to uphold our [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).

---

### Contact

Questions or support: `soltigg66@gmail.com`

---

### License

This project is licensed under the MIT License — see [`LICENSE`](./LICENSE) for details.
