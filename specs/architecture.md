# System Architecture – FinanceFlow

## Overview
FinanceFlow follows a serverless architecture using Next.js API routes to securely interact with Google Gemini AI.

The system separates client UI logic from AI processing.

## Architecture Flow

User Input
↓
React Client
↓
Next.js API Route (/api/gemini)
↓
Google Gemini AI
↓
Structured JSON Response
↓
Dashboard State Update

## Components

### Frontend

Framework: Next.js (App Router)
Language: TypeScript
UI: Tailwind CSS
Components: Shadcn/ui
Icons: lucide-react

Responsibilities:
- Capture user text input
- Send API request
- Render charts
- Display transactions

### Backend

Next.js API Routes

Responsibilities:
- Securely store GEMINI_API_KEY
- Send prompts to Gemini AI
- Return structured JSON

Example route:

/api/gemini

### AI Layer

Model:
Gemini 2.5 Flash

Responsibilities:
- Convert natural language into JSON
- Categorize expenses

### Data Visualization

Library:
Recharts

Charts:
- Monthly spending
- Category distribution

### State Management

React hooks manage:

- transactions
- analytics
- charts

Optimistic UI ensures instant updates before server response.

## Security

- GEMINI_API_KEY stored in environment variables
- API requests handled through serverless proxy
- No API keys exposed to client