 "use client";

import SmartInput from '@/components/SmartInput';
// (If that path throws an error, try: import SmartInput from './SmartInput';)
import { useState } from "react"
import {
  LayoutDashboard,
  ArrowUpDown,
  Wallet,
  Settings,
  Bell,
  Search,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for the spending chart
const spendingData = [
  { month: "Jan", amount: 2400 },
  { month: "Feb", amount: 1398 },
  { month: "Mar", amount: 3200 },
  { month: "Apr", amount: 2780 },
  { month: "May", amount: 1890 },
  { month: "Jun", amount: 2390 },
  { month: "Jul", amount: 3490 },
  { month: "Aug", amount: 2100 },
  { month: "Sep", amount: 2700 },
  { month: "Oct", amount: 3100 },
  { month: "Nov", amount: 2800 },
  { month: "Dec", amount: 3600 },
]

// Mock data for transactions
const transactions = [
  {
    id: 1,
    date: "Mar 8, 2026",
    merchant: "Apple Store",
    category: "Electronics",
    amount: -1299.0,
  },
  {
    id: 2,
    date: "Mar 7, 2026",
    merchant: "Whole Foods Market",
    category: "Groceries",
    amount: -156.42,
  },
  {
    id: 3,
    date: "Mar 6, 2026",
    merchant: "Netflix",
    category: "Entertainment",
    amount: -15.99,
  },
  {
    id: 4,
    date: "Mar 5, 2026",
    merchant: "Salary Deposit",
    category: "Income",
    amount: 8500.0,
  },
  {
    id: 5,
    date: "Mar 4, 2026",
    merchant: "Uber",
    category: "Transportation",
    amount: -32.5,
  },
  {
    id: 6,
    date: "Mar 3, 2026",
    merchant: "Amazon",
    category: "Shopping",
    amount: -89.99,
  },
]

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: ArrowUpDown, label: "Transactions", active: false },
  { icon: Wallet, label: "Budget", active: false },
  { icon: Settings, label: "Settings", active: false },
]

export default function FinanceDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard")

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-border bg-sidebar lg:flex">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Wallet className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">
            FinanceFlow
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeNav === item.label
            return (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* User card at bottom */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=finance" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-sidebar-foreground">
                John Doe
              </p>
              <p className="text-xs text-muted-foreground truncate">
                john@example.com
              </p>
            </div>
          </div>
        </div>
      </aside>
      <SmartInput />
      {/* Main Content */}
      <main className="flex-1 lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            {/* Mobile logo */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary lg:hidden">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-64 rounded-lg border border-border bg-secondary pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
            </Button>

            {/* User Avatar */}
            <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-border">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=finance" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Summary Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Total Balance */}
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Balance
                </CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Wallet className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  $48,352.68
                </div>
                <div className="mt-1 flex items-center gap-1 text-sm">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-primary font-medium">+12.5%</span>
                  <span className="text-muted-foreground">from last month</span>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Income */}
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Monthly Income
                </CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1/10">
                  <ArrowUpRight className="h-4 w-4 text-chart-1" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  $12,840.00
                </div>
                <div className="mt-1 flex items-center gap-1 text-sm">
                  <TrendingUp className="h-4 w-4 text-chart-1" />
                  <span className="text-chart-1 font-medium">+8.2%</span>
                  <span className="text-muted-foreground">from last month</span>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Expenses */}
            <Card className="border-border bg-card md:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Monthly Expenses
                </CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-5/10">
                  <ArrowDownRight className="h-4 w-4 text-chart-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  $7,234.56
                </div>
                <div className="mt-1 flex items-center gap-1 text-sm">
                  <TrendingDown className="h-4 w-4 text-chart-5" />
                  <span className="text-chart-5 font-medium">-3.1%</span>
                  <span className="text-muted-foreground">from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Spending Chart */}
          <Card className="mb-8 border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-card-foreground">
                  Monthly Spending
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Your spending overview for the year
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-border bg-secondary text-foreground"
              >
                2026
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={spendingData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(0.25 0 0)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      stroke="oklch(0.6 0 0)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="oklch(0.6 0 0)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.14 0 0)",
                        border: "1px solid oklch(0.25 0 0)",
                        borderRadius: "8px",
                        color: "oklch(0.95 0 0)",
                      }}
                      labelStyle={{ color: "oklch(0.6 0 0)" }}
                      formatter={(value: number) => [`$${value}`, "Spending"]}
                    />
                    <Bar
                      dataKey="amount"
                      fill="oklch(0.75 0.15 165)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-card-foreground">
                  Recent Transactions
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Your latest financial activity
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-border bg-secondary text-foreground"
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 text-left text-sm font-medium text-muted-foreground">
                        Date
                      </th>
                      <th className="py-3 text-left text-sm font-medium text-muted-foreground">
                        Merchant
                      </th>
                      <th className="py-3 text-left text-sm font-medium text-muted-foreground">
                        Category
                      </th>
                      <th className="py-3 text-right text-sm font-medium text-muted-foreground">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-border/50 transition-colors hover:bg-secondary/50"
                      >
                        <td className="py-4 text-sm text-muted-foreground">
                          {transaction.date}
                        </td>
                        <td className="py-4 text-sm font-medium text-card-foreground">
                          {transaction.merchant}
                        </td>
                        <td className="py-4">
                          <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                            {transaction.category}
                          </span>
                        </td>
                        <td
                          className={`py-4 text-right text-sm font-semibold ${
                            transaction.amount >= 0
                              ? "text-chart-1"
                              : "text-card-foreground"
                          }`}
                        >
                          {transaction.amount >= 0 ? "+" : ""}
                          {transaction.amount.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
