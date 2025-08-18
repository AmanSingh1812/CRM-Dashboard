import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddCustomerDetails from "./Components/AddCustomerDetails";
import CustomerDetails from "./Components/CustomerDetails";
import Dashboard from "./Components/Dashboard";
import Navbar from "./Components/Navbar";

function App() {
  const [customerDetails, setCustomerDetails] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("customerDetails");
    if (saved) {
      setCustomerDetails(JSON.parse(saved));
    }
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
