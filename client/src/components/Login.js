import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import google from "../assets/google.svg";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);

    if (!email || !password) {
      toast.error("Please fill all the fields");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const userData = {
        email,
        password,
      };

      const response = await axios.post(
        `/api/v1/users/create-session`,
        userData,
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(response.data));

      toast.success("Login Successful");

      setLoading(false);
      navigate("/home");
    } catch (error) {
      console.error(error.message);
      toast.error(`Error Occurred: ${error.response.data.message}`);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      window.open(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/google", "_self`);
    } catch (error) {
      console.error(error);
      toast.error(`Error Occurred: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="w-full max-w-sm">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          placeholder="Enter your email address"
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="w-full max-w-sm">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={handleClick}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <button
        onClick={submitHandler}
        disabled={loading}
        className={`w-3/5 px-4 py-2 text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <div className="w-full max-w-sm flex justify-center">
        <div className="cursor-pointer" onClick={handleGoogleLogin}>
          <img src={google} alt="Google" className="w-8 h-8 mt-2 " />
        </div>
      </div>
    </div>
  );
};

export default Login;
