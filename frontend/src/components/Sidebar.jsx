import React, { useState, useEffect } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronLeft,
  Home,
  Settings,
  WalletCards
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
  }, [setIsCollapsed, setMobileOpen]);

  // Framer Motion variants for text animations
  const textVariants = {
    hidden: { opacity: 0, width: 0, transition: { duration: 0.2 } },
    visible: { opacity: 1, width: "auto", transition: { duration: 0.3, delay: 0.1 } },
  };

  const showExpandedContent = !isCollapsed || isMobile;

  return (
    <>
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
        style={{ top: 0, height: "100vh" }}
        className="fixed left-0 bg-slate-900 border-r border-slate-800 flex flex-col z-50 md:z-30 shadow-[0_0_20px_rgba(0,0,0,0.3)] md:shadow-none overflow-hidden"
      >
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

        <div className={`sidebar-brand px-5 pt-7 ${showExpandedContent ? "" : "justify-center px-2"}`}>
          <div className="brand-mark h-12 w-12 rounded-2xl shadow-[0_10px_28px_-14px_rgba(56,189,248,0.85)]">
            <WalletCards size={22} />
          </div>

          <AnimatePresence>
            {showExpandedContent && (
              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="min-w-0 overflow-hidden"
              >
                <h1 className="brand-title whitespace-nowrap text-[15px] font-bold leading-tight text-slate-50">Equity Ledger</h1>
                <p className="brand-subtitle whitespace-nowrap mt-1 text-[12px] font-medium leading-none">Expense Tracker</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Menu */}
        <nav className={`flex-1 py-7 space-y-3 overflow-y-auto overflow-x-hidden ${showExpandedContent ? "px-4" : "px-2"}`}>
          {menuItems.map(({ label, path, icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={() => isMobile && setMobileOpen(false)} // Auto-close on mobile selection
              className={({ isActive }) => {
                const activeClass =
                  isActive && path === "/"
                    ? "bg-sky-400/10 text-sky-400 font-semibold"
                    : isActive
                      ? "bg-slate-800/85 text-slate-100 font-semibold"
                      : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 font-medium";

                return `
                  relative flex items-center min-h-[58px] rounded-2xl cursor-pointer group transition-all duration-200
                  ${showExpandedContent ? "px-4" : "justify-center px-0"}
                  ${activeClass}
                `;
              }}
            >
              <div className="flex-shrink-0">
                {React.createElement(icon, {
                  size: 23,
                  className: "transition-transform group-hover:scale-110",
                })}
              </div>

              <AnimatePresence>
                {showExpandedContent && (
                  <motion.span
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="ml-4 whitespace-nowrap overflow-hidden text-[14px] font-semibold tracking-[-0.01em]"
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
        <div className={`p-4 border-t border-slate-800 mb-2 ${showExpandedContent ? "" : "px-2"}`}>
          <NavLink
            to="/profile"
            onClick={() => isMobile && setMobileOpen(false)}
            className={`flex items-center rounded-xl hover:bg-slate-800/80 transition-colors group ${showExpandedContent ? "p-2" : "justify-center p-2"}`}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-emerald-500 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm transition-transform group-hover:scale-105">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            
            <AnimatePresence>
              {showExpandedContent && (
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
