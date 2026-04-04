import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { 
  CreditCard, 
  TrendingDown, 
  TrendingUp,
  Utensils,
  ShoppingBag,
  Home,
  Zap,
  Dumbbell,
  Gamepad2,
  Book,
  Pill,
  Car,
  Plane,
  Music,
  Tag,
} from "lucide-react";
import { getApiError, getDashboardOverview } from "../lib/api";
import { formatCurrency, formatDate } from "../lib/format";
import RadialGauge from "../components/RadialGauge";

const MotionDiv = motion.div;

// Category to Icon and Color Mapping
const getCategoryIcon = (category) => {
  const categoryLower = category?.toLowerCase() || "";
  
  const iconMap = [
    // Food & Dining
    { keywords: ["food", "restaurant", "cafe", "dining", "lunch", "breakfast", "dinner", "grocery", "shopping"], icon: Utensils, bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
    // Shopping & Clothes
    { keywords: ["dress", "clothes", "clothing", "apparel", "fashion", "shoes", "shopping", "mall"], icon: ShoppingBag, bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/20" },
    // Housing
    { keywords: ["rent", "home", "house", "mortgage", "property", "living", "apartment"], icon: Home, bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
    // Utilities & Bills
    { keywords: ["utilities", "electric", "water", "gas", "bills", "electricity", "internet"], icon: Zap, bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
    // Health & Medicine
    { keywords: ["health", "medicine", "medical", "hospital", "doctor", "pharmacy", "clinic"], icon: Pill, bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
    // Fitness & Sports
    { keywords: ["fitness", "gym", "sports", "exercise", "training"], icon: Dumbbell, bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
    // Entertainment
    { keywords: ["entertainment", "movie", "cinema", "game", "gaming", "theater"], icon: Gamepad2, bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
    // Education & Books
    { keywords: ["education", "school", "book", "course", "learning", "study"], icon: Book, bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20" },
    // Transport & Travel
    { keywords: ["transport", "car", "taxi", "bus", "fuel", "petrol", "gas", "train", "vehicle"], icon: Car, bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
    // Travel & Flights
    { keywords: ["travel", "flight", "plane", "hotel", "trip", "vacation"], icon: Plane, bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/20" },
    // Music & Audio
    { keywords: ["music", "spotify", "audio", "subscription"], icon: Music, bg: "bg-fuchsia-500/10", text: "text-fuchsia-400", border: "border-fuchsia-500/20" },
  ];

  // Find matching category
  for (const category_config of iconMap) {
    for (const keyword of category_config.keywords) {
      if (categoryLower.includes(keyword) || keyword.includes(categoryLower)) {
        return category_config;
      }
    }
  }

  // Default icon
  return { icon: Tag, bg: "bg-slate-600/10", text: "text-slate-400", border: "border-slate-600/20" };
};

const containerVars = {
  hidden: { opacity: 0, y: 50, scale: 0.9, rotateX: 15 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { 
      staggerChildren: 0.2, 
      delayChildren: 0.3,
      type: "spring",
      stiffness: 80,
      damping: 20,
      mass: 1
    },
  },
};

const itemVars = {
  hidden: { y: 40, opacity: 0, scale: 0.8, rotateY: -10 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: { 
      type: "spring", 
      stiffness: 120, 
      damping: 15,
      mass: 0.8,
      bounce: 0.3
    },
  },
};

function Dashboard({ user }) {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const response = await getDashboardOverview();

        if (!ignore) {
          setOverview(response.data);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(getApiError(loadError, "Unable to load dashboard"));
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, []);

  const recentTransactions = overview?.recentTransactions?.slice(0, 5) || [];
  const expenseDistribution = overview?.expenseDistribution || [];
  const income = overview?.monthlyIncome || 0;
  const spent = overview?.monthlyExpense || 0;
  const currentCashFlow = income - spent;
  const savings = Math.max(0, currentCashFlow);

  const baseValue = currentCashFlow || 5000;
  const chartData = useMemo(() => {
    if (!overview?.recentTransactions) return [];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const today = new Date().getDate();

    const dailyData = Array.from({ length: today }, (_, i) => ({
      name: String(i + 1),
      income: 0,
      expense: 0,
    }));

    overview.recentTransactions.forEach(t => {
      const d = new Date(t.date);
      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        const dayIdx = d.getDate() - 1;
        if (dayIdx >= 0 && dayIdx < today) {
           if (t.type === 'income') {
              dailyData[dayIdx].income += Number(t.amount || 0);
           } else {
              dailyData[dayIdx].expense += Number(t.amount || 0);
           }
        }
      }
    });

    let cumIncome = 0;
    let cumExpense = 0;
    return dailyData.map(d => {
       cumIncome += d.income;
       cumExpense += d.expense;
       return {
         name: d.name,
         cashFlow: cumIncome - cumExpense,
         expense: cumExpense
       };
    });
  }, [overview]);

  const incomePercent = income > 0 ? 100 : 0;
  const spentPercent = income > 0 ? Math.min(100, Math.round((spent / income) * 100)) : 0;
  const savingsPercent = income > 0 ? Math.min(100, Math.round((savings / income) * 100)) : 0;

  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      variants={containerVars}
      className="p-6 lg:p-10 bg-slate-900 min-h-screen w-full font-sans text-slate-200"
    >
      <MotionDiv
        variants={itemVars}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="dashboard-header relative overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-950/70 p-6 lg:p-8 mb-8"
      >
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-sky-500/10 via-fuchsia-500/10 to-emerald-500/10 blur-3xl opacity-80" />
        <div className="relative">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-100">
            Welcome, {user?.name || "there"}
          </h1>
          <p className="text-slate-500 mt-2 max-w-2xl">
            Experience a modern expense tracker theme with motion-driven analytics, clear spending insights, and budget-aware visuals.
          </p>
        </div>
      </MotionDiv>

      {error ? <p className="form-message form-message--error">{error}</p> : null}
      {loading ? <p className="transaction-empty">Loading dashboard...</p> : null}

      {!loading && overview ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {[
              {
                title: "Balance",
                amount: formatCurrency(overview.savings),
                icon: <CreditCard />,
                iconClass: "bg-sky-400/10 text-sky-400",
                textClass: "text-sky-400",
              },
              {
                title: "Monthly Income",
                amount: formatCurrency(overview.monthlyIncome),
                icon: <TrendingUp />,
                iconClass: "bg-green-500/10 text-green-500",
                textClass: "text-green-500",
              },
              {
                title: "Monthly Expense",
                amount: formatCurrency(overview.monthlyExpense),
                icon: <TrendingDown />,
                iconClass: "bg-red-500/10 text-red-500",
                textClass: "text-red-500",
              },
            ].map((card) => (
              <MotionDiv
                key={card.title}
                variants={itemVars}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={`bg-slate-800/95 backdrop-blur-xl p-8 rounded-[28px] shadow-[0_25px_80px_-40px_rgba(15,23,42,0.8)] border border-slate-700/80 flex flex-col justify-between h-48`}
              >
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-xl ${card.iconClass}`}>
                    {card.icon}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-widest text-slate-500`}>
                    {overview.savingsRate}% saved
                  </span>
                </div>
                <div>
                  <p className={`text-sm font-medium text-slate-400`}>
                    {card.title}
                  </p>
                  <h2 className={`text-3xl font-bold mt-1 text-slate-100`}>
                    {card.amount}
                  </h2>
                </div>
              </MotionDiv>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <MotionDiv variants={itemVars}>
              <RadialGauge title="Income" amount={formatCurrency(income)} percentage={incomePercent} color="#22C55E" />
            </MotionDiv>
            <MotionDiv variants={itemVars}>
              <RadialGauge title="Spent" amount={formatCurrency(spent)} percentage={spentPercent} color="#EF4444" />
            </MotionDiv>
            <MotionDiv variants={itemVars}>
              <RadialGauge title="Savings" amount={formatCurrency(savings)} percentage={savingsPercent} color="#38BDF8" />
            </MotionDiv>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <MotionDiv
              variants={itemVars}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="lg:col-span-2 bg-slate-800/95 p-8 rounded-[28px] shadow-[0_28px_90px_-40px_rgba(15,23,42,0.9)] border border-slate-700"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl lg:text-2xl font-bold text-slate-100">Monthly Cash Flow</h3>
              </div>
              <div className="h-[320px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#334155" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={{ strokeWidth: 3, stroke: "#475569" }} 
                      tickLine={false} 
                      tick={{ fill: "#94A3B8", fontSize: 12, dy: 10 }} 
                    />
                    <YAxis 
                      axisLine={{ strokeWidth: 3, stroke: "#475569" }} 
                      tickLine={false} 
                      tick={{ fill: "#94A3B8", fontSize: 12, dx: -10 }} 
                      tickFormatter={(val) => `$${val}`} 
                    />
                    <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#1E293B', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
                       itemStyle={{ color: '#38BDF8', fontWeight: 'bold' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="cashFlow"
                      stroke="#38BDF8"
                      strokeWidth={4}
                      dot={{ fill: "#0F172A", stroke: "#38BDF8", strokeWidth: 3, r: 6 }}
                      activeDot={{ r: 10, strokeWidth: 0, fill: "#38BDF8" }}
                      animationDuration={1400}
                      name="Cash Flow"
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      stroke="#EF4444"
                      strokeWidth={4}
                      dot={{ fill: "#0F172A", stroke: "#EF4444", strokeWidth: 3, r: 6 }}
                      activeDot={{ r: 10, strokeWidth: 0, fill: "#EF4444" }}
                      animationDuration={1400}
                      name="Expense"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </MotionDiv>

            <MotionDiv
              variants={itemVars}
              className="bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-700"
            >
              <h3 className="text-xl font-bold text-slate-100 mb-6">Expense Mix</h3>
              <div className="space-y-3">
                {expenseDistribution.length ? (
                  expenseDistribution.map((item) => {
                    const categoryInfo = getCategoryIcon(item.category);
                    const IconComponent = categoryInfo.icon;
                    
                    return (
                      <motion.div
                        key={item.category}
                        whileHover={{ x: 2 }}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ${categoryInfo.bg} ${categoryInfo.border} hover:shadow-md`}
                      >
                        <div className={`flex-shrink-0 p-2 rounded-lg ${categoryInfo.bg} ${categoryInfo.text}`}>
                          <IconComponent size={18} strokeWidth={2} />
                        </div>
                        <div className="flex-grow min-w-0">
                          <strong className="text-slate-200 text-sm capitalize block">{item.category}</strong>
                          <p className="text-slate-400 text-xs">{item.percent}% of this month&apos;s expense</p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <span className="text-red-400 font-bold text-sm">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <p className="transaction-empty text-slate-500 text-center py-6">No expenses recorded this month yet.</p>
                )}
              </div>
            </MotionDiv>
          </div>

          <MotionDiv
            variants={itemVars}
            className="bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-700 mt-8"
          >
            <h3 className="text-xl font-bold text-slate-100 mb-6">Recent Transactions</h3>
            <div className="space-y-4">
              {recentTransactions.length ? (
                recentTransactions.map((item) => {
                  const categoryInfo = getCategoryIcon(item.category);
                  const IconComponent = categoryInfo.icon;
                  
                  return (
                    <motion.article
                      key={item._id}
                      whileHover={{ x: 4 }}
                      className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 ${categoryInfo.bg} ${categoryInfo.border} hover:shadow-lg hover:border-opacity-50 bg-gradient-to-r from-slate-700/40 to-transparent`}
                    >
                      {/* Icon Container */}
                      <div className={`flex-shrink-0 p-3 rounded-xl ${categoryInfo.bg} ${categoryInfo.text}`}>
                        <IconComponent size={24} strokeWidth={2} />
                      </div>

                      {/* Content */}
                      <div className="flex-grow min-w-0">
                        <h4 className="text-slate-100 font-semibold text-sm truncate capitalize">
                          {item.description}
                        </h4>
                        <p className="text-slate-400 text-xs mt-1">
                          <span className="capitalize">{item.category}</span>
                          <span className="mx-1">•</span>
                          <span>{formatDate(item.date)}</span>
                        </p>
                      </div>

                      {/* Amount */}
                      <div className="flex-shrink-0 text-right">
                        <span
                          className={`text-lg font-bold transition-colors ${
                            item.type === "income"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {item.type === "income" ? "+" : "-"}{formatCurrency(item.amount)}
                        </span>
                      </div>
                    </motion.article>
                  );
                })
              ) : (
                <p className="transaction-empty text-slate-500 text-center py-8">
                  No transactions yet.
                </p>
              )}
            </div>
          </MotionDiv>
        </>
      ) : null}
    </MotionDiv>
  );
}

export default Dashboard;
