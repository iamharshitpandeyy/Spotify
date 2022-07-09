import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LOGIN_USER_API } from "../components/API";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function loginUser(email, password) {
  return fetch(LOGIN_USER_API, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUserAPI = async (url) => {
    try {
      const response = await loginUser(email, password);
      const { status, message, token } = await response.json();
      if (status) {
        await localStorage.setItem("deltaxusertoken", token);
        navigate("/home");
        toast.success("User Login!", { autoClose: 2000 });
      } else {
        toast.success(message, { autoClose: 2000 });
      }
    } catch (e) {}
  };

  return (
    <div className="flex flex-col w-full justify-start items-start p-12 pt-10 pr-24  transition-all duration-150">
      <div className="w-5/12 self-center bg-white shadow-2xl p-10 rounded-xl relative mt-14">
        <h1 className="mb-4 text-xl tracking-wide">
          User Login to your account
        </h1>
        <div className="flex flex-col w-full justify-between items-start">
          <label>E-mail</label>
          <input
            className="w-full mb-4 rounded-lg border border-gray-300 px-6 py-2 mt-1"
            type="text"
            placeholder="Enter your email id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            className="w-full rounded-lg border border-gray-300 px-6 py-2 mt-1"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex flex-col w-full justify-between items-center px-4">
            <button
              className="w-full bg-blue-600 rounded-md hover:bg-blue-700 text-white font-semibold rounded-xl px-6 py-3 mt-8"
              onClick={() => loginUserAPI()}
            >
              LOGIN
            </button>
          </div>
          <p className="self-center mt-5 mb-5">OR</p>
          <Link to="/signup" className="self-center mr-auto ml-auto">
            <button>New user? Register</button>
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
