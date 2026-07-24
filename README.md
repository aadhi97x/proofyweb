# proofy.ai

<p align="center">
  <img src="icon128.png" alt="Proofy" width="100"/>
</p>

A web application for detecting AI-generated media (deepfakes), verifying text data, and tracing the origin of images. Built with React and powered by Google's Gemini API.

## About the Project

With the rise of AI-generated content, it's becoming harder to tell what's real and what's fake. Proofy.ai aims to solve this by giving users a simple tool to analyze images, videos, and text for signs of AI manipulation.

This project was developed as part of IIT Delhi Sprint4good Hackathon and further polished for Gemini 3 hackathon hosted by google.

The project secured 1st place in the sprint4good hackathon and top 15 (out of around 30000 submissions) in google's Gemini 3 hackathon.

### What It Does

- **Image/Video Analysis** - Upload media to check for deepfake indicators like temporal inconsistencies, morphing artifacts, and unnatural physics
- **Text Analysis** - Detect AI-written text and fact-check claims against real-time web sources
- **Source Finder** - Reverse search an image to find where it originally came from
- **Batch Processing** - Analyze multiple files at once and export results

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Tailwind CSS |
| Animations | Framer Motion |
| AI Model | Google Gemini 2.5 Flash |
| Backend | Vercel Serverless Functions |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google Gemini API key ([get one here](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repo
git clone https://github.com/aadhi97x/proofyyy.git
cd proofyyy

# Install dependencies
npm install
```

### Setting Up the API Key

Create a `.env` file in the root directory:

```
GEMINI_API_KEY=your_api_key_here
```

For multiple keys (to handle rate limits), separate them with commas:

```
GEMINI_KEYS=key1,key2,key3
```

### Running Locally

```bash
# Start the dev server
npm run dev
```

The app will be available at `http://localhost:3000`.

> **Note:** To test the AI features locally, you need to run `npx vercel dev` instead of `npm run dev`, since the API routes are Vercel serverless functions.

### Building for Production

```bash
npm run build
```

## Project Structure

```
proofyyy/
├── api/                    # Vercel serverless functions (backend)
│   ├── _utils/gemini.ts    # Shared Gemini API utility with key rotation
│   ├── analyze.ts          # Media analysis endpoint
│   ├── chat.ts             # AI assistant chat endpoint
│   ├── text-analyze.ts     # Text/fact-check endpoint
│   ├── reverse-ground.ts   # Reverse image search endpoint
│   ├── certificate.ts      # Forensic report generation
│   └── transcribe.ts       # Audio transcription endpoint
├── components/             # React UI components
├── services/
│   └── geminiService.ts    # Client-side API wrapper
├── types.ts                # TypeScript type definitions
├── App.tsx                 # Main application component
├── index.tsx               # React entry point
└── vite.config.ts          # Vite configuration
```

## How It Works

1. User uploads media or enters text
2. The client sends the data to the server (`/api/analyze`, `/api/text-analyze`, etc.)
3. The server calls the Gemini API with a forensic analysis prompt
4. Gemini returns a structured JSON response with verdict, confidence scores, and explanations
5. The client displays the results in an interactive dashboard

## Features Walkthrough

### Media Analysis
Upload an image or video. The system checks for:
- Temporal inconsistencies (flickering, morphing between frames)
- Physics violations (incorrect shadows, lighting)
- Anatomical anomalies (asymmetric features, floating elements)

Results include a verdict (REAL / LIKELY_FAKE), confidence percentage, and detailed explanations.

### Text Interrogator
Paste any text to either:
- **AI Detection mode** - checks for patterns typical of AI-generated writing
- **Fact Check mode** - cross-references claims against web sources using Google Search grounding

### Source Finder
Upload an image to find its original source on the web. Uses Google Search grounding to trace where the image first appeared.

## Limitations

- Analysis accuracy depends on the Gemini model's capabilities and is not guaranteed
- Large video files may hit the server's request size limits
- Rate limits apply based on the Gemini API plan being used
- This is a proof-of-concept, not a production tool

## License

MIT License

## Acknowledgements

- [Google Gemini API](https://ai.google.dev/) for powering the AI analysis
- [Vercel](https://vercel.com/) for hosting and serverless functions
- [Vite](https://vitejs.dev/) and [React](https://react.dev/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide React](https://lucide.dev/) for icons
