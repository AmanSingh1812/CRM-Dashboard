import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required!");
      return;
    }

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const uid = userCredential.user.uid;

      // Fetch Firestore user data
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError("Unauthorized user: no role found");
        auth.signOut();
        return;
      }

      const userData = { uid, ...userSnap.data() };

      setUser(userData); // update App state

      // Redirect based on role
      if (userData.role === "admin") navigate("/dashboard");
      else if (userData.role === "sales") navigate("/sales-dashboard");
      else {
        setError("Unauthorized user role");
        auth.signOut();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-blue-100 h-screen flex">
      <div
        style={{ padding: "20px" }}
        className="w-80 m-auto bg-white shadow-lg rounded-2xl p-8 w-96 "
      >
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4 text-xl">
          Login
        </h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="mt-2 mb-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400
"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="mt-2 mb-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400
"
          />
          <br />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition
"
          >
            Login
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
