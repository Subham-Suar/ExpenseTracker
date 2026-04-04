// import { Bell, CalendarRange, LogOut, Search } from "lucide-react";

// const formatDisplayDate = () =>
//   new Intl.DateTimeFormat("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   }).format(new Date());

// function Navbar({ user, onLogout }) {
//   const initials = user?.name?.[0]?.toUpperCase() || "U";

//   return (
//     <header className="topbar">
//       <div className="topbar-search">
//         <Search size={18} />
//         <input type="text" placeholder="Search transactions, budgets, categories..." />
//       </div>

//       <div className="topbar-actions">
//         <div className="date-pill">
//           <CalendarRange size={16} />
//           <span>{formatDisplayDate()}</span>
//         </div>

//         <button className="icon-button" type="button" aria-label="Notifications">
//           <Bell size={18} />
//         </button>

//         <div className="profile-chip">
//           <div className="avatar-badge">{initials}</div>
//           <div className="profile-copy">
//             <strong>{user?.name || "Expense Admin"}</strong>
//             <span>{user?.email || "track@ledger.app"}</span>
//           </div>
//         </div>

//         <button className="logout-button" type="button" onClick={onLogout}>
//           <LogOut size={16} />
//           <span>Logout</span>
//         </button>
//       </div>
//     </header>
//   );
// }

// export default Navbar;
import React, { useState, useEffect } from "react";
import { Bell, CalendarRange, LogOut, Search, X, ChevronDown } from "lucide-react";
import "./Navbar.css"; // Make sure to link the CSS file below

const formatDisplayDate = () =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

function Navbar({ user, onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const hasNotifications = true;

  const initials = user?.name?.[0]?.toUpperCase() || "U";

  // Add a sleek glassmorphism effect when scrolling down the page
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`topbar ${isScrolled ? "topbar-scrolled" : ""}`}>
      {/* Search Section with Focus Animations */}
      <div className={`topbar-search ${isSearchFocused ? "search-focused" : ""}`}>
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search transactions, budgets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
        {searchQuery && (
          <button 
            className="clear-search-btn" 
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="topbar-actions">
        {/* Date Pill with Hover Lift */}
        <div className="date-pill">
          <CalendarRange size={16} className="text-muted" />
          <span>{formatDisplayDate()}</span>
        </div>

        {/* Animated Notification Bell */}
        <button className="icon-button notification-btn" type="button" aria-label="Notifications">
          <Bell size={20} />
          {hasNotifications && <span className="notification-dot pulse-animation"></span>}
        </button>

        {/* Interactive Profile Chip */}
        <div className="profile-chip group">
          <div className="avatar-badge">{initials}</div>
          <div className="profile-copy">
            <strong>{user?.name || "Expense Admin"}</strong>
            <span>{user?.email || "track@ledger.app"}</span>
          </div>
          <ChevronDown size={14} className="dropdown-icon" />
          
          {/* Subtle dropdown hint on hover */}
          <div className="profile-dropdown">
             <button className="dropdown-logout" onClick={onLogout}>
               <LogOut size={16} />
               <span>Log out of Ledger</span>
             </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
