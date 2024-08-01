import { useState } from "react";
import avatar1 from "../assets/avatar1.png"; 
import avatar2 from "../assets/avatar2.png"; 
import Modal from "./Modal";

const avatars = [avatar1, avatar2]; // Add more avatar images as needed

const AvatarModal = ({ show, onHide, onSelect }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Choose Your Avatar</Modal.Title>
      </Modal.Header>
      <Modal.Body className="flex flex-wrap gap-4 justify-center">
        {avatars.map((avatar, index) => (
          <img
            key={index}
            src={avatar}
            alt={`Avatar ${index + 1}`}
            className="w-20 h-20 cursor-pointer border-2 border-transparent hover:border-blue-500"
            onClick={() => onSelect(avatar)}
          />
        ))}
      </Modal.Body>
    </Modal>
  );
};

export default AvatarModal;
