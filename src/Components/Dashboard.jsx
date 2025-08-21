import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import servicePrices from "./servicePrice";

function Dashboard({ customerDetails }) {
  const [todayReminders, setTodayReminders] = useState([]);

  const getTodayReminders = () => {
    const today = new Date().toISOString().split("T")[0];
    return customerDetails.filter((c) => {
      if (!c.reminder) return false;
      const reminderDate = c.reminder.slice(0, 10);
      return reminderDate === today;
    });
  };

  useEffect(() => {
    setTodayReminders(getTodayReminders());
    const interval = setInterval(() => {
      setTodayReminders(getTodayReminders());
    }, 10000);
    return () => clearInterval(interval);
  }, [customerDetails]);

  const totalCustomers = customerDetails.length;

  const calculateTotalPrice = (service, unit) => {
    const pricePerUnit = servicePrices[service] || 0;
    return unit * pricePerUnit;
  };

  const totalRevenue = customerDetails.reduce(
    (sum, c) => sum + calculateTotalPrice(c.service, c.unit),
    0
  );

  const serviceCount = customerDetails.reduce((acc, c) => {
    if (c.service) {
      acc[c.service] = (acc[c.service] || 0) + 1;
    }
    return acc;
  }, {});

  const pieData = Object.keys(serviceCount).map((key) => ({
    name: key,
    value: serviceCount[key],
  }));

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28DFF",
    "#FF6F91",
    "#FF8C42",
  ];

  const barData = Object.keys(serviceCount).map((key) => ({
    service: key,
    revenue: customerDetails
      .filter((c) => c.service === key)
      .reduce((sum, c) => sum + calculateTotalPrice(c.service, c.unit), 0),
  }));

  return (
    <div className="p-4 md:p-8 lg:p-10 space-y-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-5 text-gray-800 text-center">
        📊 Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 text-center">
          <h2 className="text-base md:text-lg font-semibold text-gray-600">
            Total Customers
          </h2>
          <p className="text-2xl md:text-3xl font-bold text-blue-600 mt-2">
            {totalCustomers}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 text-center">
          <h2 className="text-base md:text-lg font-semibold text-gray-600">
            Total Revenue
          </h2>
          <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 text-center">
          <h2 className="text-base md:text-lg font-semibold text-gray-600">
            Today&apos;s Reminders
          </h2>
          <p className="text-2xl md:text-3xl font-bold text-yellow-600 mt-2">
            {todayReminders.length}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-700">
            Service Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-700">
            Revenue per Service
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="service" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#82ca9d" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Today's Reminders */}
      <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
        <h2 className="text-lg md:text-2xl font-semibold mb-4 text-gray-700">
          Today&apos;s Reminders
        </h2>
        {todayReminders.length === 0 ? (
          <p className="text-gray-500 text-center">No reminders today ✅</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm md:text-base">
              <thead>
                <tr className="bg-gray-100 text-gray-600">
                  <th className="border p-3 text-left">Name</th>
                  <th className="border p-3 text-left">Service</th>
                  <th className="border p-3 text-left">Unit</th>
                  <th className="border p-3 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {todayReminders.map((c, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 transition border-b last:border-none"
                  >
                    <td className="p-3">
                      {c.firstName} {c.lastName}
                    </td>
                    <td className="p-3">{c.service}</td>
                    <td className="p-3">{c.unit}</td>
                    <td className="p-3">
                      {c.reminder ? c.reminder.slice(11, 16) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
