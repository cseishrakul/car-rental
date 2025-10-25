import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

import {
  FiBox,
  FiCalendar,
  FiChevronDown,
  FiGrid,
  FiMoreHorizontal,
  FiList,
  FiFileText,
  FiPieChart,
  FiTable,
  FiUser,
  FiUsers,
  FiBookmark,
} from "react-icons/fi";
import { LuPlug2 } from "react-icons/lu";

import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

const menuItems = {
  admin: [
    {
      icon: <FiGrid />,
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <FiUsers />,
      name: "Manager",
      subItems: [
        {
          name: "Add Manager",
          path: "/dashboard/add-manager",
        },
        {
          name: "All Manager",
          path: "/dashboard/all-manager",
        },
      ],
    },
    {
      icon: <FiUser />,
      name: "User Profile",
      subItems: [
        {
          name: "Edit Profile",
          path: "/dashboard/edit-profile",
        },
        {
          name: "View Profile",
          path: "/dashboard/profile",
        },
      ],
    },
    {
      icon: <FiList />,
      name: "Cars",
      subItems: [
        {
          name: "Add Car",
          path: "/dashboard/add-car",
        },
        {
          name: "All Car",
          path: "/dashboard/cars",
        },
      ],
    },
    {
      icon: <FiList />,
      name: "Drivers",
      subItems: [
        {
          name: "Pending Drivers",
          path: "/dashboard/pending-drivers",
        },
        {
          name: "Drivers List",
          path: "/dashboard/drivers-list",
        },
      ],
    },
    {
      icon: <FiBookmark />,
      name: "Bookings",
      subItems: [
        {
          name: "All Bookings",
          path: "/dashboard/bookings",
        },
      ],
    },
  ],
  manager: [
    {
      icon: <FiGrid />,
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <FiUser />,
      name: "User Profile",
      subItems: [
        {
          name: "Edit Profile",
          path: "/dashboard/edit-profile",
        },
        {
          name: "View Profile",
          path: "/dashboard/profile",
        },
      ],
    },
    {
      icon: <FiList />,
      name: "Cars",
      subItems: [
        {
          name: "Add Car",
          path: "/dashboard/add-car",
        },
        {
          name: "All Car",
          path: "/dashboard/cars",
        },
      ],
    },
    {
      icon: <FiList />,
      name: "Drivers",
      subItems: [
        {
          name: "Pending Drivers",
          path: "/dashboard/pending-drivers",
        },
        {
          name: "Drivers List",
          path: "/dashboard/drivers-list",
        },
      ],
    },
    {
      icon: <FiBookmark />,
      name: "Bookings",
      subItems: [
        {
          name: "All Bookings",
          path: "/dashboard/bookings",
        },
      ],
    },
  ],
  driver: [
    {
      icon: <FiGrid />,
      name: "My Assignments",
      path: "/dashboard",
    },
    {
      icon: <FiUser />,
      name: "User Profile",
      subItems: [
        {
          name: "Edit Profile",
          path: "/dashboard/edit-profile",
        },
        {
          name: "View Profile",
          path: "/dashboard/driver/profile",
        },
      ],
    },
  ],
};

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const user = JSON.parse(localStorage.getItem("auth_user"));
  const role = user?.role || "user";
  const navItems = menuItems[role];

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ index });
            submenuMatched = true;
          }
        });
      }
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [location, isActive, navItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index) => {
    setOpenSubmenu((prev) => (prev?.index === index ? null : { index }));
  };

  const renderMenuItems = (items) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group ${
                openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size ${
                  openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <FiChevronDown
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.index === index
                    ? `${subMenuHeight[`${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white  text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 shadow-md`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-4 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <div className="flex items-center gap-4 mt-0">
                <img
                  className="w-16 h-16 object-contain"
                  src="inx.webp"
                  alt="Logo"
                />
                <span className="text-3xl  text-bold text-gray-900 font-[Outfit]">
                  Inventaix
                </span>
              </div>
            </>
          ) : (
            <img src="inx.webp" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <FiMoreHorizontal className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems)}
            </div>
          </div>
        </nav>
        {(isExpanded || isHovered || isMobileOpen) && <SidebarWidget />}
      </div>
    </aside>
  );
};

export default AppSidebar;
