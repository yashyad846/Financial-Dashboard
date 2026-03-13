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

Main Page Components:
- **page.tsx**: Main dashboard with navigation and transaction management
- **SmartInput.tsx**: Natural language input (Dashboard only)
- **VisualizationTabs.tsx**: Multi-format chart visualizations
- **SpendingInsights.tsx**: Category breakdown and budget insights
- **Benchmark.tsx**: Goal creation and management
- **OverspendingAlertModal.tsx**: Alert overlay for budget violations
- **TransactionFilter.tsx**: Advanced transaction filtering
- **DetailModal.tsx**: Transaction detail view

Responsibilities:
- Capture user text input
- Send API request
- Render charts
- Display transactions
- Calculate and display spending insights
- Manage budget goals
- Show real-time budget alerts

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

- transactions (real-time array)
- analytics (computed from transactions)
- charts (monthly spending data)
- budget goals (from localStorage)
- overspending alerts (computed from transactions + goals)
- UI state (active nav, modals, filters)

Optimistic UI ensures instant updates before server response.

### Data Persistence

LocalStorage handles:
- **benchmarkGoals**: User-created spending goals per category
- **user**: Authentication data
- Goals are loaded on component mount and persist across sessions

### Real-time Calculation Flow

Transaction Added
↓
Transaction State Updated
↓
Spending Insights Recalculates
↓
Alerts Computed from (Spending + Goals)
↓
OverspendingAlertModal Checks for New Violations
↓
Modal Auto-Shows if Overspending Detected

## Security

- GEMINI_API_KEY stored in environment variables
- API requests handled through serverless proxy
- No API keys exposed to client