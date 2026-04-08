import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Lock, WalletCards } from "lucide-react";
import { getApiError, resetPassword } from "../lib/api";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const token = searchParams.get("token") || "";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is invalid.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await resetPassword({ token, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (submitError) {
      setError(getApiError(submitError, "Unable to reset password"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50"
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-8 py-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 right-2 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-2 left-2 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>

            <div className="relative text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md mx-auto mb-4">
                <WalletCards size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Reset Password</h1>
              <p className="text-white/80 mt-2 text-sm">Choose a new secure password for your account</p>
            </div>
          </div>

          <div className="p-8">
            {success ? (
              <div className="text-center space-y-4">
                <CheckCircle2 size={48} className="text-green-500 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900">Password updated</h3>
                <p className="text-slate-600">Redirecting you to sign in...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back to login
                </Link>

                <label className="block">
                  <span className="block text-sm font-semibold text-slate-700 mb-2">New Password</span>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter new password"
                      className="w-full pl-12 pr-12 py-3 bg-slate-100 border border-slate-300 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-slate-900 placeholder-slate-500"
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
                </label>

                <label className="block">
                  <span className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</span>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Confirm new password"
                      className="w-full pl-12 pr-12 py-3 bg-slate-100 border border-slate-300 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-slate-900 placeholder-slate-500"
                      required
                    />
                    <button
                      className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                      type="button"
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      onClick={() => setShowConfirmPassword((current) => !current)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>

                {error ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                    {error}
                  </div>
                ) : null}

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                  type="submit"
                  disabled={submitting || !token}
                >
                  {submitting ? "Updating..." : "Set New Password"}
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ResetPassword;
