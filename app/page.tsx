"use client";

import SmartInput from "@/components/SmartInput";
import { getCategoryConfig } from "@/lib/categoryConfig";
import VisualizationTabs from "@/components/VisualizationTabs";
import SpendingInsights from "@/components/SpendingInsights";
import OverspendingAlertModal from "@/components/OverspendingAlertModal";
import TransactionFilter from "@/components/TransactionFilter";
import DetailModal from "@/components/DetailModal";
import Benchmark from "@/components/Benchmark";
import { useState, useEffect, useRef, Suspense } from "react"
import {
  LayoutDashboard,
  ArrowUpDown,
  Target,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  LogOut,
  RefreshCw,
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Mock data for transactions
const initialTransactions = [
  {
    id: 1,
    date: "Mar 8, 2026",
    merchant: "Apple Store",
    category: "Electronics",
    amount: -1299.0,
    verified: false,
  },
  {
    id: 2,
    date: "Mar 7, 2026",
    merchant: "Whole Foods Market",
    category: "Groceries",
    amount: -156.42,
    verified: false,
  },
  {
    id: 3,
    date: "Mar 6, 2026",
    merchant: "Netflix",
    category: "Entertainment",
    amount: -15.99,
    verified: false,
  },
  {
    id: 4,
    date: "Mar 5, 2026",
    merchant: "Salary Deposit",
    category: "Income",
    amount: 8500.0,
    verified: false,
  },
  {
    id: 5,
    date: "Mar 4, 2026",
    merchant: "Uber",
    category: "Transportation",
    amount: -32.5,
    verified: false,
  },
  {
    id: 6,
    date: "Mar 3, 2026",
    merchant: "Amazon",
    category: "Shopping",
    amount: -89.99,
    verified: false,
  },
]

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: ArrowUpDown, label: "Transactions", active: false },
  { icon: Target, label: "Benchmark", active: false },
]

export default function FinanceDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard")
  const [transactions, setTransactions] = useState(initialTransactions)
  const [searchQuery, setSearchQuery] = useState("")
  // TODO: fix this to use proper data fetching
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [chartData, setChartData] = useState<Array<{month: string, amount: number}>>([])
  const [isLoadingChart, setIsLoadingChart] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<any>(null)
  const [modalType, setModalType] = useState<'transaction' | 'summary' | 'category'>('transaction')
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    amountMin: '',
    amountMax: '',
  })
  const [alerts, setAlerts] = useState<Array<{ category: string; spent: number; limit: number; percentage: number }>>([])
  const [monthlyBudget, setMonthlyBudget] = useState(3000)
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [budgetInput, setBudgetInput] = useState('3000')

  // Load monthly budget from localStorage on mount
  useEffect(() => {
    const savedBudget = localStorage.getItem('monthlyBudget');
    if (savedBudget) {
      const budget = parseFloat(savedBudget);
      setMonthlyBudget(budget);
      setBudgetInput(String(budget));
    }
  }, []);

  // Sync verified status from server for each transaction
  const syncVerifiedStatus = async (transactionIds: number[]) => {
    if (transactionIds.length === 0) return;

    try {
      const verifiedMap: Record<number, boolean> = {};
      let changedCount = 0;
      
      // Check verification status for each transaction
      for (const id of transactionIds) {
        try {
          const response = await fetch(`/api/verify-transaction?transactionId=${id}`);
          if (response.ok) {
            const data = await response.json();
            verifiedMap[id] = data.verified;
          }
        } catch (error) {
          console.warn(`⚠️ Error fetching status for transaction ${id}:`, error);
        }
      }
      
      // Update transactions ONLY if verification status actually changed
      setTransactions((prev) => {
        const updated = prev.map((t) => {
          const newVerified = verifiedMap[t.id];
          if (newVerified !== undefined && newVerified !== t.verified) {
            changedCount++;
            console.log(`✓ Transaction ${t.id} now verified`);
          }
          return {
            ...t,
            verified: newVerified !== undefined ? newVerified : t.verified,
          };
        });
        
        if (changedCount > 0) {
          console.log(`✓ Real-time update: ${changedCount} transaction(s) verified`);
        }
        
        return updated;
      });
    } catch (error) {
      console.error('❌ Failed to sync verified status:', error);
    }
  };

  // Manually refresh verification status (for debugging)
  const handleRefreshVerificationStatus = () => {
    console.log('🔄 Manual refresh triggered');
    syncVerifiedStatus(transactions.map((t) => t.id));
  };

  // Removed automatic syncing - now only happens when user clicks "Sync Status" button
  // This respects the 15 requests per minute rate limit

  // Save monthly budget to localStorage
  const handleSaveBudget = () => {
    const budget = parseFloat(budgetInput);
    if (!isNaN(budget) && budget > 0) {
      setMonthlyBudget(budget);
      localStorage.setItem('monthlyBudget', String(budget));
      setShowBudgetModal(false);
    }
  };

  // Calculate alerts from transactions and benchmark goals
  useEffect(() => {
    const calculateAlerts = () => {
      // Calculate spending by category
      const categorySpending: Record<string, number> = {};
      transactions.forEach((transaction) => {
        if (transaction.amount < 0) { // Only count expenses
          categorySpending[transaction.category] = (categorySpending[transaction.category] || 0) + Math.abs(transaction.amount);
        }
      });

      // Load benchmark goals and check for overspending
      const savedGoals = localStorage.getItem('benchmarkGoals');
      if (savedGoals) {
        try {
          const goals = JSON.parse(savedGoals);
          const newAlerts: Array<{ category: string; spent: number; limit: number; percentage: number }> = [];
          
          goals.forEach((goal: any) => {
            const spent = categorySpending[goal.category] || 0;
            const limit = goal.period === 'daily' ? goal.dailyLimit : goal.monthlyLimit;
            if (limit && spent > limit) {
              const percentage = Math.round((spent / limit) * 100);
              newAlerts.push({
                category: goal.category,
                spent,
                limit,
                percentage,
              });
            }
          });
          
          setAlerts(newAlerts);
        } catch (e) {
          console.error('Failed to parse goals:', e);
        }
      }
    };

    calculateAlerts();
  }, [transactions]);

  // Fetch chart data when year changes
  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoadingChart(true)
      try {
        const response = await fetch(`/api/spending-data?year=${selectedYear}`)
        if (response.ok) {
          const data = await response.json()
          setChartData(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch chart data:', error)
      } finally {
        setIsLoadingChart(false)
      }
    }

    fetchChartData()
  }, [selectedYear])

  // Check user login status
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      window.location.href = '/login'
    } else {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleAddTransaction = (data: any) => {
    if (!data) return

    const parsedAmount = Number(data.amount)
    const lowerCategory =
      typeof data.category === "string"
        ? data.category.toLowerCase().trim()
        : ""
    const lowerMerchant =
      typeof data.merchant === "string" ? data.merchant.toLowerCase() : ""

    // Determine whether this should be treated as income. We look only at
    // category/merchant keywords. Amount sign is handled separately when we
    // normalise the final value, so a positive number won’t automatically
    // mark something as income (that was causing every entry to become
    // income).
    const isIncome =
      lowerCategory.includes("income") ||
      lowerMerchant.includes("salary") ||
      lowerMerchant.includes("income") ||
      lowerMerchant.includes("deposit") ||
      lowerMerchant.includes("refund");

    const amount = Number.isFinite(parsedAmount)
      ? isIncome
        ? Math.abs(parsedAmount)
        : -Math.abs(parsedAmount)
      : 0;

    const parsedDate = data.date ? new Date(data.date) : new Date()
    const formattedDate = isNaN(parsedDate.getTime())
      ? new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : parsedDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })

    const newTransaction = {
      id: Date.now(),
      date: formattedDate,
      merchant: data.merchant || "Unknown",
      category: data.category || "Other",
      amount,
      verified: false,
    }

    // Call the API to save transaction and trigger automation
    fetch('/api/add-transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTransaction),
    }).catch((error) => {
      console.error('Failed to trigger automation:', error);
      // Continue even if automation fails - the transaction is still added locally
    });

    setTransactions((prev) => [newTransaction, ...prev])
  }

  const filteredTransactions =
    activeNav === "Transactions" || activeNav === "Dashboard"
      ? transactions.filter((transaction) => {
          const query = (filters.search || searchQuery).toLowerCase()
          const category = filters.category || ''
          const amountMin = filters.amountMin ? parseFloat(filters.amountMin) : null
          const amountMax = filters.amountMax ? parseFloat(filters.amountMax) : null
          
          // Search filter
          if (query && !transaction.merchant.toLowerCase().includes(query) &&
              !transaction.category.toLowerCase().includes(query) &&
              !transaction.date.toLowerCase().includes(query)) {
            return false
          }
          
          // Category filter
          if (category && !transaction.category.toLowerCase().includes(category.toLowerCase())) {
            return false
          }
          
          // Amount range filter
          const amount = Math.abs(transaction.amount)
          if (amountMin !== null && amount < amountMin) {
            return false
          }
          if (amountMax !== null && amount > amountMax) {
            return false
          }
          
          return true
        })
      : transactions

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const currentMonthTransactions = transactions.filter((transaction) => {
    const parsed = new Date(transaction.date)
    if (isNaN(parsed.getTime())) return false
    return (
      parsed.getMonth() === currentMonth && parsed.getFullYear() === currentYear
    )
  })

  const totalBalance = transactions.reduce(
    (sum, t) => sum + t.amount,
    0,
  )

  const monthlyIncome = currentMonthTransactions.reduce(
    (sum, t) => (t.amount > 0 ? sum + t.amount : sum),
    0,
  )

  const monthlyExpenses = currentMonthTransactions.reduce(
    (sum, t) => (t.amount < 0 ? sum + Math.abs(t.amount) : sum),
    0,
  )

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  const openTransactionModal = (transaction: any) => {
    setModalData(transaction)
    setModalType('transaction')
    setModalOpen(true)
  }

  const openSummaryModal = () => {
    setModalData({
      totalBalance: totalBalance.toFixed(2),
      monthlyIncome: monthlyIncome.toFixed(2),
      monthlyExpenses: monthlyExpenses.toFixed(2),
      month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    })
    setModalType('summary')
    setModalOpen(true)
  }

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
        <div 
          className="border-t border-sidebar-border p-4 cursor-pointer hover:bg-sidebar-accent/30 transition-colors"
          onClick={() => window.location.href = '/login'}
        >
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=finance" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-sidebar-foreground">
                Yash Yadav
              </p>
              <p className="text-xs text-muted-foreground truncate">
                john@example.com
              </p>
            </div>
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 lg:pl-64 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            {/* Mobile logo */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary lg:hidden">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">
              {activeNav}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Refresh Verification Status Button */}
            <button
              onClick={handleRefreshVerificationStatus}
              className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors"
              title="Refresh transaction verification status from server"
            >
              <RefreshCw className="h-4 w-4" />
              Sync Status
            </button>

            {/* Budget Button */}
            <button
              onClick={() => setShowBudgetModal(true)}
              className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
            >
              <Target className="h-4 w-4" />
              Budget: ${monthlyBudget.toFixed(2)}
            </button>

            {/* User Info */}
            {user && (
              <div className="hidden md:flex items-center gap-2 text-sm">
                <span className="text-foreground font-medium">{user.name}</span>
                <span className="text-muted-foreground">•</span>
              </div>
            )}
            
            {/* User Avatar with Dropdown */}
            <div className="relative group">
              <Avatar 
                className="h-9 w-9 cursor-pointer ring-2 ring-border hover:ring-primary transition-all"
              >
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=finance" />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-0 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-8">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 space-y-6">
          {/* Dashboard view */}
          {activeNav === "Dashboard" && (
            <>
              {/* Smart natural-language input */}
              <SmartInput onAddTransaction={handleAddTransaction} />
              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Total Balance */}
                <Card className="border-border bg-card cursor-pointer hover:shadow-lg transition-shadow" onClick={openSummaryModal}>
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
                      {totalBalance.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-sm">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-primary font-medium">+12.5%</span>
                      <span className="text-muted-foreground">
                        from last month
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Income */}
                <Card className="border-border bg-card cursor-pointer hover:shadow-lg transition-shadow" onClick={openSummaryModal}>
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
                      {monthlyIncome.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-sm">
                      <TrendingUp className="h-4 w-4 text-chart-1" />
                      <span className="text-chart-1 font-medium">+8.2%</span>
                      <span className="text-muted-foreground">
                        from last month
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Expenses */}
                <Card className="border-border bg-card cursor-pointer hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1" onClick={openSummaryModal}>
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
                      {monthlyExpenses.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-sm">
                      <TrendingDown className="h-4 w-4 text-chart-5" />
                      <span className="text-chart-5 font-medium">-3.1%</span>
                      <span className="text-muted-foreground">
                        from last month
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Spending Chart */}
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-card-foreground">
                      Monthly Spending
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Your spending overview for {selectedYear}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedYear(selectedYear - 1)}
                      className="border-border bg-secondary text-foreground"
                    >
                      ←
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border bg-secondary text-foreground min-w-[80px]"
                      disabled
                    >
                      {selectedYear}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedYear(selectedYear + 1)}
                      className="border-border bg-secondary text-foreground"
                      disabled={selectedYear === new Date().getFullYear()}
                    >
                      →
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {isLoadingChart ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Loading chart data...
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
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
                          formatter={(value: number) => [
                            `$${value}`,
                            "Spending",
                          ]}
                        />
                        <Bar
                          dataKey="amount"
                          fill="oklch(0.75 0.15 165)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                    )}
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
                    onClick={() => setActiveNav("Transactions")}
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
                          <th className="py-3 text-center text-sm font-medium text-muted-foreground">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.slice(0, 5).map((transaction, index) => (
                          <tr
                            key={index}
                            className="border-b border-border/50 transition-colors hover:bg-secondary/50"
                          >
                            <td className="py-4 text-sm text-muted-foreground">
                              {transaction.date}
                            </td>
                            <td className="py-4 text-sm font-medium text-card-foreground" dangerouslySetInnerHTML={{ __html: transaction.merchant }} />
                            <td className="py-4">
                              {(() => {
                                const config = getCategoryConfig(transaction.category);
                                return (
                                  <span className={`inline-flex items-center rounded-full ${config.bgColor} px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
                                    {transaction.category}
                                  </span>
                                );
                              })()}
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
                            <td className="py-4 text-center">
                              {transaction.verified ? (
                                <span className="inline-flex items-center rounded-full bg-green-100/20 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                  ✓ Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full bg-gray-100/20 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-900/20 dark:text-gray-400">
                                  Pending
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Transactions view */}
          {activeNav === "Transactions" && (
            <>
              <TransactionFilter onFilterChange={setFilters} />
              
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-card-foreground">
                      All Transactions
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredTransactions.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No transactions found matching your filters.</p>
                    </div>
                  ) : (
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
                            <th className="py-3 text-center text-sm font-medium text-muted-foreground">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTransactions.map((transaction) => (
                            <tr
                              key={transaction.id}
                              className="border-b border-border/50 cursor-pointer transition-colors hover:bg-secondary/50"
                              onClick={() => openTransactionModal(transaction)}
                            >
                              <td className="py-4 text-sm text-muted-foreground">
                                {transaction.date}
                              </td>
                              <td className="py-4 text-sm font-medium text-card-foreground">
                                {transaction.merchant}
                              </td>
                              <td className="py-4">
                                {(() => {
                                  const config = getCategoryConfig(transaction.category);
                                  return (
                                    <span className={`inline-flex items-center rounded-full ${config.bgColor} px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
                                      {transaction.category}
                                    </span>
                                  );
                                })()}
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
                              <td className="py-4 text-center">
                                {transaction.verified ? (
                                  <span className="inline-flex items-center rounded-full bg-green-100/20 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                    ✓ Verified
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full bg-gray-100/20 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-900/20 dark:text-gray-400">
                                    Pending
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Visualization Tabs */}
          {activeNav === "Dashboard" && (
            <VisualizationTabs data={chartData} />
          )}

          {/* Spending Insights */}
          {activeNav === "Dashboard" && (
            <SpendingInsights transactions={transactions} />
          )}

          {/* Benchmark view */}
          {activeNav === "Benchmark" && (
            <Benchmark />
          )}
        </div>
        
        {/* Detail Modal */}
        <DetailModal
          type={modalType}
          data={modalData}
          onClose={() => setModalOpen(false)}
          isOpen={modalOpen}
        />
        
        {/* Overspending Alert Modal */}
        <OverspendingAlertModal alerts={alerts} />

        {/* Monthly Budget Modal */}
        <Dialog open={showBudgetModal} onOpenChange={setShowBudgetModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Set Monthly Budget</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="budget-input" className="text-right">
                  Budget
                </Label>
                <Input
                  id="budget-input"
                  type="number"
                  placeholder="3000"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  className="col-span-3"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Current budget: ${monthlyBudget.toFixed(2)}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowBudgetModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveBudget}>
                Save Budget
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
