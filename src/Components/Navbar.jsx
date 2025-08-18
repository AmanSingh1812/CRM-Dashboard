import logo from "../assets/Logo.gif";
import { Link, Outlet } from "react-router-dom";

function Navbar() {

  return (
    <>
      <nav className="flex justify-between items-center p-4 shadow-md">
        <img src={logo} alt="Logo" width="100px" className="p-2 ml-8" />
        <ul className="flex gap-6 mr-8">
          <li>
            <Link to="/dashboard" className="hover:text-blue-600 font-medium">
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/addcustomerdetails"
              className="hover:text-blue-600 font-medium"
            >
              Add Customer Details
            </Link>
          </li>
          <li>
            <Link
              to="/customerdetails"
              className="hover:text-blue-600 font-medium"
            >
              Customer Details
            </Link>
          </li>
        </ul>
      </nav>

      {/* This is where child routes like App or Dashboard will render */}
      <Outlet />
    </>
  );
}
export default Navbar;
