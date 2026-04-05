import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ onLogout, user }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        user={user}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />
      <div className="app-main pt-20 md:pt-0">
        <Navbar user={user} onLogout={onLogout} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
