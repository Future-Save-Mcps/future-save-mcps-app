import { Modal, Box } from "@mui/material";
import FormFieldComp from "./form/FormFieldComp";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useApiPatch } from "@/hooks/useApi";
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
  maxWidth: "530px",
  borderRadius: "20px",
};

const ProfileModal = ({ open, onClose }) => {
  const { patch, isLoading } = useApiPatch();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const result = await patch(`user`, data);
    if (result.success && result.data) {
      fetchAndStoreUserData();
      refetch();
      handleClose();
    }
  };

  return (
    <div className="">
      <Modal
       open={open}
       onClose={onClose}
       aria-labelledby="modal-modal-title"
       aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className=" my-6  h-[100%] overflow-auto hide-scrollbar max-h-[80vh]"
          >
            <div className="flex justify-between mb-4 items-center">
              <h2 className="text-xl font-semibold ">Profile Settings</h2>
              <CloseIcon
                onClick={onClose}
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
            {/* <FormFieldComp
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
 */}
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
    </div>
  );
};

export default ProfileModal;
