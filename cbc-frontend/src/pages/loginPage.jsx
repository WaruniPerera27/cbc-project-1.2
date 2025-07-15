import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function login(e) {
    e.preventDefault(); // stop form reload
    console.log(email, password);

    axios.post("http://localhost:5000/user/login", {
      email: email,
      password: password
    }).then(
      (response) => {
        console.log(response.data);
        localStorage.setItem("token", response.data.token);

        toast.success("Login successful");

        if (response.data.role === "admin") {
          navigate("/admin/*"); // Correct usage
        } else if (response.data.role === "user") {
          navigate("/"); // Correct usage
        } else {
          toast.error("Invalid role");
        }
      }
    ).catch(
      (error) => {
        console.error(error);
        toast.error("Login failed. Please check your credentials and try again.");
      }
    )
  }

  return (
    <div className="w-full h-screen bg-[url(./loginbg1.jpg)] bg-cover bg-center flex justify-center items-center">
      <div className="w-[500px] h-[500px] backdrop-blur-sm shadow-2xl rounded-[30px] flex flex-col justify-center p-8">
        <h1 className="text-5xl font-bold text-center mb-6 text-amber-50">Login</h1>
        <form className="space-y-6" onSubmit={login}>
          <div>
            <label className="block text-amber-50 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-amber-50 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-400 text-white font-semibold py-3 rounded-xl hover:bg-amber-500 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-center text-amber-50 mt-4">
          Don't have an account? <Link className="underline" to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
