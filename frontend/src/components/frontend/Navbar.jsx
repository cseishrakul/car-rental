import React, { useState, useEffect } from "react";
import { assets, menuLinks } from "../../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { FaArrowDown, FaTimes } from "react-icons/fa";
import { FaBarsStaggered } from "react-icons/fa6";
import api from "../../api/axios";
import { IoIosArrowDown } from "react-icons/io";

const Navbar = ({ setShowLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me");
        setUser(res.data);
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${
        location.pathname === "/" && "bg-light"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="h-8" />
      </Link>

      {/* Menu Links */}
      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${
          location.pathname === "/" ? "bg-light" : "bg-white"
        } ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
      >
        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path}>
            {link.name}
          </Link>
        ))}

        {/* Search box */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56">
          <input
            type="text"
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            placeholder="Search Product"
          />
          <FiSearch />
        </div>

        {/* Right side buttons */}
        <div className="flex max-sm:flex-col items-start sm:items-center gap-6">
          {!user ? (
            // Guest
            <button
              onClick={() => setShowLogin(true)}
              className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
            >
              Login
            </button>
          ) : (
            // Logged-in user
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="cursor-pointer px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-1"
              >
                {user.name} <IoIosArrowDown />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <Link
                    to="/my-bookings"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hamburger menu */}
      <button
        className="sm:hidden cursor-pointer text-2xl"
        aria-label="Menu"
        onClick={() => setOpen(!open)}
      >
        {open ? <FaTimes /> : <FaBarsStaggered />}
      </button>
    </div>
  );
};

export default Navbar;
