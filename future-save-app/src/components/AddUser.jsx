import React from "react";
import { Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AddUser = ({ open, setOpen, onUserAdded }) => {
  if (!open) return null; // Hide modal if not open

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onUserAdded(); // Trigger success modal
  };
  const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "95vw",
    bgcolor: "white",
    border: "none",
    outline: "none",
    p: 4,
    maxWidth: "500px",
    borderRadius: "20px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <Box sx={style}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add User</h2>
          <CloseIcon
            onClick={handleClose}
            sx={{
              cursor: "pointer",
              padding: "5px",
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              backgroundColor: "#F8F8FA",
            }}
          />
        </div>

        {/* Add User Form */}
        <form onSubmit={handleSubmit}>
          <label htmlFor="">
            First Name
          <input
            type="text"
            placeholder="Enter user first name"
            className="w-full p-2 border rounded-md mb-4"
          />

          </label>
          <label htmlFor="">
            Last Name
          <input
            type="text"
            placeholder="Enter user last name"
            className="w-full p-2 border rounded-md mb-4"
          />

          </label>
          <label htmlFor="">
            Phone number
          <input
            type="text"
            placeholder="Enter user phone number"
            className="w-full p-2 border rounded-md mb-4"
          />

          </label>
          <label htmlFor="">
            Email Address
          <input
            type="text"
            placeholder="Enter user email address"
            className="w-full p-2 border rounded-md mb-4"
          />

          </label>
          <button
            type="submit"
            className="w-full bg-[#041F62] text-white py-2 rounded-md"
          >
            Add User
          </button>
        </form>
      </Box>
    </div>
  );
};

export default AddUser;
