import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

//Layout ----
function Layout({ onLogout, user }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFoldTablet, setIsFoldTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsFoldTablet(width > 640 && width <= 900);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? 80 : 256;
  const navbarHeight = isFoldTablet ? 118 : 64;

  return (
    <div className="app-shell flex min-h-screen flex-col bg-[#121c31]">
      {/* Fixed Navbar at top */}
      <Navbar
        user={user}
        onLogout={onLogout}
        onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)}
        sidebarWidth={sidebarWidth}
        isMobile={isMobile}
        isFoldTablet={isFoldTablet}
      />
      
      {/* Main content area with sidebar */}
      <div className="flex flex-1" style={{ paddingTop: `${navbarHeight}px` }}>
        <Sidebar
          user={user}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />
        <main
          className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto bg-[#121c31]"
          style={{
            marginLeft: isMobile ? 0 : sidebarWidth,
            transition: "margin-left 0.3s ease",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
