import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, BarChart2, TrendingDown, Download, Calendar } from "lucide-react";
import { toast } from "react-toastify";

import TransactionManager from "../components/TransactionManager";
import {
  createExpense,
  deleteExpense as removeExpense,
  getApiError,
  getExpenses,
  sendExpenseExport,
  updateExpense as saveExpenseUpdate,
} from "../lib/api";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0, y: 70, scale: 0.8, rotateX: -10 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { 
      staggerChildren: 0.18, 
      delayChildren: 0.35,
      type: "spring",
      stiffness: 85,
      damping: 19,
      mass: 1.1
    },
  },
};

const itemVariants = {
  hidden: { y: 45, opacity: 0, scale: 0.85, rotateY: -20 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: { 
      type: "spring", 
      stiffness: 125, 
      damping: 17,
      mass: 0.95,
      bounce: 0.35
    },
  },
};

// --- Custom Tooltip ---
const CustomAreaTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 min-w-[120px]">
        <p className="font-bold text-slate-700 mb-2">{label}</p>
        <p className="text-sm font-medium" style={{ color: '#f59e0b' }}>
          Expense : ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function Expense() {
  const [expenseData, setExpenseData] = useState([]);
  const [selectedMode, setSelectedMode] = useState("Monthly");
  const [exporting, setExporting] = useState(false);

  const modeDefinitions = {
    Daily: { label: "Daily Expense Trends", subtitle: "This Month" },
    Weekly: { label: "Weekly Expense Trends", subtitle: "Last 12 Weeks" },
    Monthly: { label: "Monthly Expense Trends", subtitle: "This Year" },
    Yearly: { label: "Yearly Expense Trends", subtitle: "All Time" },
  };

  const stats = useMemo(() => {
    if (!Array.isArray(expenseData) || expenseData.length === 0) {
      const emptySeries = Array.from({ length: 31 }, (_, i) => ({ day: String(i + 1), expense: 0 }));
      return { total: 0, average: 0, transactions: 0, chartData: emptySeries, title: modeDefinitions[selectedMode].label, subtitle: modeDefinitions[selectedMode].subtitle };
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const safeItems = expenseData
      .filter((item) => item?.date)
      .map((item) => ({
        ...item,
        dateObj: new Date(item.date),
        amount: Number(item.amount || 0),
      }))
      .filter((item) => !Number.isNaN(item.dateObj.getTime()));

    let chartData = [];
    let filteredItems = [];

    const weekStart = (date) => {
      const day = date.getDay();
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() - day);
    };

    switch (selectedMode) {
      case "Daily": {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        chartData = Array.from({ length: daysInMonth }, (_, i) => ({ day: String(i + 1), expense: 0 }));
        filteredItems = safeItems.filter((item) => item.dateObj.getFullYear() === currentYear && item.dateObj.getMonth() === currentMonth);
        filteredItems.forEach((item) => {
          chartData[item.dateObj.getDate() - 1].expense += item.amount;
        });
        break;
      }
      case "Weekly": {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const currentWeekStart = weekStart(today);
        const weeks = Array.from({ length: 12 }, (_, index) => {
          const start = new Date(currentWeekStart);
          start.setDate(start.getDate() - (11 - index) * 7);
          return { start, label: `${start.getMonth() + 1}/${start.getDate()}`, expense: 0 };
        });

        filteredItems = safeItems.filter((item) => item.dateObj >= weeks[0].start && item.dateObj <= now);
        filteredItems.forEach((item) => {
          for (const week of weeks) {
            const weekEnd = new Date(week.start);
            weekEnd.setDate(week.start.getDate() + 7);
            if (item.dateObj >= week.start && item.dateObj < weekEnd) {
              week.expense += item.amount;
              break;
            }
          }
        });
        chartData = weeks.map((week) => ({ day: week.label, expense: week.expense }));
        break;
      }
      case "Yearly": {
        const yearMap = safeItems.reduce((acc, item) => {
          const year = item.dateObj.getFullYear();
          acc[year] = (acc[year] || 0) + item.amount;
          return acc;
        }, {});
        chartData = Object.keys(yearMap)
          .sort((a, b) => Number(a) - Number(b))
          .map((year) => ({ day: year, expense: yearMap[year] }));
        filteredItems = safeItems;
        break;
      }
      case "Monthly":
      default: {
        const months = Array.from({ length: 12 }, (_, i) => ({ day: new Date(currentYear, i, 1).toLocaleString("en-US", { month: "short" }), expense: 0, month: i }));
        filteredItems = safeItems.filter((item) => item.dateObj.getFullYear() === currentYear);
        filteredItems.forEach((item) => {
          months[item.dateObj.getMonth()].expense += item.amount;
        });
        chartData = months.map(({ day, expense }) => ({ day, expense }));
        break;
      }
    }

    const total = filteredItems.reduce((sum, item) => sum + item.amount, 0);
    const transactions = filteredItems.length;
    const average = transactions > 0 ? Math.round(total / transactions) : 0;

    return {
      total,
      average,
      transactions,
      chartData,
      title: modeDefinitions[selectedMode].label,
      subtitle: modeDefinitions[selectedMode].subtitle,
    };
  }, [expenseData, selectedMode]);

  const handleExportData = async () => {
    setExporting(true);
    try {
      await sendExpenseExport(selectedMode.toLowerCase());
      toast.success(`Expense report for ${selectedMode} has been sent to your email.`);
    } catch (error) {
      const message = getApiError(error, "Unable to send expense export.");
      if (message.toLowerCase().includes("smtp configuration") || message.toLowerCase().includes("smtp not configured")) {
        toast.info("SMTP is not configured. Downloading the report instead.");
        window.location.href = "/api/expense/downloadexcel";
      } else {
        toast.error(message);
      }
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header and Filter Toggles */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Expense Analytics</h1>
          <p className="text-slate-400 mt-1">Track and manage your expenses</p>
        </div>
        <div className="flex bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-1">
          {["Daily", "Weekly", "Monthly", "Yearly"].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedMode(period)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                period === selectedMode
                  ? "bg-red-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-700"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Analytics Dashboard section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6"
      >
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="bg-slate-800 p-6 rounded-xl border-2 border-red-900/50 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                <DollarSign size={20} />
              </div>
              <p className="text-sm font-semibold text-slate-400">Total Expenses</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-100 mb-1">
                ${stats.total.toLocaleString(undefined, { minimumFractionDigits: 0 })}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                 <Calendar size={12} /> {stats.subtitle}
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                <BarChart2 size={20} />
              </div>
              <p className="text-sm font-semibold text-slate-400">Average Expense</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-100 mb-1">
                ${stats.average.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                 <Calendar size={12} /> {stats.transactions} transactions
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-slate-800 p-6 rounded-xl border-2 border-red-900/50 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                <TrendingDown size={20} />
              </div>
              <p className="text-sm font-semibold text-slate-400">Transactions</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-100 mb-1">
                {stats.transactions}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                 <Calendar size={12} /> All records
              </p>
            </div>
          </motion.div>
        </div>

        {/* Daily Expense Trends Area Chart */}
        <motion.div variants={itemVariants} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <BarChart2 className="text-red-500" size={24} />
              <h3 className="font-semibold text-slate-100 text-lg">
                {stats.title}
                <span className="text-slate-500 font-normal text-sm ml-2 tracking-wide">({stats.subtitle})</span>
              </h3>
            </div>
            <button
              onClick={handleExportData}
              disabled={exporting}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                exporting
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                  : "text-slate-300 bg-slate-800 border border-slate-600 hover:bg-slate-700"
              }`}
            >
              <Download size={16} /> {exporting ? "Sending..." : "Export Data"}
            </button>
          </div>
          
          <div className="flex-1 w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorExpenseAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 13 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 13 }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  dx={-10}
                />
                <Tooltip
                  content={<CustomAreaTooltip />}
                  cursor={{ stroke: '#EF4444', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#EF4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorExpenseAmount)"
                  activeDot={{ r: 6, fill: '#EF4444', stroke: '#1E293B', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>

      {/* Existing Transaction Manager */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
           <h3 className="font-semibold text-slate-100 text-lg flex items-center gap-2">
             <DollarSign className="text-red-500" size={20} />
             Expense Transactions <span className="text-slate-500 font-normal text-sm ml-1">(This Month)</span>
           </h3>
           <div className="flex gap-2">
             <button className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors">
               All Transactions
             </button>
             <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors">
               <Download size={16} /> Export
             </button>
           </div>
        </div>
        
        <div className="p-0">
          <TransactionManager
            title="Manage Expenses"
            typeLabel="expense"
            accentClass="transaction-amount--expense text-rose-600"
            emptyText="No expense records yet. Add spending entries to start tracking your outflow."

            fetchItems={async () => {
              try {
                const response = await getExpenses();
                const expenseList = Array.isArray(response) ? response : [];
                setExpenseData(expenseList);
                return expenseList;
              } catch (error) {
                throw new Error(getApiError(error, "Unable to load expenses"));
              }
            }}

            createItem={async (payload) => {
              try {
                const response = await createExpense(payload);
                const newItem = response.data;
                if (newItem) {
                  setExpenseData((prev) => Array.isArray(prev) ? [newItem, ...prev] : [newItem]);
                }
                return response;
              } catch (error) {
                throw new Error(getApiError(error, "Unable to create expense"));
              }
            }}

            updateItem={async (id, payload) => {
              try {
                const response = await saveExpenseUpdate(id, payload);
                const updatedItem = response.data;
                if (updatedItem) {
                  setExpenseData((prev) => Array.isArray(prev) ? prev.map(item => item._id === id || item.id === id ? updatedItem : item) : [updatedItem]);
                }
                return response;
              } catch (error) {
                throw new Error(getApiError(error, "Unable to update expense"));
              }
            }}

            deleteItem={async (id) => {
              try {
                await removeExpense(id);
                setExpenseData((prev) => Array.isArray(prev) ? prev.filter(item => item._id !== id && item.id !== id) : []);
              } catch (error) {
                throw new Error(getApiError(error, "Unable to delete expense"));
              }
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
