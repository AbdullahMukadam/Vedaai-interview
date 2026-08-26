# AI Assessment Extraction & Answer Mapping

A web application that uses Google Gemini to extract questions from a question paper, map student answers from an answer sheet, and grade them with AI-powered feedback and bounding box highlighting.

## How It Works

1. **Upload** — Teacher uploads a question paper PDF and a student answer sheet PDF
2. **Extract** — PDFs are sent to Google Gemini as base64 inline data; the model extracts all questions, locates each answer with bounding boxes `[ymin, xmin, ymax, xmax]` (normalized 0–1000), and grades them in a single structured response
3. **Review** — A side-by-side view shows extracted questions with scores on the left and the answer sheet PDF with highlighted answer regions on the right
4. **Highlight** — Expanding a question highlights its corresponding answers on the PDF; collapsing hides them

## Tech Stack

- **Framework** — Next.js 15 (App Router + Turbopack)
- **AI Model** — Google Gemini 3.6 Flash (`gemini-3.6-flash`)
- **PDF Rendering** — pdfjs-dist (client-side)
- **State** — TanStack Query (server state) + React Context (app state)
- **Styling** — Tailwind CSS v4
- **Animation** — motion (Framer Motion)
- **Monorepo** — npm workspaces + Turborepo

## Project Structure

```
interview/
├── apps/
│   └── web/                          # Next.js application
│       ├── app/
│       │   ├── api/extract/route.ts   # API route → Gemini
│       │   ├── assessment/results/    # Answer mapping page
│       │   ├── layout.tsx             # Root layout (providers)
│       │   ├── page.tsx               # Upload page
│       │   └── globals.css
│       ├── public/
│       │   ├── icons/                 # Figma-exported icons
│       │   ├── images/                # Illustrations, school logo
│       │   └── samples/               # Sample PDFs for testing
│       └── src/
│           ├── components/common/     # Sidebar, Toolbar, FileUpload, FilePreview
│           ├── features/assessment/  # UploadScreen, AnswerMappingScreen,
│           │   └── components/        #   QuestionCard, AnswerSheetPanel, PdfPageViewer
│           ├── hooks/                 # useExtractAssessment, useHighlightRegion
│           ├── lib/
│           │   ├── api/               # FetchClient, AssessmentService
│           │   └── gemini/            # GeminiService, prompts, schemas
│           └── providers/             # AssessmentProvider, QueryProvider
├── packages/
│   ├── constants/                     # API, app, Gemini config constants
│   └── types/                         # Shared TypeScript types
├── turbo.json
├── tsconfig.json
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API key

### Setup

```bash
# Install dependencies
npm install

# Create .env.local in apps/web/
echo "GEMINI_API_KEY=your_api_key_here" > apps/web/.env.local

# Start dev server
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run typecheck` | Type-check all packages |

## Gemini Configuration

- **Model**: `gemini-3.6-flash`
- **Temperature**: 0.1 (deterministic extraction)
- **Max output tokens**: 8192
- **Safety settings**: All categories set to `BLOCK_NONE` (educational content)
- **PDF delivery**: Sent as base64 `inlineData` directly to Gemini (no server-side rendering)

## Key Design Decisions

- PDFs are sent directly to Gemini as base64 `inlineData` — avoids server-side pdfjs-dist issues with Turbopack
- Client-side pdfjs-dist is used only for rendering the answer sheet PDF in the browser
- Bounding boxes use Gemini's native `[ymin, xmin, ymax, xmax]` format normalized to 0–1000
- Answer highlights on the PDF are tied to the accordion expand/collapse state
- `answerSheetData` is stored via `useState` (not `useRef`) to ensure re-render propagation to the PDF viewer
