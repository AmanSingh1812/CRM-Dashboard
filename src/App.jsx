import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AddCustomerDetails from "./Components/AddCustomerDetails";
import CustomerDetails from "./Components/CustomerDetails";
import Dashboard from "./Components/Dashboard";
import Navbar from "./Components/Navbar";

function App() {
  const [customerDetails, setCustomerDetails] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("customerDetails");
    if (saved) {
      setCustomerDetails(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever customerDetails change
  useEffect(() => {
    localStorage.setItem("customerDetails", JSON.stringify(customerDetails));
  }, [customerDetails]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Default route loads Dashboard */}
        <Route
          path="/"
          element={<Dashboard customerDetails={customerDetails} />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard customerDetails={customerDetails} />}
        />
        <Route
          path="/addcustomerdetails"
          element={
            <AddCustomerDetails
              customerDetails={customerDetails}
              setCustomerDetails={setCustomerDetails}
            />
          }
        />
        <Route
          path="/customerdetails"
          element={
            <CustomerDetails
              customerDetails={customerDetails}
              setCustomerDetails={setCustomerDetails}
            />
          }
        />
        {/* Redirect unknown paths to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
