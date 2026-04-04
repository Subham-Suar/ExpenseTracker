import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircleUserRound,
  Eye,
  EyeOff,
  Lock,
  Mail,
  UserRound,
  WalletCards,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { getApiError, loginUser, registerUser } from "../lib/api";

const MotionDiv = motion.div;

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.08, duration: 0.5 },
  }),
};

function Auth({ mode, onAuthSuccess }) {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetSubmitting, setResetSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = isLogin
        ? await loginUser({ email: form.email, password: form.password })
        : await registerUser(form);

      onAuthSuccess({ token: response.token, user: response.user });

      const nextPath = location.state?.from?.pathname || "/";
      navigate(nextPath, { replace: true });
    } catch (submitError) {
      setError(getApiError(submitError, "Authentication failed"));
    } finally {
      setSubmitting(false);
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetSubmitting(true);
    
    // Simulate password reset request
    setTimeout(() => {
      setResetSent(true);
      setResetSubmitting(false);
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetSent(false);
        setForgotEmail("");
      }, 3000);
    }, 1000);
  };

  const isPasswordError = error && error.toLowerCase().includes("password");

  const authContent = (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>

      <MotionDiv
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        {/* Main Auth Card */}
        <motion.div
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50"
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          transition={{ duration: 0.3 }}
        >
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-8 py-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 right-2 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-2 left-2 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>
            
            <motion.div
              custom={0}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="relative text-center"
            >
              <motion.div
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md mx-auto mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {isLogin ? (
                  <CircleUserRound size={32} className="text-white" />
                ) : (
                  <WalletCards size={32} className="text-white" />
                )}
              </motion.div>
              <h1 className="text-3xl font-bold tracking-tight">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-white/80 mt-2 text-sm">
                {isLogin
                  ? "Sign in to your ExpenseTracker account"
                  : "Join your financial journey with us"}
              </p>
            </motion.div>
          </div>

          {/* Form Section */}
          <form className="p-8 space-y-5" onSubmit={handleSubmit}>
            {!isLogin ? (
              <motion.label
                custom={1}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="auth-field-modern"
              >
                <span className="block text-sm font-semibold text-slate-700 mb-2">Full Name</span>
                <div className="relative">
                  <UserRound className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, name: event.target.value }))
                    }
                    placeholder="Your full name"
                    className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-300 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-slate-900 placeholder-slate-500"
                    required
                  />
                </div>
              </motion.label>
            ) : null}

            <motion.label
              custom={2}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="auth-field-modern"
            >
              <span className="block text-sm font-semibold text-slate-700 mb-2">Email Address</span>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  type="email"
                  placeholder="your@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-300 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-slate-900 placeholder-slate-500"
                  required
                />
              </div>
            </motion.label>

            <motion.label
              custom={3}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="auth-field-modern"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="block text-sm font-semibold text-slate-700">Password</span>
                {isLogin && isPasswordError && (
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  value={form.password}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, password: event.target.value }))
                  }
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-3 bg-slate-100 border rounded-xl focus:outline-none focus:ring-2 transition-all text-slate-900 placeholder-slate-500 ${
                    isPasswordError
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-300 focus:border-teal-500 focus:ring-teal-500/20"
                  }`}
                  required
                />
                <button
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.label>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium flex items-start gap-3"
              >
                <span className="text-lg mt-0.5">⚠️</span>
                <span>{error}</span>
              </motion.div>
            )}

            <motion.button
              custom={4}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 mt-6"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
            </motion.button>

            <motion.p
              custom={6}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="text-center text-sm text-slate-600 mt-6"
            >
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <Link
                to={isLogin ? "/register" : "/login"}
                className="font-bold text-teal-600 hover:text-teal-700 transition-colors"
              >
                {isLogin ? "Create One" : "Sign in"}
              </Link>
            </motion.p>
          </form>
        </motion.div>
      </MotionDiv>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => !resetSent && setShowForgotPassword(false)}
          >
            <MotionDiv
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8"
            >
              {resetSent ? (
                <div className="text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle2 size={48} className="text-green-500 mx-auto" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-900">Check Your Email</h3>
                  <p className="text-slate-600">
                    We've sent a password reset link to <strong>{forgotEmail}</strong>
                  </p>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <h3 className="text-xl font-bold text-slate-900">Reset Password</h3>
                  </div>

                  <p className="text-sm text-slate-600">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="your@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                        required
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    type="submit"
                    disabled={resetSubmitting || !forgotEmail}
                    className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-60 transition-all"
                  >
                    {resetSubmitting ? "Sending..." : "Send Reset Link"}
                  </motion.button>
                </form>
              )}
            </MotionDiv>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return authContent;
}

export default Auth;
