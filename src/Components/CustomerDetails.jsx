import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import * as XLSX from "xlsx"; // ✅ Excel parser
import servicePrices from "./servicePrice";

function CustomerDetails({ customerDetails, setCustomerDetails }) {
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});

  // Real-time subscription
  useEffect(() => {
    const colRef = collection(db, "customers");
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCustomerDetails(data);
    });

    return () => unsubscribe();
  }, [setCustomerDetails]);

  // ✅ Handle Excel Upload
  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Loop through each row and add to Firestore
      for (const row of worksheet) {
        const customerData = {
          firstName: row["First Name"] || "",
          lastName: row["Last Name"] || "",
          email: row["Email"] || "",
          phone: row["Phone"] || "",
          dob: row["DOB"] || "",
          service: row["Service"] || "",
          unit: row["Unit"] || 0,
          remark: row["Remark"] || "",
          reminder: row["Reminder"] || "",
        };

        await addDoc(collection(db, "customers"), customerData);
      }

      alert("✅ Excel data uploaded successfully!");
    } catch (error) {
      console.error("Error uploading Excel:", error);
      alert("❌ Failed to upload Excel file");
    }
  };

  // ✅ Handle Excel Download
  const handleExcelDownload = () => {
    if (customerDetails.length === 0) {
      alert("No data available to export!");
      return;
    }

    // Prepare data
    const dataToExport = customerDetails.map((customer) => ({
      "First Name": customer.firstName,
      "Last Name": customer.lastName,
      Email: customer.email,
      Phone: customer.phone,
      DOB: customer.dob,
      Service: customer.service,
      Unit: customer.unit,
      "Total Price": calculateTotalPrice(customer.service, customer.unit),
      Remark: customer.remark,
      Reminder: customer.reminder,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

    // Download file
    XLSX.writeFile(workbook, "CustomerDetails.xlsx");
  };

  // Delete customer
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "customers", id));
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  // Edit
  const handleEdit = (customer) => {
    setEditingId(customer.id);
    setEditingData({
      firstName: customer.firstName || "",
      lastName: customer.lastName || "",
      email: customer.email || "",
      phone: customer.phone || "",
      dob: customer.dob || "",
      service: customer.service || "",
      unit: customer.unit || 0,
      remark: customer.remark || "",
      reminder: customer.reminder || "",
    });
  };

  // Save update
  const handleSave = async (id) => {
    try {
      const docRef = doc(db, "customers", id);
      await updateDoc(docRef, editingData);
      setEditingId(null);
      setEditingData({});
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleChange = (e) => {
    setEditingData({ ...editingData, [e.target.name]: e.target.value });
  };

  const calculateTotalPrice = (service, unit) => {
    const pricePerUnit = servicePrices[service] || 0;
    return unit * pricePerUnit;
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Customer List
      </h2>

      {/* ✅ Excel Upload & Download */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleExcelUpload}
          className="border p-2 rounded-lg shadow-sm w-64"
        />
        <button
          onClick={handleExcelDownload}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow transition"
        >
          Download Excel
        </button>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full border border-gray-300 bg-white">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="border px-4 py-2">First Name</th>
              <th className="border px-4 py-2">Last Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">DOB</th>
              <th className="border px-4 py-2">Service</th>
              <th className="border px-4 py-2">Unit</th>
              <th className="border px-4 py-2">Total Price</th>
              <th className="border px-4 py-2">Remark</th>
              <th className="border px-4 py-2">Reminder</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customerDetails.map((customer) => (
              <tr
                key={customer.id}
                className="text-center hover:bg-gray-50 transition"
              >
                <td className="border px-2 py-2">
                  {editingId === customer.id ? (
                    <input
                      className="border p-1 rounded"
                      name="firstName"
                      value={editingData.firstName}
                      onChange={handleChange}
                    />
                  ) : (
                    customer.firstName
                  )}
                </td>
                <td className="border px-2 py-2">
                  {editingId === customer.id ? (
                    <input
                      className="border p-1 rounded"
                      name="lastName"
                      value={editingData.lastName}
                      onChange={handleChange}
                    />
                  ) : (
                    customer.lastName
                  )}
                </td>
                <td className="border px-2 py-2">
                  {editingId === customer.id ? (
                    <input
                      className="border p-1 rounded"
                      name="email"
                      value={editingData.email}
                      onChange={handleChange}
                    />
                  ) : (
                    customer.email
                  )}
                </td>
                <td className="border px-2 py-2">
                  {editingId === customer.id ? (
                    <input
                      className="border p-1 rounded"
                      name="phone"
                      value={editingData.phone}
                      onChange={handleChange}
                    />
                  ) : (
                    customer.phone
                  )}
                </td>
                <td className="border px-2 py-2">
                  {editingId === customer.id ? (
                    <input
                      type="date"
                      className="border p-1 rounded"
                      name="dob"
                      value={editingData.dob}
                      onChange={handleChange}
                    />
                  ) : (
                    customer.dob
                  )}
                </td>
                <td className="border px-2 py-2">
                  {editingId === customer.id ? (
                    <select
                      className="border p-1 rounded"
                      name="service"
                      value={editingData.service}
                      onChange={handleChange}
                    >
                      <option value="transaction_Sms">Transaction SMS</option>
                      <option value="promotion_Sms">Promotion SMS</option>
                      <option value="official_Whatsapp">
                        Official Whatsapp
                      </option>
                      <option value="vertual_Whatsapp">Virtual Whatsapp</option>
                      <option value="voice_Call">Voice Call</option>
                      <option value="ivr">IVR</option>
                      <option value="digital_Marketing">
                        Digital Marketing
                      </option>
                    </select>
                  ) : (
                    customer.service
                  )}
                </td>
                <td className="border px-2 py-2">
                  {editingId === customer.id ? (
                    <input
                      type="number"
                      className="border p-1 rounded w-20"
                      name="unit"
                      value={editingData.unit}
                      onChange={handleChange}
                    />
                  ) : (
                    customer.unit
                  )}
                </td>
                <td className="border px-2 py-2 font-semibold text-blue-600">
                  {calculateTotalPrice(customer.service, customer.unit)}
                </td>
                <td className="border px-2 py-2">
                  {editingId === customer.id ? (
                    <input
                      className="border p-1 rounded"
                      name="remark"
                      value={editingData.remark}
                      onChange={handleChange}
                    />
                  ) : (
                    customer.remark
                  )}
                </td>
                <td className="border px-2 py-2">
                  {editingId === customer.id ? (
                    <input
                      type="datetime-local"
                      className="border p-1 rounded"
                      name="reminder"
                      value={editingData.reminder}
                      onChange={handleChange}
                    />
                  ) : (
                    customer.reminder
                  )}
                </td>
                <td className="border px-2 py-2">
                  {editingId === customer.id ? (
                    <div className="flex gap-2 justify-center">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow"
                        onClick={() => handleSave(customer.id)}
                      >
                        Save
                      </button>
                      <button
                        className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded shadow"
                        onClick={() => {
                          setEditingId(null);
                          setEditingData({});
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-center">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow"
                        onClick={() => handleEdit(customer)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow"
                        onClick={() => handleDelete(customer.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerDetails;
