import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6  shadow-inner w-full">
      <div className="w-full mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        
        {/* Left Section - Brand */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-semibold">Transliteration English To Hindi</h2>
          <p className="text-sm mt-1">© {new Date().getFullYear()} All Rights Reserved</p>
        </div>

        {/* Middle Section - Navigation Links */}
        <nav className="my-4 md:my-0">
          <ul className="flex space-x-6 text-sm">
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Terms of Service</a></li>
            <li><a href="#" className="hover:underline">Support</a></li>
          </ul>
        </nav>

        {/* Right Section - Social Media */}
        <div className="flex space-x-4">
          <a href="#" className="hover:text-gray-400 transition"><FaFacebook size={20} /></a>
          <a href="#" className="hover:text-gray-400 transition"><FaTwitter size={20} /></a>
          <a href="#" className="hover:text-gray-400 transition"><FaInstagram size={20} /></a>
          <a href="https://www.linkedin.com/in/brijeshverma086/" className="hover:text-gray-400 transition"><FaLinkedin size={20} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
