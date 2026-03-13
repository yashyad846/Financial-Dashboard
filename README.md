# 💸 FinanceFlow: AI-Powered Smart Dashboard

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</div>

<br />

FinanceFlow is a next-generation personal finance application that replaces tedious manual data entry with Natural Language Processing (NLP). By typing conversational sentences like *"Just paid my $80 internet bill to Xfinity"*, the integrated LLM instantly extracts, categorizes, and visualizes your financial data in real-time.

---

## 📑 Table of Contents
1. [✨ Core Features](#-core-features)
2. [🛠️ Tech Stack](#️-tech-stack)
3. [🏗️ Architecture](#-architecture)
4. [🚀 Getting Started](#-getting-started)
5. [📂 Project Structure](#-project-structure)
6. [👨‍💻 Author](#-author)

---

## ✨ Core Features

* **🧠 NLP Transaction Parsing:** Utilizes Google's Gemini 2.5 Flash model with strict JSON-enforced system instructions to convert unstructured text into structured financial data.
* **� Smart Income/Expense Detection:** Automatically classifies transactions as income or expenses based on keywords and amount signs. Shows contextual messages ("Income added" vs "Expense added").
* **📊 Interactive Multi-Year Visualizations:** Beautiful, responsive bar charts powered by Recharts with year navigation to track spending trends across 2024-2026.
* **⚡ Optimistic UI Updates:** Instantaneous state management using React hooks ensures the transaction table and charts update with zero server-side latency.
* **📱 Responsive Design:** A fully mobile-responsive, accessible, and premium UI built with Tailwind CSS and `lucide-react` iconography.
* **🎨 Color-Coded Categories:** Each transaction category has its own color scheme for quick visual identification (Income: emerald, Food: orange, Transport: blue, etc.).
* **🔐 Secure Authentication:** Simple login page for user access management.
* **⚡ Dynamic Status Messages:** Auto-dismissing toast notifications for transaction feedback.

## 🛠️ Tech Stack

* **Frontend:** React.js, Next.js (App Router), Tailwind CSS
* **Backend:** Next.js API Routes (Serverless)
* **AI Integration:** Google Generative AI SDK (Gemini API)
* **Data Visualization:** Recharts
* **Styling/UI:** Shadcn/ui architecture principles, Radix UI

## 🏗️ Architecture

This application utilizes a modern, serverless architecture to securely handle API keys while maintaining blazing-fast frontend performance:

1. **Client Interface:** Captures user input and sends a POST request to the local API route.
2. **Serverless Edge Route (`/api/gemini`):** Acts as a secure proxy. It injects the hidden `GEMINI_API_KEY` and passes the user's prompt alongside rigid System Instructions to the Google AI Studio.
3. **Data Hydration:** The AI returns a strictly typed JSON object (Amount, Merchant, Category, Date), which the Next.js server relays back to the client to update the React state.

## 🚀 Getting Started

### Prerequisites
* Node.js (v18.x or higher)
* A valid [Google Gemini API Key](https://aistudio.google.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/YourUsername/smart-finance-dashboard.git](https://github.com/YourUsername/smart-finance-dashboard.git)
   cd smart-finance-dashboard
2. **Install Dependencies**
   ```bash
   npm install
3. **Run the development server**
   ```bash
   npm run dev

### 👨‍💻 Author
   Yash Yadav

---

## 📋 Recent Improvements (v2.0)

### Enhanced Features
- **Income/Expense Smart Detection:** Improved classification logic that correctly differentiates between income and expenses based on keywords (salary, deposit, refund, income) and amount signs.
- **Multi-Year Data API:** New `/api/spending-data` endpoint providing spending data for 2024-2026 with easy year navigation.
- **Dynamic UI Messaging:** Toast notifications now correctly identify whether a transaction is income or expense, auto-dismissing after 3 seconds.
- **Color-Coded Transaction Categories:** Each category has its own color scheme for better visual organization.
- **Login Page:** Professional login interface at `/login` with demo mode support.

### Code Quality Improvements
- **Type Safety:** Added TypeScript interfaces in `lib/types.ts` for better type checking.
- **Category Configuration:** Centralized category colors and styling in `lib/categoryConfig.ts`.
- **Cleaner UI:** Removed search bar and notification icon from header for a more focused interface.
- **Improved Gemini Prompt:** Updated AI prompt to explicitly recognize income categories and provide better transaction classification.

### Usage Examples
```bash
# Income transaction
"Got paid $2000 salary today"
→ Shows "Income added" with green badge

# Expense transaction  
"Spent $45 on Uber to airport"
→ Shows "Expense added" with red amount

# View different years
# Use the year navigation arrows on the chart
# 2024 → 2025 → 2026
```
