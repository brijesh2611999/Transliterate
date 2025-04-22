import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils.jsx";
import { Eye, EyeOff } from "lucide-react";
import { FaUserPlus } from "react-icons/fa";

function Signup() {
  const navigate = useNavigate();
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.lastname || !formData.email || !formData.password || !formData.confirmpassword) {
      return handleError("All fields are required");
    } else if (formData.password !== formData.confirmpassword) {
      return handleError("Passwords do not match!");
    }

    try {
      const url = "https://transliterate.onrender.com/api/v1/sendotp";
      // const url = "http://localhost:4000/api/v1/sendotp";
      const response = await fetch(url, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });
      const result = await response.json();
      if (response.ok) {
        handleSuccess('OTP sent to your email successfully');
        setTimeout(() => navigate("/otpverification", { state: { formData } }), 1000);
      } else {
        handleError(result.message || "Signup failed");
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
            Create Account
          </h1>
          <p className="text-lg text-purple-200">Join us today</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/10"
        >
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-rose-100 mb-1">First Name</label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="name"
                  placeholder="First name"
                  value={formData.name}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent text-white placeholder-purple-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-rose-100 mb-1">Last Name</label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="lastname"
                  placeholder="Last name"
                  value={formData.lastname}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent text-white placeholder-purple-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-rose-100 mb-1">Email</label>
              <input
                onChange={handleChange}
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent text-white placeholder-purple-200"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-rose-100 mb-1">Password</label>
              <input
                onChange={handleChange}
                type={showPassword1 ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent text-white placeholder-purple-200 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword1(!showPassword1)}
                className="absolute right-3 top-10 text-purple-300 hover:text-rose-400"
              >
                {showPassword1 ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-rose-100 mb-1">Confirm Password</label>
              <input
                onChange={handleChange}
                type={showPassword2 ? "text" : "password"}
                name="confirmpassword"
                placeholder="••••••••"
                value={formData.confirmpassword}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent text-white placeholder-purple-200 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword2(!showPassword2)}
                className="absolute right-3 top-10 text-purple-300 hover:text-rose-400"
              >
                {showPassword2 ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-6 bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-600 hover:to-fuchsia-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FaUserPlus />
              Sign Up
            </motion.button>

            <div className="mt-6 text-center">
              <p className="text-sm text-purple-200">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-rose-300 hover:text-rose-400">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Signup;