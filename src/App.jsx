import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import AddCustomerDetails from "./Components/AddCustomerDetails";
import CustomerDetails from "./Components/CustomerDetails";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/Login";
import Navbar from "./Components/Navbar";
import ProtectedRoute from "./Components/ProtectedRoute";
import SalesDashboard from "./Components/SalesDashboard";
import { auth, db } from "./firebase";

function App() {
  const [customerDetails, setCustomerDetails] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Listen to auth state and fetch user data from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser({ uid: currentUser.uid, ...userSnap.data() });
        } else {
          setUser(null);
          await signOut(auth);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time subscription to customers collection
  useEffect(() => {
    const colRef = collection(db, "customers");
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCustomerDetails(data);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user} allowedRoles={["admin"]}>
              <Dashboard customerDetails={customerDetails} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales-dashboard"
          element={
            <ProtectedRoute user={user} allowedRoles={["sales"]}>
              <SalesDashboard user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/addcustomerdetails"
          element={
            <ProtectedRoute user={user} allowedRoles={["admin", "sales"]}>
              <AddCustomerDetails
                user={user}
                setCustomerDetails={setCustomerDetails}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customerdetails"
          element={
            <ProtectedRoute user={user} allowedRoles={["admin"]}>
              <CustomerDetails
                customerDetails={customerDetails}
                setCustomerDetails={setCustomerDetails}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
