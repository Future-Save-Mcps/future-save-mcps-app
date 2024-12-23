import { Box, Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import FormFieldComp from "../form/FormFieldComp";
import { useForm } from "react-hook-form";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "95vw",
    bgcolor: "background.paper",
    border: "none",
    outline: "none",
    px: 4,
    maxWidth:"530px",
    borderRadius:"20px",
  };

const ProfileContent = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
      setOpen(true);
    };
    const handleClose = () => setOpen(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();
    
      const onSubmit = (data) => {
        console.log(data);
      };
  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <div className="font-[600] text-[22px]">Profile</div>
          <button  onClick={handleOpen} className="border px-4 py-1 rounded-2xl">Edit</button>
        </div>
        <div className="flex flex-col mt-6 justify-center items-center gap-6">
          <div className="w-[130px] h-[130px] rounded-full flex justify-center items-center font-[600] bg-[#CD2280] text-[50px] text-[#fff]">
            W
          </div>
          <div className="text-[22px] font-[500]">Williams Elum</div>
        </div>

        <div className="p-6 mt-8">
          <div className="flex flex-wrap gap-12">
            <div className="max-w-[200px] w-[90vw]">
              <h3 className="font-bold">Gender</h3>
              <p>Male</p>
            </div>

            <div className="max-w-[200px] w-[90vw]">
              <h3 className="font-bold">Date of Birth</h3>
              <p>25/01/2001</p>
            </div>

            <div className="max-w-[200px] w-[90vw]">
              <h3 className="font-bold">Phone Number</h3>
              <p>09088776655</p>
            </div>

            <div className="max-w-[200px] w-[90vw]">
              <h3 className="font-bold">Email</h3>
              <p>williams@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <form
      onSubmit={handleSubmit(onSubmit)}
      className=" my-6  h-[100%] overflow-auto hide-scrollbar max-h-[80vh]"
    >
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>

      {/* First Name */}
      <FormFieldComp
        label="First Name"
        name="firstName"
        type="text"
        placeholder="Enter First Name"
        register={register}
        validation={{ required: "First Name is required" }}
        errors={errors}
      />

      {/* Last Name */}
      <FormFieldComp
        label="Last Name"
        name="lastName"
        type="text"
        placeholder="Enter Last Name"
        register={register}
        validation={{ required: "Last Name is required" }}
        errors={errors}
      />

      {/* Gender (Select) */}
      <FormFieldComp
        label="Gender"
        name="gender"
        type="select"
        register={register}
        validation={{ required: "Gender is required" }}
        errors={errors}
        options={[
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ]}
      />

      {/* Date of Birth */}
      <FormFieldComp
        label="Date of Birth"
        name="dob"
        type="date"
        register={register}
        validation={{ required: "Date of Birth is required" }}
        errors={errors}
        // icon={<FaCalendarAlt />}
      />

      {/* Phone Number */}
      <FormFieldComp
        label="Phone Number"
        name="phone"
        type="tel"
        placeholder="Enter Phone Number"
        register={register}
        validation={{
          required: "Phone Number is required",
          pattern: {
            value: /^[0-9]{10,11}$/,
            message: "Phone number must be 10-11 digits",
          },
        }}
        errors={errors}
      />

      {/* Email */}
      <FormFieldComp
        label="Email"
        name="email"
        type="email"
        placeholder="Enter Email Address"
        register={register}
        validation={{
          required: "Email is required",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: "Invalid email address",
          },
        }}
        errors={errors}
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-primary text-white py-3 mt-4 rounded-lg hover:bg-blue-600 transition"
      >
        Update
      </button>
    </form>
        </Box>
      </Modal>
    </>
  );
};

export default ProfileContent;
