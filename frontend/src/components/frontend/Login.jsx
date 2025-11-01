import React, { useState } from "react";
import {
  FaGoogle,
  FaFacebook,
  FaEnvelope,
  FaLock,
  FaUser,
} from "react-icons/fa";
import Loader from "../frontend/Loader";
import SocialLoginButton from "./SocialLoginButton";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Swal from "sweetalert2";

const Login = ({ setShowLogin }) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (isSignUp) {
        res = await axios.post("/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
        });
        Swal.fire(
          "Account Created!",
          "Registration successful! Please check your email and verify your account before logged in!",
          "success"
        );

        setIsSignUp(false);
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        res = await axios.post("/login", {
          email: formData.email,
          password: formData.password,
        });

        const user = res.data.user;

        if (!user.email_verified_at) {
          Swal.fire(
            "Email Not Verified!",
            "Please verify your email first.We have sent the verification link to your email",
            "warning"
          );
          return;
        }

        Swal.fire("Success", "Login successfully!", "success");
        navigate("/");
      }

      if (res?.data?.token) {
        localStorage.setItem("auth_token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.message || "Error!", "error");
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    try {
      await axios.post("/email/verification-notification");
      Swal.fire(
        "Verification Sent!",
        "Email verification link has been resent to your email",
        "success"
      );
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Could not send email!",
        "error"
      );
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target.id === "loginModal") setShowLogin(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4">
      <div className="bg-white w-full max-w-md p-10 rounded-3xl shadow-2xl relative">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div className="relative">
              <FaUser className="absolute left-3 top-3.5 text-gray-400" />
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          )}

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {isSignUp && (
            <div className="relative">
              <FaLock className="absolute left-3 top-3.5 text-gray-400" />
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition-all ${
              loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Log In"}
          </button>
          {!isSignUp && (
            <div className="mt-3 text-center">
              <button
                onClick={resendVerificationEmail}
                className="text-sm text-primary font-semibold hover:underline"
              >
                Resen Verification Email
              </button>
            </div>
          )}
        </form>

        <p className="text-center mt-4 text-gray-600">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setIsSignUp(false)}
                className="text-indigo-600 font-semibold cursor-pointer hover:underline"
              >
                Log In
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span
                onClick={() => setIsSignUp(true)}
                className="text-indigo-600 font-semibold cursor-pointer hover:underline"
              >
                Sign Up
              </span>
            </>
          )}
        </p>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">or continue with</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Social Logins */}
        <div className="flex flex-col gap-3">
          <SocialLoginButton provider="google">
            <FaGoogle className="text-red-500 text-lg mr-2" />
            Continue with Google
          </SocialLoginButton>
        </div>
      </div>
    </div>
  );
};

export default Login;
