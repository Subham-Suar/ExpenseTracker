import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from "recharts";
import { 
  Wallet, 
  Award, 
  BarChart3,
  Briefcase,
  TrendingUp,
  GraduationCap,
  Heart,
  Zap,
  Layers,
  DollarSign,
} from "lucide-react";

import TransactionManager from "../components/TransactionManager";
import {
  createIncome,
  deleteIncome as removeIncome,
  getApiError,
  getIncomes,
  updateIncome as saveIncomeUpdate,
} from "../lib/api";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.85, rotateX: 20 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { 
      staggerChildren: 0.15, 
      delayChildren: 0.4,
      type: "spring",
      stiffness: 90,
      damping: 18,
      mass: 1.2
    },
  },
};

const itemVariants = {
  hidden: { y: 35, opacity: 0, scale: 0.9, rotateY: 15 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: { 
      type: "spring", 
      stiffness: 130, 
      damping: 20,
      mass: 0.9,
      bounce: 0.4
    },
  },
};

// Income distribution list item animation
const listItemVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.95 },
  visible: (index) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 140,
      damping: 22,
      delay: index * 0.08,
      bounce: 0.5
    },
  }),
  hover: { x: 10, scale: 1.02, transition: { type: "spring", stiffness: 300 } },
};

// --- Get Income Source Icon ---
const getIncomeSourceIcon = (category) => {
  const categoryLower = category?.toLowerCase() || "";
  
  const iconMap = [
    { keywords: ["salary", "wage", "monthly", "employment", "job"], icon: Briefcase, bg: "bg-blue-500/10", text: "text-blue-400" },
    { keywords: ["freelance", "project", "gig", "contract", "consultant"], icon: TrendingUp, bg: "bg-green-500/10", text: "text-green-400" },
    { keywords: ["business", "sales", "commission", "resale"], icon: DollarSign, bg: "bg-yellow-500/10", text: "text-yellow-400" },
    { keywords: ["bonus", "award", "prize", "gift"], icon: Award, bg: "bg-purple-500/10", text: "text-purple-400" },
    { keywords: ["teaching", "education", "tuition", "course"], icon: GraduationCap, bg: "bg-indigo-500/10", text: "text-indigo-400" },
    { keywords: ["investment", "interest", "dividend", "returns"], icon: TrendingUp, bg: "bg-emerald-500/10", text: "text-emerald-400" },
    { keywords: ["passive", "rent", "royalty", "passive income"], icon: Layers, bg: "bg-cyan-500/10", text: "text-cyan-400" },
  ];

  for (const category_config of iconMap) {
    for (const keyword of category_config.keywords) {
      if (categoryLower.includes(keyword) || keyword.includes(categoryLower)) {
        return category_config;
      }
    }
  }

  return { icon: Wallet, bg: "bg-slate-500/10", text: "text-slate-400" };
};

// --- Custom Colors for Charts ---
const COLORS = ["#22C55E", "#38BDF8", "#8B5CF6", "#F59E0B", "#06B6D4"];

// --- Custom Tooltip for the Bar Chart ---
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-slate-700 min-w-[140px]">
        <p className="font-semibold text-slate-100 mb-2">{label}</p>
        <p className="text-slate-400 text-sm">
          Income : <span className="font-semibold text-green-500">${payload[0].value.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function Income() {
  const [incomeData, setIncomeData] = useState([]);

  // --- Statistical Calculations ---
  const stats = useMemo(() => {
    if (!Array.isArray(incomeData) || incomeData.length === 0) {
      return { total: 0, topCategory: "N/A", chartData: [], pieData: [] };
    }

    const total = incomeData.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    // Group for Pie Chart (by Category)
    const categoryMap = incomeData.reduce((acc, item) => {
      const cat = item.category || "Uncategorized";
      acc[cat] = (acc[cat] || 0) + Number(item.amount || 0);
      return acc;
    }, {});

    const pieData = Object.keys(categoryMap)
      .map((key) => ({
        name: key,
        value: categoryMap[key],
      }))
      .sort((a, b) => b.value - a.value);

    const topCategory = pieData.length > 0 ? pieData[0].name : "N/A";

    // Group for Bar Chart (Monthly Trends for Current Year)
    const currentYear = new Date().getFullYear();
    const monthlyData = [
      { name: "Jan", income: 0 }, { name: "Feb", income: 0 }, { name: "Mar", income: 0 },
      { name: "Apr", income: 0 }, { name: "May", income: 0 }, { name: "Jun", income: 0 },
      { name: "Jul", income: 0 }, { name: "Aug", income: 0 }, { name: "Sep", income: 0 },
      { name: "Oct", income: 0 }, { name: "Nov", income: 0 }, { name: "Dec", income: 0 },
    ];

    incomeData.forEach((item) => {
      const date = new Date(item.date);
      if (date.getFullYear() === currentYear) {
        monthlyData[date.getMonth()].income += Number(item.amount || 0);
      }
    });

    return { total, topCategory, chartData: monthlyData, pieData };
  }, [incomeData]);

  const currentMonthName = new Date().toLocaleString("en-US", { month: "short" });

  return (
    <div className="min-h-screen bg-slate-900 pt-4 xs:pt-5 sm:pt-6 lg:pt-8 px-3 xs:px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-6 xs:space-y-7 sm:space-y-8 lg:space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 xs:gap-4"
        >
          <div>
            <h1 className="text-1.5xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-100 tracking-tight leading-tight">Income Analytics</h1>
            <p className="text-xs xs:text-sm text-slate-400 mt-1.5 xs:mt-2">Track and analyze your revenue streams.</p>
          </div>
        </motion.div>

        {/* Analytics Dashboard section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 lg:gap-8"
        >
          {/* Metric Cards (Left Column) */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div variants={itemVariants} className="interactive-card bg-slate-800 p-4 sm:p-6 rounded-xl border border-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 overflow-hidden">
              <div className="p-4 bg-green-500/10 text-green-500 rounded-xl flex-shrink-0">
                <Wallet size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-400">Total Income</p>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-100 break-words">
                  ${stats.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h3>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="interactive-card bg-slate-800 p-4 sm:p-6 rounded-xl border border-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 overflow-hidden">
              <div className="p-4 bg-sky-400/10 text-sky-400 rounded-xl flex-shrink-0">
                <Award size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-400">Top Revenue Source</p>
                <h3 className="text-lg sm:text-xl font-bold text-slate-100 capitalize break-words">{stats.topCategory}</h3>
              </div>
            </motion.div>
          </div>

          {/* Bar Chart - Monthly Income Trend */}
          <motion.div variants={itemVariants} className="interactive-card md:col-span-1 lg:col-span-2 bg-slate-800 p-4 sm:p-6 rounded-xl border border-slate-700 shadow-sm min-h-[350px] flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="text-green-500 flex-shrink-0" size={24} />
              <h3 className="font-semibold text-slate-100 text-base sm:text-lg">
                Monthly Income Trends
                <span className="text-slate-400 font-normal text-xs sm:text-sm ml-2 tracking-wide">(This Year)</span>
              </h3>
            </div>
            <div className="flex-1 w-full h-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <BarChart
                  data={stats.chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    dx={-10}
                  />
                  <Tooltip
                    content={<CustomBarTooltip />}
                    cursor={{ fill: 'rgba(51, 65, 85, 0.4)' }}
                  />
                  <ReferenceLine x={currentMonthName} stroke="#22C55E" strokeDasharray="3 3" />
                  <Bar
                    dataKey="income"
                    fill="#22C55E"
                    radius={[6, 6, 6, 6]}
                    barSize={16}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart - Income Distribution */}
          <motion.div 
            variants={itemVariants} 
            className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-slate-800 to-slate-700/50 p-4 sm:p-8 rounded-2xl border border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start lg:items-center"
          >
            <div className="order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-bold text-xl sm:text-2xl text-slate-100 mb-2">Income Distribution</h3>
                <p className="text-sm text-slate-400 mb-6 sm:mb-8">A breakdown of where your money is coming from by category.</p>
              </motion.div>
              
              <motion.div 
                className="space-y-3 max-h-96 overflow-y-auto pr-2"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.08 } }
                }}
              >
                {stats.pieData.map((entry, index) => {
                  const sourceIcon = getIncomeSourceIcon(entry.name);
                  const IconComponent = sourceIcon.icon;
                  const percentage = stats.total > 0 ? ((entry.value / stats.total) * 100).toFixed(1) : 0;
                  
                  return (
                    <motion.div 
                      key={entry.name} 
                      custom={index}
                      variants={listItemVariants}
                      whileHover="hover"
                      className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border transition-all duration-300 ${sourceIcon.bg} border-slate-600/30 hover:border-slate-500 hover:shadow-lg cursor-pointer group`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        {/* Icon */}
                        <div className={`flex-shrink-0 p-2 sm:p-3 rounded-lg ${sourceIcon.bg} ${sourceIcon.text} group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent size={18} strokeWidth={2} />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-grow min-w-0 flex flex-col gap-1.5">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-slate-200 font-semibold capitalize text-xs sm:text-sm truncate flex-1">{entry.name}</span>
                            <span className="text-xs font-bold text-slate-400 flex-shrink-0 ml-1">{percentage}%</span>
                          </div>
                          <div className="w-full bg-slate-700/40 rounded-full h-2 overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Amount */}
                      <div className="flex-shrink-0 text-right">
                        <span className="text-sm sm:text-base font-bold text-slate-100 break-words">
                          ${entry.value.toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
            
            {/* Pie Chart */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="order-1 lg:order-2 h-64 flex items-center justify-center w-full"
            >
              <ResponsiveContainer width="100%" height="100%" minHeight={260}>
                <PieChart>
                  <Pie
                    data={stats.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    animationBegin={0}
                    animationDuration={800}
                    animationEasing="ease-out"
                  >
                    {stats.pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        opacity={0.9}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `$${value}`}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #334155', 
                      backgroundColor: '#1E293B', 
                      color: '#E2E8F0', 
                      boxShadow: '0 8px 16px -4px rgb(0 0 0 / 0.5)',
                      padding: "8px 12px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden"
        >
          <TransactionManager
            title="Income Records"
            typeLabel="income"
            accentClass="transaction-amount--income text-green-500"
            emptyText="No income records yet. Add your first salary, freelance payout, or other source."

            fetchItems={async () => {
              try {
                const response = await getIncomes();
                const incomeList = Array.isArray(response) ? response : [];
                setIncomeData(incomeList);
                return incomeList;
              } catch (error) {
                throw new Error(getApiError(error, "Unable to load income"));
              }
            }}

            createItem={async (payload) => {
              try {
                const response = await createIncome(payload);
                // Sync local state
                const newItem = response.data;
                if (newItem) {
                  setIncomeData((prev) => Array.isArray(prev) ? [newItem, ...prev] : [newItem]);
                }
                return response;
              } catch (error) {
                throw new Error(getApiError(error, "Unable to create income"));
              }
            }}

            updateItem={async (id, payload) => {
              try {
                const response = await saveIncomeUpdate(id, payload);
                // Sync local state
                const updatedItem = response.data;
                if (updatedItem) {
                  setIncomeData((prev) => Array.isArray(prev) ? prev.map(item => item._id === id || item.id === id ? updatedItem : item) : [updatedItem]);
                }
                return response;
              } catch (error) {
                throw new Error(getApiError(error, "Unable to update income"));
              }
            }}

            deleteItem={async (id) => {
              try {
                await removeIncome(id);
                // Sync local state
                setIncomeData((prev) => Array.isArray(prev) ? prev.filter(item => item._id !== id && item.id !== id) : []);
              } catch (error) {
                throw new Error(getApiError(error, "Unable to delete income"));
              }
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
