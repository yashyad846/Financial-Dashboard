# Product Specification – FinanceFlow

## Overview
FinanceFlow is an AI-powered personal finance dashboard that allows users to log financial transactions using natural language.

Instead of manually filling forms, users can type conversational sentences such as:

"Just paid my $80 internet bill to Xfinity"

The system uses an LLM to extract structured financial data and update the dashboard automatically.

## Problem Statement
Manual expense tracking is tedious and time-consuming. Most finance apps require structured inputs which discourages frequent usage.

FinanceFlow simplifies the process by enabling natural language transaction logging powered by AI.

## Target Users
- Individuals managing personal finances
- Users who prefer conversational interfaces
- Mobile-first users who want quick expense entry

## Core Features

### Natural Language Expense Input
Users can type sentences describing their transaction on the Dashboard.

Example:
Paid $50 for groceries at Walmart

The system extracts:
- Amount
- Merchant
- Category
- Date

### AI Transaction Parsing
Google Gemini AI converts unstructured text into structured JSON.

Example response:

{
  "amount": 50,
  "merchant": "Walmart",
  "category": "Groceries",
  "date": "2026-03-12"
}

### Real-time Dashboard Updates
Transactions instantly update:

- Expense table
- Monthly charts
- Spending analytics
- Budget tracking

### Spending Goal Management
Users can create daily or monthly spending goals per category through the Benchmark section.

Goals include:
- Category selection
- Period (Daily/Monthly)
- Spending limit
- Goal persistence via localStorage

### Spending Insights
Dashboard displays comprehensive spending analysis:
- Top 5 spending categories with percentages
- Budget progress indicators
- Visual progress bars showing spending vs limit
- Real-time budget status tracking

### Overspending Alerts
Proactive budget monitoring system that:
- Detects when spending exceeds goal limits
- Displays modal alert on main screen
- Shows total amount overspent across all categories
- Lists each overspent category with percentage over budget
- Allows dismissal of individual or all alerts
- Uses light blur background matching app design

### Interactive Charts
Users can visualize spending trends through multiple chart types:
- Monthly spending bar charts
- Category distribution pie/line charts
- Advanced analytics with multiple visualization formats

### Transaction Navigation
Dashboard supports three main views:
- **Dashboard**: Overview with SmartInput, spending insights, and analytics
- **Transactions**: Filterable transaction table with search
- **Benchmark**: Goal creation and management

### Responsive UI
The interface works smoothly across desktop, tablet, and mobile devices with consistent design.

## Success Criteria

- Transaction parsing accuracy > 90%
- Dashboard updates instantly after input
- Mobile responsive UI
- AI response latency under 2 seconds
- Budget alerts display within 100ms of transaction addition
- Spending insights accurately reflect current expenses
- Goal persistence across sessions

## User Flows

### Setting a Budget
1. User navigates to Benchmark tab
2. Selects spending category
3. Chooses period (Daily/Monthly)
4. Enters spending limit
5. Creates goal (saved to localStorage)

### Adding a Transaction & Getting Alerts
1. User on Dashboard enters transaction via SmartInput
2. AI parses natural language input
3. Transaction added to state
4. System calculates spending by category
5. If any category exceeds goal, overspending alert modal appears
6. User can dismiss individual alerts or all at once

### Monitoring Spending
1. User views Dashboard
2. Sees Spending Insights card with top categories
3. Reviews budget vs actual spending with progress bars
4. Checks Overspending Alert Modal for any budget violations
5. Can adjust future spending based on insights