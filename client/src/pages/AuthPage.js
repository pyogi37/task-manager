import Login from "../components/Login";
import Signup from "../components/Signup";
import { useState } from "react";

const AuthPage = () => {
  const [tab, setTab] = useState("login");

  return (
    <div className=" mx-auto p-4 w-3/5">
      <div className="flex p-3 bg-white my-10 rounded-lg border border-gray-200 justify-center items-center">
        <h1 className="text-4xl font-sans text-black">Task Manager</h1>
      </div>

      <div className="bg-white w-full p-6 rounded-lg border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            className={`w-1/2 py-2 text-lg font-semibold ${
              tab === "login"
                ? "border-b-2 border-purple-500 text-purple-500"
                : "text-gray-600"
            }`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`w-1/2 py-2 text-lg font-semibold ${
              tab === "signup"
                ? "border-b-2 border-purple-500 text-purple-500"
                : "text-gray-600"
            }`}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </button>
        </div>
        <div className="py-4">{tab === "login" ? <Login /> : <Signup />}</div>
      </div>
    </div>
  );
};

export default AuthPage;
