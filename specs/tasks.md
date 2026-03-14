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

### Authentication System

Create login/signup system:
- Email-based authentication
- Password validation
- Session management via localStorage
- Logout functionality
- Protected routes

### Navigation & Layout

Implement multi-page navigation:
- Dashboard view (main overview)
- Transactions view (detailed table)
- Benchmark view (goals management)
- Navigation tabs/sidebar
- Active state indication

### Transaction Detail Modal

Create modal component for:
- Viewing full transaction details
- Merchant information
- Category display
- Amount and date
- Modal open/close functionality

### Transaction Filtering

Create advanced filter system:
- Search by merchant/category/date
- Amount range filtering
- Category selection filter
- Real-time filter application

### Category Configuration

Implement category system:
- Predefined category colors
- Category badges
- Category icons
- Category configuration file (categoryConfig.ts)

### Chart Visualization Enhancements

Create multiple chart types:
- Bar chart for monthly spending
- Line chart for trends
- Pie chart for category distribution
- Interactive chart tabs
- Responsive chart sizing

### Transaction Type Detection

Implement logic to distinguish:
- Income transactions (salary, deposits, refunds)
- Expense transactions (purchases, payments)
- Automatic categorization based on keywords
- Amount sign normalization

### Spending Data API

Create backend endpoint:
- `/api/spending-data` route
- Monthly spending aggregation
- Category-wise breakdown
- Year-based filtering
- Chart data generation

### Real-time Alert Calculation

Implement alert system:
- Calculate spending per category on transaction change
- Compare against benchmark goals
- Generate alerts array
- Update alerts in real-time
- Pass alerts to modal component

### Dismissable Alerts

Create alert dismissal logic:
- Individual alert dismissal
- Bulk dismiss all alerts
- Track dismissed categories
- Prevent re-showing dismissed alerts
- Only show new violations

## Completed Features

### Spending Goals & Benchmark
 Create Benchmark component for goal management
 Support daily and monthly spending limits
 Persist goals to localStorage
 Load goals on component mount
 Display goal list with edit/delete options
 Category selection interface

### Spending Insights Dashboard
 Display top 5 spending categories
 Show spending percentages per category
 Calculate spending vs budget limits
 Visual progress indicators with progress bars
 Integrate with benchmark goals
 Show total spending summary
 Display budget status per category

### Overspending Alert System
 Detect budget violations in real-time
 Create OverspendingAlertModal component
 Show total overspent amount and averages
 Display percentage over budget per category
 Allow individual alert dismissal
 Allow bulk dismiss all alerts
 Light blur background matching app design (backdrop-blur-sm)
 Auto-show/hide based on spending
 Alert display on transaction change
 Modal styling matches app color scheme

### SmartInput Refinement
 Restrict SmartInput to Dashboard view only
 Hide from Transactions and Benchmark pages
 Move input inside Dashboard conditional
 Maintain smart input on Dashboard mount

### Bug Fixes
 Fix React key warning in alerts list (unique keys with index)
 Fix Benchmark goals disappearing on page reload (useEffect for localStorage load)
 Fix UI consistency in overspending modal (light theme integration)

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
- n8n workflow automation (see Automation Tasks section below)

---

# Automation Tasks – FinanceFlow (Not Yet Started)

## Goal
Implement an AI-powered automation workflow that monitors user spending and triggers alerts with AI-generated insights via n8n integration.

---

## Task 1 – Trigger Automation on Transaction Creation [NOT STARTED]

Description:
When a new transaction is created, the backend should trigger an automation webhook in n8n.

Requirements:
- Create a helper function `triggerAutomation()`
- Send POST request to an n8n webhook endpoint
- Include transaction details:
  - amount
  - merchant
  - category
  - date
- Handle errors gracefully
- Implement in TypeScript

Acceptance Criteria:
- Webhook is triggered every time a transaction is added.

---

## Task 2 – Add Environment Configuration [NOT STARTED]

Description:
Store the n8n webhook URL securely using environment variables.

Requirements:
- Add `N8N_WEBHOOK_URL` in `.env.local`
- Use `process.env.N8N_WEBHOOK_URL`
- Document in .env.example

Acceptance Criteria:
- Webhook URL should not be hardcoded.

---

## Task 3 – Integrate Automation Trigger in Transaction API [NOT STARTED]

Description:
After saving a transaction, trigger the automation workflow.

Requirements:
- Update `/api/add-transaction` route (or integrate with SmartInput handler)
- Call `triggerAutomation(transaction)` after transaction creation
- Handle webhook errors gracefully

Acceptance Criteria:
- Automation should run after every transaction.

---

## Task 4 – Spending Data Endpoint [PARTIALLY COMPLETED]

Description:
Create an API endpoint that returns monthly spending summary.

Status: `/api/spending-data` exists and returns monthly spending data

Requirements:
- Endpoint `/api/spending-data` 
- Category-wise breakdown (ready for automation)
- Year-based filtering support

Acceptance Criteria:
 Endpoint returns correct aggregated spending data.

---

## Task 5 – AI Insight Generation [NOT STARTED]

Description:
Generate financial insights using Gemini AI based on spending patterns.

Requirements:
- Accept spending summary
- Send prompt to Gemini API
- Return short financial advice
- Integration with n8n workflow

Acceptance Criteria:
- API returns 1–2 sentence financial insight.

---

## Task 6 – Store AI Insights [NOT STARTED]

Description:
Create endpoint to store AI-generated insights for future analysis.

Requirements:
- Endpoint `/api/save-insight`
- Store:
  - insight text
  - timestamp
  - spending percentage
- Optional: Database storage or localStorage

Acceptance Criteria:
- Insights stored successfully.

---

## Task 7 – n8n Automation Workflow [NOT STARTED]

Description:
Create an automation pipeline in n8n.

Workflow Steps:

1. Webhook Trigger (transaction event)
2. Validate transaction
3. Fetch monthly spending via /api/spending-data
4. Check budget threshold
5. Generate AI insight  
6. Send email alert to user

Acceptance Criteria:
- Email alert triggered when spending exceeds threshold.