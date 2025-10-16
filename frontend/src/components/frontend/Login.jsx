import React, { useState } from "react";
import {
  FaGoogle,
  FaFacebook,
  FaEnvelope,
  FaLock,
  FaUser,
} from "react-icons/fa";
import Loader from "../frontend/Loader"; // ✅ Import Loader

const Login = ({ setShowLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ Loader state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // show loader
    setTimeout(() => {
      setLoading(false); // stop loader
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          alert("❌ Passwords do not match!");
          return;
        }
        console.log("Sign Up Data:", formData);
        alert("Account created successfully 🎉");
      } else {
        console.log("Login Data:", formData);
        alert("Login successful ✅");
      }
    }, 1500); // simulate network delay
  };

  const handleBackdropClick = (e) => {
    if (e.target.id === "loginModal") setShowLogin(false);
  };

  return (
    <div
      id="loginModal"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 text-sm text-gray-600"
    >
      <div className="bg-white text-gray-600 w-full max-w-md mx-4 md:p-6 p-5 rounded-2xl shadow-lg relative">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          {isSignUp ? "Create an Account ✨" : "Welcome Back 👋"}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="relative">
              <FaUser className="absolute left-4 top-3.5 text-gray-400" />
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full outline-none focus:border-indigo-500 transition"
              />
            </div>
          )}

          <div className="relative">
            <FaEnvelope className="absolute left-4 top-3.5 text-gray-400" />
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-3.5 text-gray-400" />
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full outline-none focus:border-indigo-500 transition"
            />
          </div>

          {isSignUp && (
            <div className="relative">
              <FaLock className="absolute left-4 top-3.5 text-gray-400" />
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full outline-none focus:border-indigo-500 transition"
              />
            </div>
          )}

          {!isSignUp && (
            <div className="text-right">
              <a href="#" className="text-indigo-600 hover:underline text-sm">
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 ${
              loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
            } transition py-2.5 rounded-full text-white font-medium cursor-pointer`}
          >
            {loading ? (
              <Loader size={20} inline color="white" />
            ) : isSignUp ? (
              "Sign Up"
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {/* Switch Mode */}
        <p className="text-center mt-4 text-gray-700">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setIsSignUp(false)}
                className="text-indigo-600 font-medium hover:underline cursor-pointer"
              >
                Log in
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span
                onClick={() => setIsSignUp(true)}
                className="text-indigo-600 font-medium hover:underline cursor-pointer"
              >
                Sign up
              </span>
            </>
          )}
        </p>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Social Logins */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-full text-gray-800 hover:bg-gray-100 transition cursor-pointer"
          >
            <FaGoogle className="text-red-500 text-lg" />
            Continue with Google
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-full text-gray-800 hover:bg-gray-100 transition cursor-pointer"
          >
            <FaFacebook className="text-blue-600 text-lg" />
            Continue with Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
