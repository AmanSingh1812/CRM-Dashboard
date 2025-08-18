import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const servicePrices = {
  transaction_Sms: 1.5,
  promotion_Sms: 1,
  official_Whatsapp: 2,
  vertual_Whatsapp: 2.5,
  voice_Call: 3,
  ivr: 4,
  digital_Marketing: 5,
};

function AddCustomerDetails({ setCustomerDetails, customerDetails }) {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    const existing = Array.isArray(customerDetails) ? customerDetails : [];

    // price * unit
    const unit = parseInt(data.unit) || 0;
    const price = servicePrices[data.services] || 0;
    const totalPrice = unit * price;

    const updated = [...existing, { ...data, totalPrice }];

    setCustomerDetails(updated);
    localStorage.setItem("customerDetails", JSON.stringify(updated));

    reset();

    // ✅ Navigate to Customer Details page
    navigate("/customerdetails");
  };

  return (
    <div className="text-center mt-3 w-200 m-auto rounded bg-gray-50 p-5">
      <h1 className="font-black mt-2">Customer Detail Form</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="m-auto mt-2 p-5">
        <div className="flex justify-evenly">
          <div>
            <label>First Name: </label>
            <br />
            <input
              placeholder="First Name"
              {...register("firstname")}
              className="border p-1"
            />
          </div>
          <div>
            <label>Last Name: </label>
            <br />
            <input
              placeholder="Last Name"
              {...register("lastname")}
              className="border p-1"
            />
          </div>
          <div>
            <label>DOB: </label>
            <br />
            <input type="date" {...register("dob")} className="border p-1" />
          </div>
        </div>

        <div className="flex justify-evenly">
          <div>
            <label>Phone Number:</label>
            <br />
            <input
              placeholder="Phone number"
              {...register("phonenumber")}
              className="border p-1"
            />
          </div>
          <div>
            <label>Email:</label>
            <br />
            <input
              placeholder="Email"
              {...register("emailid")}
              className="border p-1"
            />
          </div>
        </div>

        <div className="flex justify-evenly">
          <div>
            <select {...register("services")} className="border-1 mt-5">
              <option value="">Services</option>
              <option value="transaction_Sms">Transaction SMS</option>
              <option value="promotion_Sms">Promotion SMS</option>
              <option value="official_Whatsapp">Official Whatsapp</option>
              <option value="vertual_Whatsapp">Vertual Whatsapp</option>
              <option value="voice_Call">Voice Call</option>
              <option value="ivr">IVR</option>
              <option value="digital_Marketing">Digital Marketing</option>
            </select>
          </div>
          <div>
            <label>Unit</label>
            <br />
            <input
              type="number"
              placeholder="Total Unit"
              {...register("unit")}
              className="border p-1"
            />
          </div>
        </div>

        <div className="flex justify-evenly">
          <div className="mt-2">
            <label>Remark: </label>
            <br />
            <input
              placeholder="Remark"
              {...register("remark")}
              className="border p-1"
            />
          </div>
          <div className="mt-2">
            <label>Remainder: </label>
            <br />
            <input
              type="datetime-local"
              {...register("remainder")}
              className="border p-1"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-cyan-300 p-2 rounded-2xl w-50 text-white font-black mt-5"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
export default AddCustomerDetails;
