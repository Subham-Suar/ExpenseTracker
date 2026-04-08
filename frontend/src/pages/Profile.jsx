import { useState } from "react";
import { motion } from "framer-motion";
import { User, Shield, Mail, Lock, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { getApiError, updatePassword, updateProfile } from "../lib/api";

const MotionDiv = motion.div;

// Smooth animation variants
const containerVars = {
  hidden: { opacity: 0, y: 55, scale: 0.88, rotateX: 25 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { 
      staggerChildren: 0.16, 
      delayChildren: 0.45,
      type: "spring",
      stiffness: 95,
      damping: 21,
      mass: 1.3
    } 
  },
};

const itemVars = {
  hidden: { y: 30, opacity: 0, scale: 0.92, rotateY: 12 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    rotateY: 0,
    transition: { 
      type: "spring", 
      stiffness: 135, 
      damping: 23,
      mass: 0.85,
      bounce: 0.45
    } 
  },
};

const formCardHover = {
  y: -10,
  scale: 1.01,
  transition: { type: "spring", stiffness: 260, damping: 22 },
};

const profileCardHover = {
  y: -12,
  rotateX: -4,
  scale: 1.015,
  transition: { type: "spring", stiffness: 240, damping: 20 },
};

const iconBadgeHover = {
  scale: 1.08,
  rotate: -6,
  transition: { type: "spring", stiffness: 320, damping: 16 },
};

const buttonHover = {
  y: -3,
  scale: 1.02,
  transition: { type: "spring", stiffness: 320, damping: 18 },
};

function Profile({ user, onUserChange }) {
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState("");

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await updateProfile(profileForm);
      onUserChange(response.user);
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } catch (submitError) {
      const errorMsg = getApiError(submitError, "Unable to update profile");
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await updatePassword(passwordForm);
      setPasswordForm({ currentPassword: "", newPassword: "" });
      toast.success(response.message || "Password updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } catch (submitError) {
      const errorMsg = getApiError(submitError, "Unable to update password");
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  }

  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      variants={containerVars}
      className="p-4 xs:p-6 sm:p-8 lg:p-10 bg-slate-900 min-h-screen w-full font-sans text-slate-200 space-y-6 xs:space-y-8"
    >
      {/* Header Section */}
      <MotionDiv variants={itemVars} className="mb-4 xs:mb-6 sm:mb-8">
        <motion.h1
          animate={{ backgroundPositionX: ["0%", "100%", "0%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: "200% 100%" }}
          className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-100 leading-tight bg-gradient-to-r from-slate-100 via-white to-slate-300 bg-clip-text text-transparent"
        >
          Profile Settings
        </motion.h1>
        <p className="text-xs xs:text-sm text-slate-500 mt-2 leading-relaxed">
          Update your personal details and keep your account secure.
        </p>
      </MotionDiv>

      {/* Error Message */}
      {error && (
        <MotionDiv
          variants={itemVars}
          className="mb-4 xs:mb-6 p-3 xs:p-4 sm:p-5 bg-red-500/10 border border-red-500/30 rounded-lg xs:rounded-xl text-red-400 text-xs xs:text-sm"
        >
          {error}
        </MotionDiv>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 lg:gap-8">
        
        {/* Left Column: Forms */}
        <div className="lg:col-span-2 space-y-4 xs:space-y-5 sm:space-y-6 lg:space-y-8">
          
          {/* Personal Information Card */}
          <MotionDiv
            variants={itemVars}
            whileHover={formCardHover}
          className="interactive-card relative bg-slate-800/95 p-4 xs:p-5 sm:p-6 lg:p-8 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-md lg:shadow-lg border border-slate-700 hover:shadow-lg lg:hover:shadow-xl hover:border-slate-600 transition-all duration-300 overflow-hidden"
          >
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 right-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl"
              animate={{ scale: [1, 1.18, 1], opacity: [0.18, 0.32, 0.18] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 mb-4 xs:mb-5 sm:mb-6 lg:mb-8">
              <motion.div whileHover={iconBadgeHover} className="p-1.5 xs:p-2 sm:p-2.5 bg-emerald-500/10 rounded-lg xs:rounded-xl text-emerald-400 flex-shrink-0">
                <User size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
              </motion.div>
              <h2 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold text-slate-100 leading-tight">Personal Information</h2>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4 xs:space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4 sm:gap-5 lg:gap-6">
                <div className="space-y-1.5 xs:space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm((current) => ({ ...current, name: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg xs:rounded-xl px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5 xs:space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block">
                    Email Address
                  </label>
                  <div className="relative min-w-0">
                    <Mail className="absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 text-slate-500 flex-shrink-0 xs:w-4 xs:h-4 sm:w-5 sm:h-5" size={14} />
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm((current) => ({ ...current, email: e.target.value }))}
                      className="w-full min-w-0 bg-slate-900 border border-slate-700 rounded-lg xs:rounded-xl pl-8 xs:pl-10 sm:pl-11 pr-3 xs:pr-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={buttonHover}
                whileTap={{ scale: 0.98 }}
                className="interactive-button relative bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 xs:py-2.5 sm:py-3 px-4 xs:px-5 sm:px-6 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-md transition-colors text-sm xs:text-base w-full md:w-auto md:min-w-[180px] overflow-hidden"
              >
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-y-0 -left-1/3 w-1/3 bg-white/20 blur-xl"
                  animate={{ x: ["-10%", "260%"] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 }}
                />
                <span className="relative z-10">Save Profile</span>
              </motion.button>
            </form>
          </MotionDiv>

          {/* Account Security Card */}
          <MotionDiv
            variants={itemVars}
            whileHover={formCardHover}
          className="interactive-card relative bg-slate-800/95 p-4 xs:p-5 sm:p-6 lg:p-8 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-md lg:shadow-lg border border-slate-700 hover:shadow-lg lg:hover:shadow-xl hover:border-slate-600 transition-all duration-300 overflow-hidden"
          >
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -top-20 left-12 h-36 w-36 rounded-full bg-sky-400/10 blur-3xl"
              animate={{ scale: [1, 1.14, 1], opacity: [0.16, 0.3, 0.16] }}
              transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 mb-4 xs:mb-5 sm:mb-6 lg:mb-8">
              <motion.div whileHover={iconBadgeHover} className="p-1.5 xs:p-2 sm:p-2.5 bg-sky-500/10 rounded-lg xs:rounded-xl text-sky-400 flex-shrink-0">
                <Shield size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
              </motion.div>
              <h2 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold text-slate-100 leading-tight">Account Security</h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 xs:space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4 sm:gap-5 lg:gap-6">
                <div className="space-y-1.5 xs:space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block">
                    Current Password
                  </label>
                  <div className="relative min-w-0">
                    <Lock className="absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 text-slate-500 flex-shrink-0 xs:w-4 xs:h-4 sm:w-5 sm:h-5" size={14} />
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm((current) => ({ ...current, currentPassword: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full min-w-0 bg-slate-900 border border-slate-700 rounded-lg xs:rounded-xl pl-8 xs:pl-10 sm:pl-11 pr-10 xs:pr-11 sm:pr-12 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((current) => !current)}
                      className="absolute right-3 xs:right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5 xs:space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block">
                    New Password
                  </label>
                  <div className="relative min-w-0">
                    <Lock className="absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 text-slate-500 flex-shrink-0 xs:w-4 xs:h-4 sm:w-5 sm:h-5" size={14} />
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm((current) => ({ ...current, newPassword: e.target.value }))}
                      placeholder="••••••••"
                      minLength={8}
                      className="w-full min-w-0 bg-slate-900 border border-slate-700 rounded-lg xs:rounded-xl pl-8 xs:pl-10 sm:pl-11 pr-3 xs:pr-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="interactive-button bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 xs:py-2.5 sm:py-3 px-4 xs:px-5 sm:px-6 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-md transition-colors border border-slate-600 text-sm xs:text-base w-full md:w-auto md:min-w-[180px] overflow-hidden"
              >
                Update Password
              </motion.button>
            </form>
          </MotionDiv>
        </div>

        {/* Right Column: User ID Card */}
        <MotionDiv
          variants={itemVars}
          className="interactive-card bg-slate-800/95 p-4 xs:p-5 sm:p-6 lg:p-8 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-md lg:shadow-lg border border-slate-700 flex flex-col items-center text-center min-h-fit hover:shadow-lg lg:hover:shadow-xl hover:border-slate-600 transition-all duration-300 overflow-hidden"
        >
          {/* Avatar Ring */}
          <div className="relative mb-4 xs:mb-5 sm:mb-6 lg:mb-8">
            <div className="w-20 xs:w-24 sm:w-28 lg:w-32 h-20 xs:h-24 sm:h-28 lg:h-32 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-4 xs:border-4 sm:border-4 border-slate-800 shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              <User size={36} className="xs:w-10 xs:h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-slate-400" />
            </div>
            <div className="absolute bottom-0 right-0 p-1 xs:p-1.5 bg-emerald-500 rounded-full border-2 border-slate-800">
              <CheckCircle2 size={10} className="xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-white" />
            </div>
          </div>

          {/* Status Badge */}
          <span className="inline-flex items-center gap-1 xs:gap-1.5 px-2 xs:px-2.5 sm:px-3 py-1 xs:py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold tracking-wide uppercase mb-3 xs:mb-4 border border-emerald-500/20 flex-shrink-0">
            <span className="w-1 xs:w-1.5 h-1 xs:h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Active Account
          </span>

          <h3 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-slate-100 truncate break-words px-2">{user?.name || "User"}</h3>
          <p className="text-xs xs:text-sm text-slate-400 mt-1 xs:mt-2 truncate break-words px-2">{user?.email || "No email available"}</p>
          
          <hr className="w-full border-slate-700 my-4 xs:my-5 sm:my-6 lg:my-8" />
          
          <div className="w-full text-left space-y-2 xs:space-y-2.5 sm:space-y-3 px-2">
            <div className="flex justify-between text-xs xs:text-sm gap-2">
              <span className="text-slate-500 whitespace-nowrap">Member Since</span>
              <span className="text-slate-300 font-medium text-right">April 2024</span>
            </div>
            <div className="flex justify-between text-xs xs:text-sm gap-2">
              <span className="text-slate-500 whitespace-nowrap">Account Status</span>
              <span className="text-emerald-400 font-medium text-right">Verified</span>
            </div>
          </div>
        </MotionDiv>

      </div>
    </MotionDiv>
  );
}

export default Profile;
