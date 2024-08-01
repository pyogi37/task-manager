import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserState } from "../Context/UserProvider";
import axios from "axios";
import fa1 from "../assets/avatars/fa 1.svg";
import fa2 from "../assets/avatars/fa 2.svg";
import fa4 from "../assets/avatars/fa 4.svg";
import fa5 from "../assets/avatars/fa 5.svg";
import ma1 from "../assets/avatars/ma 1.svg";
import ma2 from "../assets/avatars/ma 2.svg";
import ma3 from "../assets/avatars/ma 3.svg";
import ma4 from "../assets/avatars/ma 4.svg";
import ma5 from "../assets/avatars/ma 5.svg";
import defaulta from "../assets/avatars/chicken.svg";
import { toast } from "react-toastify";

const avatars = [fa1, fa2, fa4, fa5, ma1, ma2, ma3, ma4, ma5, defaulta];

const Profile = () => {
  const { user, setUser } = UserState() || {};
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(user?.avatar || avatars[9]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatar(avatars[9]);
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.patch(
        "/api/v1/users/profile",
        { name, avatar },
        config
      );

      if (response.data) {
        localStorage.setItem(
          "avatar",
          JSON.stringify(response.data.data.user.avatar)
        );
        navigate("/");
        toast.success("Profile updated");
      }
    } catch (error) {
      toast.error(`Error occurred: ${error.response.data.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col w-full h-full items-center p-6 m-auto">
      <h1 className="text-2xl font-semibold mb-4">Edit Profile</h1>
      <div className="w-full max-w-md">
        <div className="mb-4 flex items-center">
          <img
            src={avatar || avatars[9]}
            alt="Avatar"
            className="w-16 h-16 rounded-full object-cover mr-4"
          />
          <div className="flex space-x-2">
            {avatars.map((avatarOption, index) => (
              <img
                key={index}
                src={avatarOption}
                alt={`Avatar ${avatarOption + 1}`}
                onClick={() => setAvatar(avatarOption)}
                className={`w-8 h-8 cursor-pointer rounded-full border-2 ${
                  avatar === avatarOption
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-4 py-2 text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
