import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  // const storedUser = JSON.parse(localStorage.getItem("user"));
  // const token = storedUser.token;
  const token = localStorage.getItem("token");
  

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {
        const url = "https://transliterate.onrender.com/api/v1/protected";
        // const url = "http://localhost:4000/api/v1/protected";
        const res = await fetch(url, {
        method: "GET",
        credentials: 'include',//required
          headers: {
            Authorization: `Bearer ${token}`,
          },
        //   body: JSON.stringify(token),
        });
        console.log(res);
        setIsAuthorized(res.ok); // true if 200, false otherwise
      } catch (error) {
        console.error("Verification failed during Token:", error);
        setIsAuthorized(false);
      }
    };

    verifyToken();
  }, [token]);

  // Wait until the auth check finishes
  if (isAuthorized === null) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-600">
        Loading...
      </div>
    );
  }

  // If not logged in or token invalid
  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  // If authorized, show protected content
  return children;
};

export default ProtectedRoute;
