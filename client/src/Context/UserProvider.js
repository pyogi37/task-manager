import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo.data);
      // Redirect if user is already logged in and trying to access login page
      if (location.pathname === "/") {
        navigate("/home");
      }
    } else {
      // Redirect if no userInfo and trying to access protected page
      if (location.pathname !== "/" && location.pathname !== "/profile") {
        navigate("/");
      }
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const response = await axios.get("/api/v1/users/boards", config);
        if (response.data) {
          setBoards(response.data.data.boards);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (user) fetchBoards();
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        tasks,
        setTasks,
        boards,
        setBoards,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserState = () => {
  return useContext(UserContext);
};

export default UserProvider;
