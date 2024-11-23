// import { Link } from "react-router-dom";
// import {
//   faDashboard,
//   faBox,
//   faShoppingCart,
//   faUser,
//   faSignOutAlt,
//   faTools,
//   faChevronCircleLeft,
//   faChevronCircleRight,
// } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useAdminContext } from "../../../hooks/useAdminContext";

// const Sidebar = () => {
//   const { toggleSidebar, isSidebarCollapsed } = useAdminContext();

//   const links = [
//     {
//       label: "Dashboard",
//       route: "/admin/dashboard",
//       icon: faDashboard,
//     },
//     {
//       label: "Products",
//       route: "/admin/products",
//       icon: faBox,
//     },
//     {
//       label: "Accessories",
//       route: "/admin/accessories",
//       icon: faTools,
//     },
//     {
//       label: "Orders",
//       route: "/admin/orders",
//       icon: faShoppingCart,
//     },
//     {
//       label: "Customers",
//       route: "/admin/customers",
//       icon: faUser,
//     },
//     {
//       label: "Logout",
//       route: "/logout",
//       icon: faSignOutAlt,
//     },
//   ];

//   return (
//     <div
//       className={`relative min-h-[100vh] ${
//         isSidebarCollapsed ? "w-[5.5%] " : "w-[13.5%]"
//       } bg-black text-white shadow-xl transition-all duration-300`}
//     >
//       {/* Toggle button */}
//       <div
//         className={`absolute top-56  right-[-14%]  flex justify-end p-4 ${
//           isSidebarCollapsed ? "right-[-28.5%]" : ""
//         }`}
//       >
//         <button onClick={toggleSidebar} className=" ">
//           {!isSidebarCollapsed ? (
//             <FontAwesomeIcon
//               className="text-3xl shadow-2xl"
//               color={isSidebarCollapsed ? "white" : "#F6841F"}
//               icon={faChevronCircleLeft}
//             />
//           ) : (
//             <FontAwesomeIcon
//               className="text-3xl shadow-2xl"
//               color={!isSidebarCollapsed ? "white" : "#F6841F"}
//               icon={faChevronCircleRight}
//             />
//           )}
//         </button>
//       </div>

//       {!isSidebarCollapsed && (
//         <p className="transition-all ease-in-out duration-300 ml-3 px-6 pt-4 mb-6 uppercase text-custom-orange text-2xl">
//           Dashboard
//         </p>
//       )}

//       {/* Menu Items */}
//       <nav className="">
//         {links.map((link, index) => (
//           <Link
//             title={link.label}
//             key={index}
//             to={link.route}
//             className={`flex items-center p-3 px-10 hover:bg-custom-orange transition-all duration-500 ${
//               isSidebarCollapsed ? "justify-center py-4" : ""
//             }`}
//           >
//             <FontAwesomeIcon
//               icon={link.icon}
//               color={isSidebarCollapsed ? "white" : "#F6841F"}
//               className="mr-3 hover:text-white"
//             />
//             {!isSidebarCollapsed && <span>{link.label}</span>}
//           </Link>
//         ))}
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;

// import { Link, useLocation } from "react-router-dom";
// import {
//   faTachometerAlt,
//   faBoxOpen,
//   faShoppingCart,
//   faUsers,
//   faSignOutAlt,
//   faTools,
//   faChevronLeft,
//   faChevronRight,
// } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useAdminContext } from "../../../hooks/useAdminContext";

// const Sidebar = () => {
//   const { toggleSidebar, isSidebarCollapsed } = useAdminContext();
//   const location = useLocation();

//   const links = [
//     {
//       label: "Dashboard",
//       route: "/admin/dashboard",
//       icon: faTachometerAlt,
//     },
//     {
//       label: "Products",
//       route: "/admin/products",
//       icon: faBoxOpen,
//     },
//     {
//       label: "Accessories",
//       route: "/admin/accessories",
//       icon: faTools,
//     },
//     {
//       label: "Orders",
//       route: "/admin/orders",
//       icon: faShoppingCart,
//     },
//     {
//       label: "Customers",
//       route: "/admin/customers",
//       icon: faUsers,
//     },
//     {
//       label: "Logout",
//       route: "/logout",
//       icon: faSignOutAlt,
//     },
//   ];

//   return (
//     <div
//       className={`relative min-h-screen ${
//         isSidebarCollapsed ? "w-20" : "w-64"
//       } bg-gradient-to-b from-black to-custom-black-200 text-white shadow-lg transition-width duration-300`}
//     >
//       {/* Toggle Button */}
//       <div
//         className={`absolute top-2 right-[-12px] ${
//           isSidebarCollapsed ? "right-[-15px]" : ""
//         }`}
//       >
//         <button
//           onClick={toggleSidebar}
//           className="bg-gray-500 p-2 rounded-full shadow-md hover:bg-gray-700 transition-colors"
//         >
//           <FontAwesomeIcon
//             icon={isSidebarCollapsed ? faChevronRight : faChevronLeft}
//             className="text-white"
//           />
//         </button>
//       </div>

//       {/* Logo */}
//       {!isSidebarCollapsed && (
//         <div className="flex items-center justify-center py-6">
//           <h1 className="text-2xl font-bold"><FontAwesomeIcon icon={"admin"}/> Admin Panel</h1>
//         </div>
//       )}

//       {/* Navigation Links */}
//       <nav className="">
//         {links.map((link, index) => {
//           const isActive = location.pathname === link.route;
//           return (
//             <Link
//               title={link.label}
//               key={index}
//               to={link.route}
//               className={`flex  my-1 items-center py-3 px-4 mx-2 rounded-md transition-colors ${
//                 isActive
//                   ? "bg-gray-700"
//                   : "hover:bg-gray-800 hover:text-white"
//               } ${isSidebarCollapsed ? "justify-center" : ""}`}
//             >
//               <FontAwesomeIcon
//                 icon={link.icon}
//                 className={`text-lg ${
//                   isActive ? "text-custom-orange" : "text-gray-400"
//                 }`}
//               />
//               {!isSidebarCollapsed && (
//                 <span className="ml-3">{link.label}</span>
//               )}
//             </Link>
//           );
//         })}
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;

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
