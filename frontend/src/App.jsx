import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx'; 
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Header from './components/Header.jsx'
import OtpVerification from './pages/OtpVerification.jsx';
import OtpVerifyForgetPassword from './pages/OtpVerifyForgetPassword.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import ProtectedRoute from './utils/ProtectedRoute.jsx'
import Transliterate from './pages/Transliterate.jsx';


function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/otpverification" element={<OtpVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/otp-verify-forget-password" element={<OtpVerifyForgetPassword />} />
        {/* <Route path="/universe" element={<UniversePage />} /> */}
        
        {/* <ProtectedRoute>
            <Output/>
        </ProtectedRoute> */}
        <Route path="/transliterate" element={
          <ProtectedRoute>
            <Transliterate />
          </ProtectedRoute>
        } />

      </Routes>
      <ToastContainer /> 
      {/* <Footer/> */}
    </BrowserRouter>
  );
}

export default App;
