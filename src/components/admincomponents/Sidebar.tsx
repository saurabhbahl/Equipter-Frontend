import { Link } from "react-router-dom";
import {
  faDashboard,
  faBox,
  faShoppingCart,
  faUser,
  faSignOutAlt,
  faTools,
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAdminContext } from "../../hooks/useAdminContext";

const Sidebar = () => {
  const { toggleSidebar, isSidebarCollapsed } = useAdminContext();

  const links = [
    {
      label: "Dashboard",
      route: "/admin/dashboard",
      icon: faDashboard,
    },
    {
      label: "Products",
      route: "/admin/products",
      icon: faBox,
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
      icon: faUser,
    },
    {
      label: "Logout",
      route: "/logout",
      icon: faSignOutAlt,
    },
  ];

  return (
    <div
      className={`relative min-h-[100vh] ${
        isSidebarCollapsed ? "w-[5.5%] " : "w-[13.5%]"
      } bg-black text-white shadow-xl transition-all duration-300`}
    >
      {/* Toggle button */}
      <div
        className={`absolute top-56  right-[-14%]  flex justify-end p-4 ${
          isSidebarCollapsed ? "right-[-28.5%]" : ""
        }`}
      >
        <button onClick={toggleSidebar} className=" ">
          {!isSidebarCollapsed ? (
            <FontAwesomeIcon
              className="text-3xl shadow-2xl"
              color={isSidebarCollapsed ? "white" : "#F6841F"}
              icon={faChevronCircleLeft}
            />
          ) : (
            <FontAwesomeIcon
              className="text-3xl shadow-2xl"
              color={!isSidebarCollapsed ? "white" : "#F6841F"}
              icon={faChevronCircleRight}
            />
          )}
        </button>
      </div>

      {!isSidebarCollapsed && (
        <p className="transition-all ease-in-out duration-300 ml-3 px-6 pt-4 mb-6 uppercase text-custom-orange text-2xl">
          Dashboard
        </p>
      )}

      {/* Menu Items */}
      <nav className="">
        {links.map((link, index) => (
          <Link
            title={link.label}
            key={index}
            to={link.route}
            className={`flex items-center p-3 px-10 hover:bg-custom-orange transition-all duration-500 ${
              isSidebarCollapsed ? "justify-center py-4" : ""
            }`}
          >
            <FontAwesomeIcon
              icon={link.icon}
              color={isSidebarCollapsed ? "white" : "#F6841F"}
              className="mr-3 hover:text-white"
            />
            {!isSidebarCollapsed && <span>{link.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
