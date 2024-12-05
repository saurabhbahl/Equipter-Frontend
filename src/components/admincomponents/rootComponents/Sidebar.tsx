import { Link, useLocation } from "react-router-dom";
import {
  faTachometerAlt,
  faBoxOpen,
  faShoppingCart,
  faUsers,
  faSignOutAlt,
  faTools,
  faChevronLeft,
  faChevronRight,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAdminContext } from "../../../hooks/useAdminContext";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const { toggleSidebar, isSidebarCollapsed } = useAdminContext();
  const [showText, setShowText] = useState(!isSidebarCollapsed);
  const location = useLocation();

  const links = [
    {
      label: "Dashboard",
      route: "/admin/dashboard",
      icon: faTachometerAlt,
    },
    {
      label: "Products",
      route: "/admin/products",
      icon: faBoxOpen,
    },
    {
      label: "Accessories",
      route: "/admin/accessories",
      icon: faTools,
    },
    {
      label: "Orders",
      route: "/admin/orders",
      icon: faShoppingCart,
    },
    {
      label: "Customers",
      route: "/admin/customers",
      icon: faUsers,
    },
    {
      label: "Logout",
      route: "/logout",
      icon: faSignOutAlt,
    },
  ];
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isSidebarCollapsed) {
      timeoutId = setTimeout(() => setShowText(false), 100);
    } else {
      timeoutId = setTimeout(() => setShowText(true), 180);
    }
    return () => clearTimeout(timeoutId);
  }, [isSidebarCollapsed]);

  return (
    <div
      className={` top-0 sticky min-h-screen ${
        isSidebarCollapsed ? "w-20" : "w-64"
      } bg-gradient-to-b from-gray-900 to-black text-white shadow-lg transition-all duration-500`}
    >
      {/* Toggle Button */}
      <div
        onClick={toggleSidebar}
        className={`absolute z-50 top-2 right-[-12px] hidd ${
          isSidebarCollapsed ? "right-[-15px]" : ""
        }`}
      >
        <button className="bg-gray-500 p-2 rounded-full shadow-md hover:bg-gray-700 duration-200 transition-colors">
          <FontAwesomeIcon
            icon={isSidebarCollapsed ? faChevronRight : faChevronLeft}
            className="text-white"
          />
        </button>
      </div>

     {/* Logo */}
     <div className="flex items-center justify-center py-5 animate-pulse">
        <FontAwesomeIcon
          icon={faUserShield}
          className="text-2xl font-bold"
        />
        <h1
          className={`text-2xl font-bold ml-2 transition-opacity duration-500 ${
            showText ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          Admin Panel
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="">
        {links.map((link, index) => {
          const isActive = location.pathname.includes(link.route);
          // const isActive = location.pathname === link.route;
          return (
            <Link
              title={link.label}
              key={index}
              to={link.route}
              className={`flex my-1 items-center py-3 px-4 mx-2 rounded-md transition-all duration-500 ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800 hover:text-white"
              } ${isSidebarCollapsed ? "justify-center" : ""}`}
            >
              <FontAwesomeIcon
                icon={link.icon}
                className={`text-lg ${
                  isActive ? "text-custom-orange" : "text-gray-400"
                }`}
              />
              {!isSidebarCollapsed && (
                <span className={`ml-3 text-base transition-all duration-200 ease-in font-medium ${
                  showText ? "opacity-100" : "opacity-0 hidden"
                }`}>{link.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
