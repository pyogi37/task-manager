import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function HandleToken() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Function to get query params from the URL
    const getQueryParams = () => {
      const params = new URLSearchParams(location.search);
      const user = params.get("user");
      return user ? JSON.parse(decodeURIComponent(user)) : null;
    };

    // Extract the token from query params
    const user = getQueryParams();
    if (user) {
      // Save the user to localStorage as a JSON string
      localStorage.setItem("userInfo", JSON.stringify(user));
      navigate('/');
    } else {
      console.error("No user data found in query parameters");
    }
  }, [location.search, navigate]);

  return <div className="w-full bg-black">Hello</div>;
}

export default HandleToken;
