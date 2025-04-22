import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import { FaShieldAlt, FaArrowRight, FaEnvelope } from "react-icons/fa";

function OtpVerifyForgetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");

  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      handleError("Invalid access. Please start again.");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow numbers
    setOtp(value);
  };

  useEffect(() => {
    console.log("Updated OTP:", otp);
  }, [otp]);

  const handleVerify = async () => {
    if (otp === "") {
      handleError('Please enter OTP');
      return;
    }

    try {
      const url = "https://transliterate.onrender.com/api/v1/verify-otp";
      // const url = "http://localhost:4000/api/v1/verify-otp";
      const response = await fetch(url, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp: otp,
          email: email,
        }),
      });

      const result = await response.json();
      if (!response.ok || result.success === false) {
        handleError(result.message || 'Invalid OTP');
      } else {
        handleSuccess("OTP verified! You can now reset your password");
        setTimeout(() => navigate("/reset-password", { state: { email } }), 1000);
      }
    } catch (error) {
      handleError("Error occurred while verifying OTP");
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
            Verify Your Identity
          </h1>
          <p className="text-lg text-purple-200">
            We've sent a verification code to your email
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/10"
        >
          <div className="flex flex-col items-center space-y-6">
            <div className="bg-rose-500/20 p-4 rounded-full">
              <FaEnvelope className="text-rose-400 text-3xl" />
            </div>

            <div className="text-center">
              <p className="text-purple-200 mb-2">Sent to: {email}</p>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-rose-100 mb-2 text-center">
                Enter 6-digit verification code
              </label>
              <input
                type="text"
                value={otp}
                onChange={handleChange}
                maxLength={6}
                placeholder="123456"
                className="w-full px-4 py-3 text-center text-2xl tracking-widest bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent text-white placeholder-purple-200"
              />
            </div>

            <motion.button
              onClick={handleVerify}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-6 bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-600 hover:to-fuchsia-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              Verify & Continue
              <FaArrowRight />
            </motion.button>

            <div className="text-center">
              <p className="text-sm text-purple-200">
                Didn't receive code?{' '}
                <button className="text-rose-300 hover:text-rose-400 font-medium">
                  Resend OTP
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default OtpVerifyForgetPassword;