import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import AddCustomerDetails from "./AddCustomerDetails";
import CustomerDetails from "./CustomerDetails";

function App() {
  // Load data from localStorage at startup
  const [customerDetails, setCustomerDetails] = useState(() => {
    const storedData = localStorage.getItem("customerDetails");
    return storedData ? JSON.parse(storedData) : [];
  });

  // Save to localStorage whenever customerDetails changes
  useEffect(() => {
    localStorage.setItem("customerDetails", JSON.stringify(customerDetails));
  }, [customerDetails]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route
            path="addcustomerdetails"
            element={
              <AddCustomerDetails
                setCustomerDetails={setCustomerDetails}
                customerDetails={customerDetails}
              />
            }
          />
          <Route
            path="customerdetails"
            element={
              <CustomerDetails
                customerDetails={customerDetails}
                setCustomerDetails={setCustomerDetails}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
