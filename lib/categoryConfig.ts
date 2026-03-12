// Category colors and icons for transactions
export const categoryConfig: Record<string, { color: string; bgColor: string; lightBg: string }> = {
  Income: {
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/20",
    lightBg: "bg-emerald-900/20"
  },
  Salary: {
    color: "text-emerald-600",
    bgColor: "bg-emerald-600/20",
    lightBg: "bg-emerald-900/20"
  },
  Food: {
    color: "text-orange-500",
    bgColor: "bg-orange-500/20",
    lightBg: "bg-orange-900/20"
  },
  Groceries: {
    color: "text-orange-600",
    bgColor: "bg-orange-600/20",
    lightBg: "bg-orange-900/20"
  },
  Transport: {
    color: "text-blue-500",
    bgColor: "bg-blue-500/20",
    lightBg: "bg-blue-900/20"
  },
  Transportation: {
    color: "text-blue-600",
    bgColor: "bg-blue-600/20",
    lightBg: "bg-blue-900/20"
  },
  Entertainment: {
    color: "text-purple-500",
    bgColor: "bg-purple-500/20",
    lightBg: "bg-purple-900/20"
  },
  Shopping: {
    color: "text-pink-500",
    bgColor: "bg-pink-500/20",
    lightBg: "bg-pink-900/20"
  },
  Electronics: {
    color: "text-violet-500",
    bgColor: "bg-violet-500/20",
    lightBg: "bg-violet-900/20"
  },
  Bills: {
    color: "text-red-500",
    bgColor: "bg-red-500/20",
    lightBg: "bg-red-900/20"
  },
  Health: {
    color: "text-rose-500",
    bgColor: "bg-rose-500/20",
    lightBg: "bg-rose-900/20"
  },
  Other: {
    color: "text-gray-500",
    bgColor: "bg-gray-500/20",
    lightBg: "bg-gray-900/20"
  },
};

export const getCategoryConfig = (category: string) => {
  return categoryConfig[category] || categoryConfig.Other;
};
