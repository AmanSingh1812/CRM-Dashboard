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

function Dashboard({ customerDetails }) {
  const [todayReminders, setTodayReminders] = useState([]);

  // Update live reminders every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date().toISOString().split("T")[0]; // today date
      const reminders = customerDetails.filter(
        (c) => c.remainder && c.remainder.slice(0, 10) === today
      );
      setTodayReminders(reminders);
    }, 10000); // check every 10 seconds

    return () => clearInterval(interval);
  }, [customerDetails]);

  // Summary metrics
  const totalCustomers = customerDetails.length;
  const totalRevenue = customerDetails.reduce(
    (sum, c) => sum + (c.totalPrice || 0),
    0
  );

  // Service count for pie chart
  const serviceCount = customerDetails.reduce((acc, c) => {
    if (c.services) {
      acc[c.services] = (acc[c.services] || 0) + 1;
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

  // Revenue per service for bar chart
  const barData = Object.keys(serviceCount).map((key) => ({
    service: key,
    revenue: customerDetails
      .filter((c) => c.services === key)
      .reduce((sum, c) => sum + (c.totalPrice || 0), 0),
  }));

  return (
    <div className="p-5 space-y-10">
      <h1 className="text-3xl font-bold mb-5">Dashboard</h1>

      {/* Summary Cards */}
      <div className="flex gap-5 mb-10">
        <div className="bg-blue-200 p-5 rounded shadow w-1/4 text-center">
          <h2 className="text-xl font-bold">Total Customers</h2>
          <p className="text-2xl">{totalCustomers}</p>
        </div>
        <div className="bg-green-200 p-5 rounded shadow w-1/4 text-center">
          <h2 className="text-xl font-bold">Total Revenue</h2>
          <p className="text-2xl">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-200 p-5 rounded shadow w-1/4 text-center">
          <h2 className="text-xl font-bold">Today's Reminders</h2>
          <p className="text-2xl">{todayReminders.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="flex gap-10">
        {/* Pie Chart */}
        <div className="w-1/2 h-64">
          <h2 className="text-xl font-bold mb-2">Service Distribution</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
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
        <div className="w-1/2 h-64">
          <h2 className="text-xl font-bold mb-2">Revenue per Service</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="service" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming Reminders */}
      <div>
        <h2 className="text-2xl font-bold mb-3">Today's Reminders</h2>
        {todayReminders.length === 0 ? (
          <p>No reminders today</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Service</th>
                <th className="border p-2">Unit</th>
                <th className="border p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {todayReminders.map((c, idx) => (
                <tr key={idx}>
                  <td className="border p-2">
                    {c.firstname} {c.lastname}
                  </td>
                  <td className="border p-2">{c.services}</td>
                  <td className="border p-2">{c.unit}</td>
                  <td className="border p-2">{c.remainder.slice(11, 16)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
