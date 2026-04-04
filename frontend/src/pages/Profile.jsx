import { useState } from "react";
import { motion } from "framer-motion";
import { User, Shield, Mail, Lock, CheckCircle2 } from "lucide-react";
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

function Profile({ user, onUserChange }) {
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
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
      className="p-6 lg:p-10 bg-slate-900 min-h-screen w-full font-sans text-slate-200"
    >
      {/* Header Section */}
      <MotionDiv variants={itemVars} className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-100">
          Profile Settings
        </h1>
        <p className="text-slate-500 mt-2">
          Update your personal details and keep your account secure.
        </p>
      </MotionDiv>

      {/* Error Message */}
      {error && (
        <MotionDiv
          variants={itemVars}
          className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
        >
          {error}
        </MotionDiv>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Personal Information Card */}
          <MotionDiv
            variants={itemVars}
            className="bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-700 hover:shadow-xl hover:border-slate-600 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <User size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-100">Personal Information</h2>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm((current) => ({ ...current, name: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-slate-500" size={18} />
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm((current) => ({ ...current, email: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-colors"
              >
                Save Profile
              </motion.button>
            </form>
          </MotionDiv>

          {/* Account Security Card */}
          <MotionDiv
            variants={itemVars}
            className="bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-700 hover:shadow-xl hover:border-slate-600 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
                <Shield size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-100">Account Security</h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-slate-500" size={18} />
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm((current) => ({ ...current, currentPassword: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-slate-500" size={18} />
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm((current) => ({ ...current, newPassword: e.target.value }))}
                      placeholder="••••••••"
                      minLength={8}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-colors border border-slate-600"
              >
                Update Password
              </motion.button>
            </form>
          </MotionDiv>
        </div>

        {/* Right Column: User ID Card */}
        <MotionDiv
          variants={itemVars}
          className="bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-700 flex flex-col items-center text-center h-fit hover:shadow-xl hover:border-slate-600 transition-all duration-300"
        >
          {/* Avatar Ring */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-4 border-slate-800 shadow-xl flex items-center justify-center overflow-hidden">
              <User size={48} className="text-slate-400" />
            </div>
            <div className="absolute bottom-0 right-0 p-1.5 bg-emerald-500 rounded-full border-2 border-slate-800">
              <CheckCircle2 size={12} className="text-white" />
            </div>
          </div>

          {/* Status Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold tracking-wide uppercase mb-4 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Active Account
          </span>

          <h3 className="text-2xl font-bold text-slate-100">{user?.name || "User"}</h3>
          <p className="text-slate-400 mt-2">{user?.email || "No email available"}</p>
          
          <hr className="w-full border-slate-700 my-6" />
          
          <div className="w-full text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Member Since</span>
              <span className="text-slate-300 font-medium">April 2024</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Account Status</span>
              <span className="text-emerald-400 font-medium">Verified</span>
            </div>
          </div>
        </MotionDiv>

      </div>
    </MotionDiv>
  );
}

export default Profile;
