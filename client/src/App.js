import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./index.css";
import AuthPage from "./pages/AuthPage";
import Homepage from "./pages/Homepage";
import HandleToken from "./helpers/HandleToken";
import { UserState } from "./Context/UserProvider";
import { closestCorners, DndContext } from "@dnd-kit/core";
import Profile from "./components/Profile";

function App() {
  const { user } = UserState();
  return (
    <div className="App">
        <DndContext collisionDetection={closestCorners}>
          <Routes>
            <Route path="/" Component={AuthPage}></Route>
            <Route path="/home" Component={Homepage}></Route>
            <Route path="/handle-token" Component={HandleToken}></Route>
            <Route path="/profile" Component={Profile}></Route>
          </Routes>
        </DndContext>
    </div>
  );
}

export default App;
