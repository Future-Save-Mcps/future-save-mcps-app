import React, { useState } from "react";
import { Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useApiPost } from "@/hooks/useApi";
import { useSelector } from "react-redux";

const AddUser = ({ open, setOpen, onUserAdded }) => {
  const { post, isLoading } = useApiPost();
const token = localStorage.getItem("accessToken")
console.log(token);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({});

  if (!open) return null; // Hide modal if not open

  const handleClose = () => {
    setOpen(false);
    setErrors({}); // Clear errors on close
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error when user starts typing
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    else if (!/^\d{10,15}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Phone number must be between 10-15 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Form is valid if there are no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop if validation fails

    try {
      const result = await post("admin/user-by-admin", {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        emailAddress: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (result.success && result.data) {
        onUserAdded();
        setOpen(false);
        setFormData({ firstName: "", lastName: "", email: "", phoneNumber: "" });
        setErrors({}); // Clear errors on success
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
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
          <label>
            First Name
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter user first name"
              className="w-full p-2 border rounded-md mb-1"
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          </label>

          <label>
            Last Name
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter user last name"
              className="w-full p-2 border rounded-md mb-1"
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
          </label>

          <label>
            Phone number
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter user phone number"
              className="w-full p-2 border rounded-md mb-1"
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
          </label>

          <label>
            Email Address
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter user email address"
              className="w-full p-2 border rounded-md mb-1"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </label>

          <button
            type="submit"
            className="w-full bg-[#041F62] text-white py-2 rounded-md mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add User"}
          </button>
        </form>
      </Box>
    </div>
  );
};

export default AddUser;
