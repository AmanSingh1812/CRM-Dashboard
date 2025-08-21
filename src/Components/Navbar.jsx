import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react"; // for hamburger icons
import logo from "../assets/Logo.gif";

function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img src={logo} alt="Logo" className="w-20 h-auto" />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {(user.role === "admin" || user.role === "sales") && (
                <>
                  <Link
                    to="/addcustomerdetails"
                    className="text-gray-700 hover:text-blue-600 font-medium transition"
                  >
                    Add Customer
                  </Link>
                  <Link
                    to="/customerdetails"
                    className="text-gray-700 hover:text-blue-600 font-medium transition"
                  >
                    Customers
                  </Link>
                </>
              )}

              {user.role === "admin" && (
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Dashboard
                </Link>
              )}

              {user.role === "sales" && (
                <Link
                  to="/sales-dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  My Sales Dashboard
                </Link>
              )}

              <button
                onClick={onLogout}
                className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t shadow-md">
            <ul className="flex flex-col space-y-4 p-4">
              {(user.role === "admin" || user.role === "sales") && (
                <>
                  <li>
                    <Link
                      to="/addcustomerdetails"
                      className="block text-gray-700 hover:text-blue-600 font-medium"
                      onClick={() => setMenuOpen(false)}
                    >
                      Add Customer
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/customerdetails"
                      className="block text-gray-700 hover:text-blue-600 font-medium"
                      onClick={() => setMenuOpen(false)}
                    >
                      Customers
                    </Link>
                  </li>
                </>
              )}

              {user.role === "admin" && (
                <li>
                  <Link
                    to="/dashboard"
                    className="block text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
              )}

              {user.role === "sales" && (
                <li>
                  <Link
                    to="/sales-dashboard"
                    className="block text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Sales Dashboard
                  </Link>
                </li>
              )}

              <li>
                <button
                  onClick={() => {
                    onLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>

      <Outlet />
    </>
  );
}

export default Navbar;
