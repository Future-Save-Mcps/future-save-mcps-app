import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Bell from "../assets/bellIcon.svg";
import { Box, Drawer, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getUserData } from "../utils/getUserData";
import { useApiGet, useApiPatch } from "../hooks/useApi";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { LogoutIcon, SettingsIcon, UserIcon } from "./icons/Icons";
import FormFieldComp from "./form/FormFieldComp";
import FormButton from "./FormBtn";
import { useForm } from "react-hook-form";
import { DollarSign, Target, User } from "lucide-react";
import clsx from "clsx";
import NotificationsComponent from "./Notification";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: 400,
  bgcolor: "background.paper",
  border: "none",
  outline: "none",
  p: 4,
  borderRadius: 2,
};

const AdminNavbar = ({ refresh }) => {
  const notificationsData = [
    {
      id: 1,
      name: "Festus Chinonso",
      message: "Created a savings plan",
      type: "target",
      read: false,
      time: "5hrs ago",
    },
    {
      id: 2,
      name: "Chekube Rita",
      message: "applied for a loan",
      type: "dollar",
      read: false,
      time: "5hrs ago",
    },
    {
      id: 3,
      name: "Williams Chinonso",
      message: "created an account",
      type: "user",
      read: true,
      time: "5hrs ago",
    },
    {
      id: 4,
      name: "Williams Chinonso",
      message: "created an account",
      type: "dollar",
      read: false,
      time: "5hrs ago",
    },
  ];

  const iconMap = {
    target: <Target className="w-5 h-5" />,
    dollar: <DollarSign className="w-5 h-5" />,
    user: <User className="w-5 h-5" />,
  };

  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [notifications, setNotifications] = useState(notificationsData);

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "Read") return notification.read;
    if (filter === "Unread") return !notification.read;
    return true;
  });

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, read: !notification.read }
          : notification
      )
    );
  };
  const location = useLocation();
  const { patch, isLoadingPatch } = useApiPatch();
 const {
    data: userNotif,
    isLoading: isLoadingUserNotif,
    error: errorNotif,
    refetch: refetchNotif,
  } = useApiGet("user/notification/all?PageNumber=1&PageSize=10000");

  const [state, setState] = useState(false);
  const { data: userData, isLoading, error, refetch } = useApiGet("user");
  console.log(userData?.data);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleOpen = () => {
    setOpen(true);
    toggleSidebar();
  };
  const handleClose = () => setOpen(false);

  const [openProfile, setOpenProfile] = useState(false);

  const handleOpenProfile = () => {
    setOpenProfile(true);
  };
  const handleCloseProfile = () => {
    setOpenProfile(false);
    setOpenEdit(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.replace("/");
    // dispatch(setUser)
  };

  useEffect(() => {
    refetch();
  }, [refresh]);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState(open);
  };
  const onSubmit = async (data) => {
    const result = await patch(`user`, data);
    if (result.success && result.data) {
      fetchAndStoreUserData();
      refetch();
      handleClose();
    }
  };

  function areAllNotificationsRead(notifications) {
    if (notifications?.length === 0) return true;
    return notifications?.every((notification) => notification.isRead);
  }

  const getGreetingText = () => {
    switch (location.pathname) {
      case "/admin":
        return `Hello, ${userData?.data?.firstName}`; // Default or Dashboard greeting
      case "/admin/user_management":
        return "User Management";
      case "/admin/savings_management":
        return "Savings Management";
      case "/admin/loan_management":
        return "Loan Management";
      case "/admin/settings":
        return "Settings";
      default:
        return "Welcome!";
    }
  };

  return (
    <>
      <div className="flex w-[100%] md:p-4 py-4 md:pt-[60px]  justify-between items-center pr-4  pl-[50px] bg-white">
        <div className="text-[24px] font-[600]">{getGreetingText()}</div>
        <div className="flex items-center space-x-4">
          {/* {location.pathname === "/user" && (
            <div>Hope you are doing great!</div>
          )} */}
          <div className="flex items-center justify-center gap-8">
            <div className="relative">
              <img
                onClick={toggleDrawer(true)}
                className=" cursor-pointer"
                src={Bell}
                alt=""
              />
 {!areAllNotificationsRead(userNotif?.data?.items) && (
                <div className="absolute w-[10px] h-[10px] right-0 rounded-full top-0 bg-[#FF5555] border-2 border-white"></div>
              )}            </div>

            <Popover>
              <PopoverTrigger asChild>
                <div className="bg-[#CD2280] cursor-pointer  rounded-full p-2">
                  <span className="text-sm aspect-square h-[2.5em] text-white flex items-center justify-center">
                    {userData?.data?.firstName.charAt(0)}
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-fit p-2">
                <div
                  onClick={handleOpenProfile}
                  className="flex  gap-6 py-3 px-4 text-base font-medium mb-2 hover:bg-[#fdf8f8]"
                >
                  <UserIcon color="currentColor" /> Profile
                </div>
                <div
                  onClick={() => navigate("/admin/settings")}
                  className="flex  gap-6 py-3 px-4 text-base font-medium mb-2 hover:bg-[#fdf8f8]"
                >
                  <SettingsIcon color="currentColor" /> Account Settings
                </div>
                <div
                  onClick={handleOpen}
                  className="flex  gap-6 py-3 px-4 text-[#fc242b] text-base font-medium mb-2 hover:bg-[#fdf8f8]"
                >
                  <LogoutIcon color="#fc242b" /> Logout
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <Drawer anchor="right" open={state}>
        <div className="p-4 w-[100vw] max-w-[500px]">
          <div className=" flex justify-between items-center ">
            <h2 className="text-[24px] font-[700]">Notificactions</h2>
            <CloseIcon
              onClick={toggleDrawer(false)}
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
                  <NotificationsComponent mockData={userNotif} refetch={refetchNotif} />
        
        </div>
      </Drawer>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="w-14 h-14 rounded-full m-auto bg-[#f7e2e2] border  flex justify-center items-center">
            <LogoutIcon color="red" />
          </div>
          <h2 className="m-auto font-semibold text-2xl text-center mt-4">
            Logout
          </h2>
          <p className="m-auto text-center mt-2">
            Are you sure you want to logout?
          </p>
          <div className="flex flex-col gap-6 mt-6">
            <button
              onClick={handleLogout}
              className="bg-[red] p-2 rounded-lg text-white"
            >
              Yes, Continue
            </button>
            <button
              onClick={handleClose}
              className="border border-[red] p-2 rounded-lg text-[red]"
            >
              Cancel
            </button>
          </div>
        </Box>
      </Modal>

      <Modal
        open={openProfile}
        onClose={handleCloseProfile}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {openEdit ? (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="  h-[100%] overflow-auto hide-scrollbar max-h-[80vh]"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Profile</h2>
                <CloseIcon
                  onClick={handleCloseProfile}
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

              {/* <FormFieldComp
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
            /> */}

              {/* <FormFieldComp
              defaultValueAttachment={userData?.data?.dateOfBirth}
              setValue={setValue}
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              register={register}
              validation={{ required: "Date of Birth is required" }}
              errors={errors}
            /> */}

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

              <FormButton
                isLoading={isLoadingPatch}
                type="submit"
                text="Update"
                width="100%"
              />
            </form>
          ) : (
            <div>
              <div className="flex justify-between items-center">
                <div className="font-[600] text-[22px]">Profile</div>
                <button
                  onClick={() => setOpenEdit(true)}
                  className="border px-4 py-1 rounded-2xl"
                >
                  Edit
                </button>
              </div>
              <div className="flex mt-6 justify-center items-start gap-8">
                <div className="w-[80px] h-[80px] rounded-full flex justify-center items-center font-[600] bg-[#CD2280] text-[30px] text-[#fff]">
                  {userData?.data?.firstName.charAt(0)}
                </div>

                <div className=" flex-1  ">
                  <div className=" flex flex-col flex-wrap gap-6">
                    <div className=" ">
                      <h3 className="font-bold">Name</h3>
                      <p>
                        {" "}
                        {(userData?.data?.lastName || "--") +
                          " " +
                          (userData?.data?.firstName || "--")}
                      </p>
                    </div>

                    <div className=" ">
                      <h3 className="font-bold">Email</h3>
                      <p>{userData?.data?.email || "---"}</p>
                    </div>

                    <div className=" ">
                      <h3 className="font-bold">Phone Number</h3>
                      <p>{userData?.data?.phoneNumber || "---"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default AdminNavbar;
