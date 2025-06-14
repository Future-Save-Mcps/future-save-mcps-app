import { Box, Modal } from "@mui/material";
import React, { useState } from "react";
import FormFieldComp from "./form/FormFieldComp";
import { useApiPost } from "@/hooks/useApi";
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
  maxWidth: "530px",
  borderRadius: "20px",
};

const PasswordModal = ({open, onClose}) => {
  const { post } = useApiPost();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await post("/auth/change-password", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      if (!response.ok) {
        const error = await response;
        setErrorMsg(error.message || "Failed to update password");
        return;
      }

      setSuccessMsg("Password updated successfully");
      reset();
    } catch (error) {
      setErrorMsg("An error occurred: " + error.message);
    }
  };

  return (
    <div>
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
              <h2 className="text-xl font-semibold ">Password Settings</h2>
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

            <div className="grid gap-4">
              <FormFieldComp
                label="Current Password"
                name="oldPassword"
                type="password"
                placeholder="current password"
                register={register}
                validation={{
                  required: "Current password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                errors={errors}
              />

              <FormFieldComp
                label="New Password"
                name="newPassword"
                type="password"
                placeholder="new password"
                register={register}
                validation={{
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                errors={errors}
              />

              <FormFieldComp
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="confirm password"
                register={register}
                validation={{
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === getValues("newPassword") ||
                    "Passwords do not match",
                }}
                errors={errors}
              />
            </div>

            <div className="mt-4">
              <button
                className="w-full bg-[#041F62] rounded-lg py-4 text-white text-2xl"
                type="submit"
              >
                Update
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default PasswordModal;
