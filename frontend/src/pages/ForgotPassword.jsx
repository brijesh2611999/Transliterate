import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import { FaEnvelope, FaArrowRight } from "react-icons/fa";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email) {
      setIsLoading(false);
      return handleError("Please enter your email");
    }

    try {
    //   const url = "https://algorithm-visualizer-amx3.onrender.com/api/v1/verify-email";
      const url = "http://localhost:4000/api/v1/verify-email";
      const res = await fetch(url, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();
      if (res.ok || result.success === true) {
        handleSuccess("Email found. Redirecting to OTP verification...");
        setTimeout(() => navigate("/otp-verify-forget-password", { state: { email } }), 1000);
      } else {
        handleError("Email not found. Please sign up");
        setTimeout(() => navigate("/signup"), 1500);
      }
    } catch (error) {
      handleError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
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
            Forgot Password
          </h1>
          <p className="text-lg text-purple-200">
            Enter your email to reset your password
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/10"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-rose-500/20 p-4 rounded-full">
              <FaEnvelope className="text-rose-400 text-3xl" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-rose-100 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent text-white placeholder-purple-200"
                required
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className={`w-full py-3 px-6 bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-600 hover:to-fuchsia-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${isLoading ? 'opacity-75' : ''}`}
            >
              {isLoading ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  Continue
                  <FaArrowRight />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-purple-200">
              Remember your password?{" "}
              <a 
                href="/login" 
                className="font-medium text-rose-300 hover:text-rose-400"
              >
                Login
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ForgotPassword;