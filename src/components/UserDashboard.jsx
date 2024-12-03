import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // useNavigate instead of useHistory

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // useNavigate hook

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("authToken");
        console.log("Token from localStorage:", token);
        if (!token) {
          console.error("No token found, redirecting to login");
          navigate("/login"); // Redirect to login if not authenticated
          return;
        }

        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("User data fetched:", res.data);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user data:", err.response?.data || err.message);
        navigate("/login"); // Redirect to login on error
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);  // Ensure navigate is included as a dependency

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem("authToken");
    // Redirect to login page
    navigate("/login");
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-xl text-gray-500">Loading...</div>;
  if (!user) return <div className="flex justify-center items-center h-screen text-xl text-gray-500">User not found. Please login again.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-12 px-6 sm:px-12">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full sm:w-96">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Welcome, {user.name}!</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Email:</span>
            <span className="text-gray-800">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Mobile:</span>
            <span className="text-gray-800">{user.mobile_number}</span>
          </div>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
