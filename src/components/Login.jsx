import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user", // Default role is 'user'
  });

  const navigate = useNavigate();
  const { email, password, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", formData);

      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Save the token and userId in localStorage
      localStorage.setItem("authToken", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      // console.log(res.data.token);
      // console.log(res.data.user._id);
      // Redirect based on the role
      if (role === "admin") {
        navigate("/users"); // Redirect to admin dashboard
      } else {
        navigate("/dashboard"); // Redirect to user dashboard
      }
    } catch (err) {
      toast.error(`Login failed: ${err.response?.data?.msg || err.message}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-r from-teal-400 via-blue-500 to-green-500">
      <div className="flex flex-col mt-20 md:flex-row bg-white shadow-xl rounded-lg max-w-lg md:max-w-4xl w-full">
        <div className="flex flex-col justify-center items-center p-8 w-full">
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Login</h2>

          <form
            className="flex flex-col justify-center items-center w-full"
            onSubmit={onSubmit}
            autoComplete="off"
          >
            <input
              className="w-full max-w-xs outline-none mt-3 border border-teal-300 p-2 rounded hover:border-teal-500 focus:ring focus:ring-teal-200"
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={onChange}
              autoComplete="off"
              required
            />

            <input
              className="w-full max-w-xs outline-none mt-3 border border-teal-300 p-2 rounded hover:border-teal-500 focus:ring focus:ring-teal-200"
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
              autoComplete="off"
              required
            />

            {/* Role Selection */}
            <div className="mt-3">
              <label className="text-gray-600">Select Role:</label>
              <select
                className="w-full max-w-xs outline-none mt-2 border border-teal-300 p-2 rounded hover:border-teal-500 focus:ring focus:ring-teal-200"
                name="role"
                value={role}
                onChange={onChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-green-500 text-white font-bold cursor-pointer mt-3 p-2 w-full max-w-xs rounded transition duration-300 ease-in-out hover:bg-teal-500"
            >
              Login
            </button>
          </form>

          <h3 className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/" className="text-bold text-blue-600 cursor-pointer px-2 hover:text-teal-500">
              Sign Up
            </Link>
          </h3>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
