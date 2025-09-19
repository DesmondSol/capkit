### CapKit — From Idea to Investor‑Ready in One Weekend

CapKit is an AI‑powered startup studio in a box. It helps founders go from a fuzzy idea to investor‑ready collateral, customer insights, and an initial go‑to‑market plan—fast.

Think of CapKit as your co‑founder who never sleeps: it researches your market, drafts marketing assets, scaffolds product plans, forecasts economics, and packages everything into shareable PDFs you can use with teammates, advisors, or investors.

---

### Why this matters

- **Speed to signal**: The hardest part of starting is making the invisible visible. CapKit turns loose ideas into tangible artifacts you can react to.
- **Consistency**: Strategy, market research, product, marketing, and economics stay aligned because they’re generated from the same source of truth.
- **Investor credibility**: You’ll produce clear collateral that looks buttoned‑up—without spending weeks in spreadsheets and slides.

---

### What you can build with CapKit

- **Market Research Accelerator**: Summarize competitors, segment markets, and extract Jobs‑To‑Be‑Done insights.
- **Personas & JTBD**: Generate buyer personas and job stories that connect research to product.
- **Product Design & Planning**: Brainstorm features, prioritize with an action board, and capture feedback.
- **Copywriting Studio**: Create pitches, one‑pagers, social posts, and full marketing strategies.
- **Sales & GTM**: Draft go‑to‑market plans, seed a CRM pipeline, and craft outreach.
- **Economics**: Model unit economics, burn rate, and simple projections.
- **Mindset & Coaching**: Set goals, run assessments, and keep momentum.
- **PDF Export**: Package output into clean PDFs for sharing.

All features are modular—you can use one flow or the entire stack.

---

### Tech Overview

- **Frontend**: React + Vite (TypeScript)
- **AI**: Google Gemini via `@google/genai`
- **PDF**: `jspdf` utilities in `utils/pdfUtils.ts`
- **i18n**: Lightweight locale support via `locales.ts`

Key app entry points:
- `index.tsx` bootstraps the React app
- `App.tsx` wires navigation and top‑level layout
- Feature modules live in `components/*`
- AI client lives in `services/geminiService.ts`

---

### Getting Started

Prerequisites: Node.js 18+

1) Install dependencies
```bash
npm install
```

2) Configure your API key
Create a file named `.env.local` in the project root:
```bash
GEMINI_API_KEY=your_api_key_here
```

3) Run the app
```bash
npm run dev
```

4) Open the app
Visit `http://localhost:5173` (Vite default) in your browser.

---

### Scripts

- `npm run dev`: Start local dev server
- `npm run build`: Production build
- `npm run preview`: Preview the production build locally

---

### Configuration

- **Environment**
  - `GEMINI_API_KEY`: Required for AI features (used in `services/geminiService.ts`).

- **Locales**
  - Edit `locales.ts` to add or modify languages, labels, and supported content.

---

### Key Features by Module

- `components/MarketResearchAccelerator/MarketResearchAccelerator.tsx`
  - Guides structured research, competitor summaries, and insights extraction.

- `components/PersonasPage/*`
  - Generates personas, job stories, and detailed persona views.

- `components/ProductDesignPage/*`
  - Brainstorm board, feature planning, feedback aggregation, and action items.

- `components/Copywriting/*`
  - Pitch creation, one‑pager, marketing strategy, and channel‑specific posts.

- `components/SalesPage/*`
  - Go‑to‑market planner, pipeline scaffolding, and lead editing flows.

- `components/EconomicsPage/*`
  - Unit economics calculator, burn‑rate forecaster, and cost/revenue planner.

- `components/Mindset/*`
  - AI coaching, assessments, goal setting, and profile reports.

- `utils/pdfUtils.ts`
  - Helpers to export structured outputs into shareable PDFs.

---

### Architecture Notes

- The UI is organized by outcomes (Market Research, Product, Copywriting, Sales, Economics, Mindset) rather than by technical primitives.
- Each module encapsulates its own modals, planners, and pages to keep local context tight.
- The AI layer is centralized in `services/geminiService.ts` so prompts and model configuration are easy to evolve.

---

### Extending CapKit

1) Add a new feature area
- Create a folder under `components/YourArea/`
- Add pages and modals specific to the workflow
- Wire it in `App.tsx` navigation

2) Add new AI prompts or models
- Extend `services/geminiService.ts` with a typed function for your use case
- Consume it from your component; keep UI state local and IO typed

3) Add exports
- Use `utils/pdfUtils.ts` to create structured PDF exports for your new outputs

---

### Security & Privacy

- API keys are read from `.env.local` and never committed. Do not check credentials into version control.
- Text sent to the model may contain sensitive business context. Treat your prompts/outputs accordingly and avoid pasting secrets.

---

### Roadmap Ideas

- Workspace saves and versioned projects
- Collaborative editing and comment threads
- Data sources: web research, upload parsing
- Multi‑model strategy and evaluation harness
- Theming and white‑label exports

---

### Contributing

Issues and PRs are welcome. Please:
- Keep components cohesive by feature area
- Prefer clear types and descriptive names
- Add small, focused commits with context in messages

---

### License

Proprietary – for internal or invited use unless a LICENSE file is added.

---

### One last pitch

If you’ve ever said “I’ll start when it’s clearer,” CapKit is how you make it clear. In a few focused sessions, you’ll have research, plans, and artifacts that move conversations forward—with customers and with capital.
