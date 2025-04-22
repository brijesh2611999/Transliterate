import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Header = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("username");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {
        const url = "http://localhost:4000/api/v1/protected";
        // const url = "https://algorithm-visualizer-amx3.onrender.com/api/v1/protected";
        const res = await fetch(url, {
          method: "GET",
          // credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsAuthorized(res.ok);
      } catch (error) {
        console.error("Verification failed:", error);
        setIsAuthorized(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    // localStorage.removeItem("username");
    setIsAuthorized(false);
    navigate("/login");
  };

  return (
    <motion.header 
      transition={{ type: 'spring', stiffness: 300 }}
      className="relative w-full z-50 bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-600 transition-all duration-500 ease-in-out"
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
          <Link 
            to="/home" 
            className="text-xl font-bold text-white"
          >
            Transliteration
          </Link>
        </motion.div>

        <nav className="hidden md:flex items-center gap-8">
          {['Home', 'About', 'Contact'].map((item) => (
            <motion.div 
              key={item} 
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to={`/${item.toLowerCase()}`} 
                className="font-medium text-white hover:text-amber-100"
              >
                {item}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {!isAuthorized ? (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login">
                  <button className="px-4 py-2 rounded-lg font-medium bg-white text-rose-600 hover:bg-amber-50">
                    Login
                  </button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/signup">
                  <button className="px-4 py-2 rounded-lg font-medium bg-amber-600 text-white hover:bg-amber-700">
                    Sign Up
                  </button>
                </Link>
              </motion.div>
            </>
          ) : (
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="font-medium text-white">
                🧑‍💻 {name}
              </span>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg font-medium bg-rose-500 text-white hover:bg-rose-600"
              >
                Logout
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
