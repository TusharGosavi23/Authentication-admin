import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile_number: "",
    role: "user", // Default role set to "user"
  });

  const navigate = useNavigate();

  const { name, email, password, mobile_number, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      mobile_number: Number(formData.mobile_number),
    };
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/signup",
        updatedFormData
      );

      toast.success("Signup successful! Redirecting to login...", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      localStorage.setItem("authToken", res.data.token);

      // Redirect based on user role
      if (role === "admin") {
        navigate("/admin"); // Redirect to admin dashboard
      } else {
        navigate("/user"); // Redirect to user dashboard
      }

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      toast.error(`Signup failed: ${err.response.data.msg}`, {
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
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Sign Up</h2>

          <form
            className="flex flex-col justify-center items-center w-full"
            onSubmit={onSubmit}
            autoComplete="off"
          >
            <input
              className="w-full max-w-xs outline-none mt-3 border border-teal-300 p-2 rounded hover:border-teal-500 focus:ring focus:ring-teal-200"
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={onChange}
              autoComplete="off"
              required
            />

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

            <input
              className="w-full max-w-xs outline-none mt-3 border border-teal-300 p-2 rounded hover:border-teal-500 focus:ring focus:ring-teal-200"
              type="text"
              maxLength={10}
              placeholder="Mobile number"
              name="mobile_number"
              value={mobile_number}
              onChange={onChange}
              autoComplete="off"
              required
            />

            <select
              className="w-full max-w-xs outline-none mt-3 border border-teal-300 p-2 rounded hover:border-teal-500 focus:ring focus:ring-teal-200"
              name="role"
              value={role}
              onChange={onChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-green-500 text-white font-bold cursor-pointer mt-3 p-2 w-full max-w-xs rounded transition duration-300 ease-in-out hover:bg-teal-500"
            >
              Sign Up
            </button>
          </form>

          <h3 className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-bold text-blue-600 cursor-pointer px-2 hover:text-teal-500">
              Login
            </Link>
          </h3>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
