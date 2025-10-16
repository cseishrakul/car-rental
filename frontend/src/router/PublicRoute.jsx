import { Route, Routes, useLocation } from "react-router";
import Public from "./Public";
import LandingPage from "../pages/frontend/LandingPage";
import SignIn from "../pages/AuthPages/SignIn";
import SignUp from "../pages/AuthPages/SignUp";
import DriverRegister from "../pages/Driver/DriverRegister";
import { useState } from "react";
import Login from "../components/frontend/Login";
import Home from "../pages/frontend/Home";
import Cars from "../pages/frontend/Cars";
import CarDetails from "../pages/frontend/CarDetails";
import MyBooking from "../pages/frontend/MyBooking";
import Footer from "../components/frontend/Footer";
import Navbar from "../components/frontend/Navbar";

export default function PublicRoute() {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const hideLayoutPaths = ["/signin", "/signup", "/driver/register"];

  const isDashboardPath = pathname.startsWith("/dashboard");
  const hideNavbarFooter =
    isDashboardPath || hideLayoutPaths.includes(pathname);

  return (
    <>
      {showLogin && <Login setShowLogin={setShowLogin} />}
      {!hideNavbarFooter && <Navbar setShowLogin={setShowLogin} />}
      <Routes>
        {/* Frontend Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="/my-bookings" element={<MyBooking />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/driver/register" element={<DriverRegister />} />
      </Routes>
      {!hideNavbarFooter && <Footer />}
    </>
  );
}
