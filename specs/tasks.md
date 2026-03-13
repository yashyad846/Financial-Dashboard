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


### Spending Goals & Benchmark
 Create Benchmark component for goal management
 Support daily and monthly spending limits
 Persist goals to localStorage
 Load goals on component mount

### Spending Insights Dashboard
 Display top 5 spending categories
 Show spending percentages per category
 Calculate spending vs budget limits
 Visual progress indicators
 Integrate with benchmark goals

### Overspending Alert System
 Detect budget violations in real-time
 Create OverspendingAlertModal component
 Show total overspent amount and averages
 Display percentage over budget per category
 Allow individual and bulk alert dismissal
 Light blur background matching app design
 Auto-show/hide based on spending

### SmartInput Refinement
 Restrict SmartInput to Dashboard view only
 Hide from Transactions and Benchmark pages

### Bug Fixes
 Fix React key warning in alerts list
Fix Benchmark goals disappearing on page reload
Fix UI consistency in overspending modal

## Future Enhancements

- Persistent database (PostgreSQL/Firebase)
- Multi-user authentication with profiles
- Export transactions (CSV/PDF)
- Recurring transaction templates
- Category customization
- Budget period customization
- Mobile app (React Native)
- Advanced AI insights and recommendations
- Spending forecast based on historical data