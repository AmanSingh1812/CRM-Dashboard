// src/Components/AddCustomerDetails.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

function AddCustomerDetails({ user, setCustomerDetails }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    service: "",
    unit: "",
    remark: "",
    reminder: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const colRef = collection(db, "customers");
      const docRef = await addDoc(colRef, {
        ...form,
        createdAt: serverTimestamp(),
        salespersonId: user?.uid || null,
      });

      setCustomerDetails((prev) => [
        ...prev,
        { id: docRef.id, ...form, salespersonId: user?.uid },
      ]);

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dob: "",
        service: "",
        unit: "",
        remark: "",
        reminder: "",
      });

      navigate("/customerdetails");
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-6 text-gray-800">
          Add Customer Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 font-medium">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
                className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
                className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 font-medium">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* DOB & Service */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 font-medium">DOB</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                required
                className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium">Service</label>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                required
                className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Service</option>
                <option value="transaction_Sms">Transaction SMS</option>
                <option value="promotion_Sms">Promotion SMS</option>
                <option value="official_Whatsapp">Official Whatsapp</option>
                <option value="vertual_Whatsapp">Virtual Whatsapp</option>
                <option value="voice_Call">Voice Call</option>
                <option value="ivr">IVR</option>
                <option value="digital_Marketing">Digital Marketing</option>
              </select>
            </div>
          </div>

          {/* Unit & Remark */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 font-medium">Unit</label>
              <input
                type="number"
                name="unit"
                placeholder="Unit"
                value={form.unit}
                onChange={handleChange}
                required
                className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium">Remark</label>
              <input
                type="text"
                name="remark"
                placeholder="Remark"
                value={form.remark}
                onChange={handleChange}
                required
                className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Reminder */}
          <div>
            <label className="block text-gray-600 font-medium">Reminder</label>
            <input
              type="datetime-local"
              name="reminder"
              value={form.reminder}
              onChange={handleChange}
              required
              className="mt-2 w-full md:w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Add Customer
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCustomerDetails;
