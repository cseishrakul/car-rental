import React from "react";
import { auth, googleProvider } from "../../api/firebase";
import { signInWithPopup } from "firebase/auth";
import api from "../../api/axios";

const SocialLoginButton = ({ provider }) => {
  const handleLogin = async () => {
    let firebaseProvider = provider === "google" ? googleProvider : "";

    try {
      const result = await signInWithPopup(auth, firebaseProvider);
      const user = result.user;
      const res = await api.post("/social-login", {
        name: user.displayName,
        email: user.email,
        social_id: user.uid,
        provider,
      });
      localStorage.setItem("auth_token", res.data.token);
      alert(`Welcome ${user.displayName}!`);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Social login failed");
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center justify-center gap-2 border-py-2 rounded-full text-gray-800 hover:bg-gray-100"
    >
      {provider === "google" ? "Google" : "No Social"} Login
    </button>
  );
};

export default SocialLoginButton;
