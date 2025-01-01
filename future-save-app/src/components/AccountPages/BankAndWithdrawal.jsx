

import { Box, Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import FormFieldComp from "../form/FormFieldComp";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";


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

const BankAndWithdrawal = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
      setOpen(true);
    };
    const handleClose = () => setOpen(false);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
      } = useForm();
    
      const onSubmit = (data) => {
        console.log(data);
      };
  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <div className="font-[600] text-[22px]">Bank & Withdrawal</div>
          <button  onClick={handleOpen} className="border px-4 py-1 rounded-2xl">Update</button>
        </div>
       

        <div className="p-6 mt-8">
          <div className="flex flex-wrap gap-12">
            <div className="max-w-[150px] w-[90vw]">
              <h3 className="font-bold">BVN</h3>
              <p>0000000000</p>
            </div>

            <div className="max-w-[150px] w-[90vw]">
              <h3 className="font-bold">Bank Name</h3>
              <p>Guarante Trust Bank</p>
            </div>

            <div className="max-w-[150px] w-[90vw]">
              <h3 className="font-bold">Account Number</h3>
              <p>09088776655</p>
            </div>

            <div className="max-w-[150px] w-[90vw]">
              <h3 className="font-bold">Account Name</h3>
              <p>Chinonso Williams</p>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <form
      onSubmit={handleSubmit(onSubmit)}
      className=" my-6  h-[100%] overflow-auto hide-scrollbar max-h-[80vh]"
    >


      <div className="flex justify-between mb-4 items-center">
      <h2 className="text-xl font-semibold ">Update Withdrawal Account</h2>
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
        setValue={setValue} 
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

export default BankAndWithdrawal;
