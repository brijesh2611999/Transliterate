import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import { Eye, EyeOff } from "lucide-react";
import { FaKey, FaArrowRight } from "react-icons/fa";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      handleError("Invalid access. Please start again.");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      return handleError("All fields are required");
    }

    if (formData.password !== formData.confirmPassword) {
      return handleError("Passwords do not match");
    }

    try {
      const url = "https://transliterate.onrender.com/api/v1/reset-password";
      // const url = "http://localhost:4000/api/v1/reset-password";
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          newPassword: formData.password,
        }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        handleSuccess("Password updated successfully!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        handleError(result.message || "Something went wrong");
      }
    } catch (error) {
      handleError("Network error or server is down");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white pt-24 pb-12 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-400 mb-2">
            Reset Password
          </h1>
          <p className="text-lg text-purple-200">
            Create a new password for your account
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/10"
        >
          <form onSubmit={handleReset} className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="bg-rose-500/20 p-4 rounded-full">
                <FaKey className="text-rose-400 text-3xl" />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-rose-100 mb-1">
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent text-white placeholder-purple-200 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-purple-300 hover:text-rose-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-rose-100 mb-1">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent text-white placeholder-purple-200 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-10 text-purple-300 hover:text-rose-400"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-6 bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-600 hover:to-fuchsia-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              Reset Password
              <FaArrowRight />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default ResetPassword;