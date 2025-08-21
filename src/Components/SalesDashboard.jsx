// src/Components/SalesDashboard.jsx
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Users } from "lucide-react";

function SalesDashboard({ user }) {
  const [myCustomers, setMyCustomers] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "customers"),
      where("salespersonId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMyCustomers(data);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Sales Dashboard</h2>
      </div>

      {/* Stats Card */}
      <div className="bg-white shadow-md rounded-2xl p-5 mb-6">
        <h3 className="text-lg font-semibold text-gray-700">My Customers</h3>
        <p className="text-3xl font-bold text-blue-600 mt-2">
          {myCustomers.length}
        </p>
      </div>

      {/* Customer List */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Customer List
        </h3>
        {myCustomers.length === 0 ? (
          <p className="text-gray-500">No customers assigned yet.</p>
        ) : (
          <ul className="space-y-3">
            {myCustomers.map((customer) => (
              <li
                key={customer.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
              >
                <p className="font-medium text-gray-800">
                  {customer.firstName + " " + customer.lastName}
                </p>
                <p className="text-sm text-gray-600">{customer.email}</p>
                <p className="text-sm text-gray-600">{customer.phone}</p>
                <p className="text-sm text-gray-600">{customer.service}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SalesDashboard;
