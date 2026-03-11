# Engineering Tasks – FinanceFlow

## Setup

1. Initialize Next.js project with TypeScript
2. Install Tailwind CSS
3. Configure shadcn/ui components
4. Install Recharts
5. Install Google Generative AI SDK

## Core Features

### Smart Input Component

Create a SmartInput component that:
- accepts natural language text
- sends POST request to /api/gemini
- displays parsed transaction

### API Integration

Create API route:

/api/gemini

Responsibilities:
- receive user text
- call Gemini API
- return structured JSON

### AI Parsing Logic

Implement strict system prompt to enforce JSON output:

Fields required:
- amount
- merchant
- category
- date

### Transaction State Management

Implement React state to store:

- transactions
- monthly spending

Update dashboard optimistically.

### Chart Visualization

Create charts using Recharts:

- monthly spending bar chart
- category distribution

### Transaction Table

Create table displaying:

- amount
- merchant
- category
- date

### Responsive UI

Ensure layouts work for:

- mobile
- tablet
- desktop

## Enhancements (Future)

- persistent database (PostgreSQL)
- authentication
- export transactions
- spending insights using AI