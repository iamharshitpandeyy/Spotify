import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CREATE_NEW_USER_API } from "../components/API";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function registerUser(username, email, password) {
  return fetch(CREATE_NEW_USER_API, {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });
}

const UserRegister = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const userRegisterAPI = async () => {
    try {
      const response = await registerUser(username, email, password);
      const { status, message } = await response.json();
      if (status) {
        navigate("/");
        toast.success("User Registered!", { autoClose: 2000 });
      } else {
        toast.success(message, { autoClose: 2000 });
      }
    } catch (e) {}
  };

  return (
    <div className="flex flex-col w-full justify-start items-start p-12 pt-10 pr-24  transition-all duration-150">
      <div className="w-5/12 self-center bg-white shadow-2xl p-10 rounded-xl relative mt-14">
        <h1 className="mb-4 text-xl tracking-wide">User Registration</h1>
        <div className="flex flex-col w-full justify-between items-start">
          <label>Username</label>
          <input
            className="w-full mb-4 rounded-lg border border-gray-300 px-6 py-2 mt-1"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
          <label>E-mail</label>
          <input
            className="w-full mb-4 rounded-lg border border-gray-300 px-6 py-2 mt-1"
            type="text"
            placeholder="Enter your email id"
            value={email}
            required={true}
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
              onClick={() => userRegisterAPI()}
            >
              Register
            </button>
          </div>
          <p className="self-center mt-5 mb-5">OR</p>
          <Link to="/" className="self-center mr-auto ml-auto">
            <button>Already a user? Login</button>
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserRegister;
