import { Box, Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import FormFieldComp from "../form/FormFieldComp";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { fetchAndStoreUserData } from "../../utils/authUtil";
import { useApiPatch } from "../../hooks/useApi";
import FormButton from "../FormBtn";
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

const ProfileContent = ({ userData, refetch }) => {
  console.log(userData);
  const { patch, isLoading } = useApiPatch();
  // api/user
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

  const onSubmit = async (data) => {
    const result = await patch(`user`, data);
    if (result.success && result.data) {
      fetchAndStoreUserData();
      refetch();
      handleClose();
    }
  };

  const getBvnVerificationStatus = (status) => {
    if (status === true) {
      return <span className="text-green-500 font-semibold">Verified</span>;
    } else if (status === false) {
      return (
        <span className="text-red-500 font-semibold">Verification Failed</span>
      );
    } else {
      return (
        <span className="text-yellow-500 font-semibold">
          Pending Verification
        </span>
      );
    }
  };
  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <div className="font-[600] text-[22px]">Profile</div>
          <button onClick={handleOpen} className="border px-4 py-1 rounded-2xl">
            Edit
          </button>
        </div>
        <div className="flex flex-col mt-6 justify-center items-center gap-6">
          <div className="w-[130px] h-[130px] rounded-full flex justify-center items-center font-[600] bg-[#CD2280] text-[50px] text-[#fff]">
            {userData?.data?.firstName.charAt(0)}
          </div>
          <div className="text-[22px] font-[500]">
            {(userData?.data?.lastName || "--") +
              " " +
              (userData?.data?.firstName || "--")}
          </div>
        </div>

        <div className="p-6 mt-8">
          <div className="flex flex-wrap gap-12">
            <div className="max-w-[200px] w-[90vw]">
              <h3 className="font-bold">Gender</h3>
              <p>{userData?.data?.gender || "---"}</p>
            </div>

            <div className="max-w-[200px] w-[90vw]">
              <h3 className="font-bold">Date of Birth</h3>
              <p>{userData?.data?.dateOfBirth || "---"}</p>
            </div>

            <div className="max-w-[200px] w-[90vw]">
              <h3 className="font-bold">Phone Number</h3>
              <p>{userData?.data?.phoneNumber || "---"}</p>
            </div>

            <div className="max-w-[200px] w-[90vw]">
              <h3 className="font-bold">Email</h3>
              <p>{userData?.data?.email || "---"}</p>
            </div>

            <div className="max-w-[200px] w-[90vw]">
              <h3 className="font-bold">BVN Verification Status</h3>
              <p>{getBvnVerificationStatus(userData?.data?.isBVNVerified)}</p>
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Profile Settings</h2>
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
              defaultValueAttachment={userData?.data?.firstName}
              setValue={setValue}
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
              defaultValueAttachment={userData?.data?.lastName}
              setValue={setValue}
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
              defaultValueAttachment={userData?.data?.gender}
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
              defaultValueAttachment={userData?.data?.dateOfBirth}
              setValue={setValue}
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              register={register}
              validation={{ required: "Date of Birth is required" }}
              errors={errors}
              // icon={<FaCalendarAlt />}
            />

            {/* Phone Number */}
            <FormFieldComp
              defaultValueAttachment={userData?.data?.phoneNumber}
              setValue={setValue}
              label="Phone Number"
              name="phoneNumber"
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

            {/* Submit Button */}
            {/* <button
              type="submit"
              className="w-full bg-primary text-white py-3 mt-4 rounded-lg hover:bg-blue-600 transition"
            >
              Update
            </button> */}

            <FormButton
              isLoading={isLoading}
              type="submit"
              text="Update"
              width="100%"
            />
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default ProfileContent;
