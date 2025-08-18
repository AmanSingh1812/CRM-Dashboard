import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

function CustomerDetails({ customerDetails, setCustomerDetails }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingData, setEditingData] = useState({});

  // 🔔 Telegram Sender
  const sendTelegramReminder = async (message) => {
    const botToken = process.env.REACT_APP_BOT_TOKEN; // 🔑 Replace with your bot token
    const chatId = process.env.REACT_APP_CHAT_ID;// 🆔 Replace with your chat id
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });
    } catch (err) {
      console.error("Telegram Error:", err);
    }
  };

  // 🔔 Check reminders every 1 minute
  useEffect(() => {
    if (!customerDetails || customerDetails.length === 0) return;

    const interval = setInterval(() => {
      const now = new Date();
      const pad = (n) => (n < 10 ? "0" + n : n);
      const nowString = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
        now.getDate()
      )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

      customerDetails.forEach((customer) => {
        if (
          customer.remainder &&
          customer.remainder.slice(0, 16) === nowString
        ) {
          const message = `⏰ Reminder for ${customer.firstname} ${customer.lastname}\nService: ${customer.services}\nRemark: ${customer.remark}`;
          sendTelegramReminder(message);
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [customerDetails]);

  // 📝 Edit & Delete
  const onDelete = (index) => {
    const updated = [...customerDetails];
    updated.splice(index, 1);
    setCustomerDetails(updated);
    localStorage.setItem("customerDetails", JSON.stringify(updated));
  };

  const onEdit = (index) => {
    setEditingIndex(index);
    setEditingData({ ...customerDetails[index] });
  };

  const onSave = () => {
    const updated = [...customerDetails];
    updated[editingIndex] = editingData;
    setCustomerDetails(updated);
    localStorage.setItem("customerDetails", JSON.stringify(updated));
    setEditingIndex(null);
    setEditingData({});
  };

  // 📥 Export Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(customerDetails);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "CustomerDetails.xlsx");
  };

  // 📤 Import Excel
  const importFromExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      setCustomerDetails((prev) => {
        const merged = [...prev, ...data];
        localStorage.setItem("customerDetails", JSON.stringify(merged));
        return merged;
      });
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-3 text-center">Customer Details</h2>

      <div className="mb-3">
        <button
          onClick={exportToExcel}
          className="bg-green-500 text-white px-3 py-1 rounded me-3"
        >
          Download Data
        </button>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={importFromExcel}
          className="border p-1 rounded"
        />
        <p className="text-end mt-1 text-sm">* Excel file</p>
      </div>

      <table className="w-full border mt-2">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">First Name</th>
            <th className="border p-2">Last Name</th>
            <th className="border p-2">Service</th>
            <th className="border p-2">Unit</th>
            <th className="border p-2">Total Price</th>
            <th className="border p-2">Remark</th>
            <th className="border p-2">Remainder</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customerDetails.map((c, index) => (
            <tr key={index}>
              <td className="border p-2">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editingData.firstname}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        firstname: e.target.value,
                      })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  c.firstname
                )}
              </td>
              <td className="border p-2">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editingData.lastname}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        lastname: e.target.value,
                      })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  c.lastname
                )}
              </td>
              <td className="border p-2">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editingData.services}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        services: e.target.value,
                      })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  c.services
                )}
              </td>
              <td className="border p-2">
                {editingIndex === index ? (
                  <input
                    type="number"
                    value={editingData.unit}
                    onChange={(e) =>
                      setEditingData({ ...editingData, unit: e.target.value })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  c.unit
                )}
              </td>
              <td className="border p-2">
                {editingIndex === index ? (
                  <input
                    type="number"
                    value={editingData.totalPrice}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        totalPrice: e.target.value,
                      })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  c.totalPrice
                )}
              </td>
              <td className="border p-2">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editingData.remark}
                    onChange={(e) =>
                      setEditingData({ ...editingData, remark: e.target.value })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  c.remark
                )}
              </td>
              <td className="border p-2">
                {editingIndex === index ? (
                  <input
                    type="datetime-local"
                    value={editingData.remainder}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        remainder: e.target.value,
                      })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  c.remainder
                )}
              </td>
              <td className="border p-2 space-x-2">
                {editingIndex === index ? (
                  <button
                    onClick={onSave}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => onEdit(index)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => onDelete(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerDetails;
