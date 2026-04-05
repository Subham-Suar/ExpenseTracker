import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Expense from "./pages/Expense";
import Income from "./pages/Income";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import { clearSession, loadSession, saveSession } from "./lib/session";
import { getApiError, getCurrentUser } from "./lib/api";
 //function
function App() {
  const [session, setSession] = useState(() => loadSession());
  const [bootstrapping, setBootstrapping] = useState(Boolean(loadSession().token));
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    async function hydrateUser() {
      if (!session.token) {
        setBootstrapping(false);
        return;
      }

      try {
        const response = await getCurrentUser();

        if (!ignore) {
          const nextSession = { token: session.token, user: response.user };
          setSession(nextSession);
          saveSession(nextSession);
        }
      } catch (error) {
        if (!ignore) {
          console.error(getApiError(error, "Session expired"));
          clearSession();
          setSession({ token: null, user: null });
        }
      } finally {
        if (!ignore) {
          setBootstrapping(false);
        }
      }
    }

    hydrateUser();

    return () => {
      ignore = true;
    };
  }, [session.token]);

  const handleAuthSuccess = (nextSession) => {
    setSession(nextSession);
    saveSession(nextSession);
  };

  const handleSessionUserChange = (nextUser) => {
    const nextSession = { token: session.token, user: nextUser };
    setSession(nextSession);
    saveSession(nextSession);
  };

  const handleLogout = () => {
    clearSession();
    setSession({ token: null, user: null });
    navigate("/login");
  };

  if (bootstrapping) {
    return <div className="boot-screen">Loading your workspace...</div>;
  }

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            session.token ? (
              <Navigate to="/" replace />
            ) : (
              <Auth mode="login" onAuthSuccess={handleAuthSuccess} />
            )
          }
        />
        <Route
          path="/register"
          element={
            session.token ? (
              <Navigate to="/" replace />
            ) : (
              <Auth mode="register" onAuthSuccess={handleAuthSuccess} />
            )
          }
        />
        <Route element={<ProtectedRoute isAuthenticated={Boolean(session.token)} />}>
          <Route element={<Layout user={session.user} onLogout={handleLogout} />}>
            <Route path="/" element={<Dashboard user={session.user} />} />
            <Route path="/income" element={<Income />} />
            <Route path="/expense" element={<Expense />} />
            <Route
              path="/profile"
              element={<Profile user={session.user} onUserChange={handleSessionUserChange} />}
            />
          </Route>
        </Route>
        <Route
          path="*"
          element={<Navigate to={session.token ? "/" : "/login"} replace />}
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
