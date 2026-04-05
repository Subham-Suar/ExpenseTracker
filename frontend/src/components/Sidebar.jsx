import React, { useState, useEffect } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronLeft,
  Home,
  Settings,
  WalletCards,
  Menu,
  X
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const MotionAside = motion.aside;
const MotionDiv = motion.div;

const menuItems = [
  { label: "Dashboard", path: "/", icon: Home, end: true },
  { label: "Income", path: "/income", icon: ArrowUpCircle },
  { label: "Expenses", path: "/expense", icon: ArrowDownCircle },
  { label: "Profile", path: "/profile", icon: Settings },
];

export default function Sidebar({ user, isCollapsed, setIsCollapsed, mobileOpen, setMobileOpen }) {
  // Auto-collapse on smaller screens
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(false);
      } else {
        setMobileOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsCollapsed]);

  // Framer Motion variants for text animations
  const textVariants = {
    hidden: { opacity: 0, width: 0, transition: { duration: 0.2 } },
    visible: { opacity: 1, width: "auto", transition: { duration: 0.3, delay: 0.1 } },
  };

  return (
    <>
      {/* Mobile Header & Hamburger Menu */}
      {isMobile && (
        <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 fixed top-0 w-full z-40">
          <div className="flex items-center gap-2 text-sky-400 font-bold">
            <WalletCards size={24} />
            <span>Equity Ledger</span>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 bg-slate-800 rounded-lg text-slate-300">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      )}

      {/* Mobile Overlay Backdrop */}
      {isMobile && mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <MotionAside
        initial={false}
        animate={{ 
          width: isMobile ? (mobileOpen ? 256 : 0) : (isCollapsed ? 80 : 256),
          x: isMobile && !mobileOpen ? -256 : 0 
        }}
        className="fixed md:sticky top-0 left-0 h-screen bg-slate-900 border-r border-slate-800 flex flex-col z-50 shadow-[0_0_20px_rgba(0,0,0,0.3)] md:shadow-none overflow-hidden"
      >
        {/* Brand Header */}
        <NavLink
          to="/"
          onClick={() => isMobile && setMobileOpen(false)}
          className="flex items-center p-5 min-h-[80px] relative group"
        >
          <div className="p-2 bg-gradient-to-br from-sky-400 to-blue-600 text-white rounded-xl flex-shrink-0 z-10 shadow-md shadow-sky-500/20 transition-transform group-hover:-translate-y-0.5">
            <WalletCards size={24} />
          </div>
          <AnimatePresence>
            {(!isCollapsed || isMobile) && (
              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="ml-3 whitespace-nowrap overflow-hidden"
              >
                <h2 className="font-bold text-slate-100 text-lg leading-tight tracking-tight">Equity Ledger</h2>
                <span className="text-xs font-medium text-slate-400">Expense Tracker</span>
              </motion.div>
            )}
          </AnimatePresence>
        </NavLink>

        {/* Desktop Collapse Toggle */}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3.5 top-8 bg-slate-800 border border-slate-700 text-slate-400 hover:text-sky-400 hover:border-sky-400/50 p-1 rounded-full shadow-lg transition-colors z-20"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <MotionDiv animate={{ rotate: isCollapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronLeft size={16} />
            </MotionDiv>
          </button>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
          {menuItems.map(({ label, path, icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={() => isMobile && setMobileOpen(false)} // Auto-close on mobile selection
              className={({ isActive }) => `
                relative flex items-center px-3 py-3 rounded-xl cursor-pointer group transition-all duration-200
                ${isActive 
                  ? "bg-sky-400/10 text-sky-400 font-semibold" 
                  : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 font-medium"}
              `}
            >
              <div className="flex-shrink-0">
                {React.createElement(icon, {
                  size: 22,
                  className: "transition-transform group-hover:scale-110",
                })}
              </div>

              <AnimatePresence>
                {(!isCollapsed || isMobile) && (
                  <motion.span
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="ml-4 whitespace-nowrap overflow-hidden"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip for Collapsed State */}
              {!isMobile && isCollapsed && (
                <div className="absolute left-14 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-md whitespace-nowrap pointer-events-none transition-opacity z-50 shadow-xl">
                  {label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer / User Profile */}
        <div className="p-4 border-t border-slate-800 mb-2">
          <NavLink
            to="/profile"
            onClick={() => isMobile && setMobileOpen(false)}
            className="flex items-center p-2 rounded-xl hover:bg-slate-800/80 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-emerald-500 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm transition-transform group-hover:scale-105">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            
            <AnimatePresence>
              {(!isCollapsed || isMobile) && (
                <motion.div
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="ml-3 whitespace-nowrap overflow-hidden"
                >
                  <p className="text-sm font-bold text-slate-100 leading-tight">
                    {user?.name || "Expense Admin"}
                  </p>
                  <p className="text-xs font-medium text-slate-400 truncate w-32">
                    {user?.email || "track@ledger.app"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </NavLink>
        </div>
      </MotionAside>
    </>
  );
}
