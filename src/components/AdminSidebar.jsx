import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AccountIcon,
  ContributionIcon,
  DashboardIcon,
  LoanIcon,
  LogoutIcon,
  SettingsIcon,
  UserIcon,
} from "./icons/Icons";
import Logo from "../assets/logo.svg";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Modal, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
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

const AdminSideBar = ({ toggleSidebar }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpen(true);
    toggleSidebar();
  };
  const handleClose = () => setOpen(false);
  const handleLogout = () => {
    localStorage.clear();
    window.location.replace("/");
    // dispatch(setUser)
  };
  return (
    <>
      <div className=" text-white sticky p-4  w-fit bg-white  top-0 h-screen border md:border-none">
        <div
          onClick={toggleSidebar}
          className="absolute md:hidden right-[20px] top-[20px] rounded-full p-1 bg-[#fff]"
        >
          <CloseIcon className="text-primary" />
        </div>
        <div className=" w-72 flex flex-col gap-8  bg-[#F5F5F5] h-[100%] rounded-xl p-8">
          <div className="bg-white w-fit p-2 rounded-xl font-bold text-xl mb-6">
            <img src={Logo} alt="" />
          </div>

          <div className="flex flex-1 flex-col justify-between ">
            <div
              className="flex  flex-col gap-8
       "
            >
              <NavLink
                onClick={toggleSidebar}
                to="/admin"
                end
                className={({ isActive }) =>
                  `  py-3 font-[500] px-4 rounded-xl flex items-center gap-4 ${
                    isActive
                      ? "bg-white text-primary"
                      : "text-[#939393] hover:bg-[#e8efff]"
                  }`
                }
              >
                <DashboardIcon color="currentColor" />
                Dashboard
              </NavLink>

              <NavLink
                onClick={toggleSidebar}
                to="/admin/user_management"
                className={({ isActive }) =>
                  ` py-3 font-[500] px-4 rounded-xl flex items-center gap-4 ${
                    isActive
                      ? "bg-white text-primary"
                      : "text-[#939393] hover:bg-[#e8efff]"
                  }`
                }
              >
                <UserIcon color="currentColor" />
                User Management
              </NavLink>

              <NavLink
                onClick={toggleSidebar}
                to="/admin/savings_management"
                className={({ isActive }) =>
                  ` py-3 font-[500] px-4 rounded-xl flex items-center gap-4 ${
                    isActive
                      ? "bg-white text-primary"
                      : "text-[#939393] hover:bg-[#e8efff]"
                  }`
                }
              >
                <ContributionIcon color="currentColor" />
                Savings Management
              </NavLink>

              <NavLink
                onClick={toggleSidebar}
                to="/admin/loan_management"
                className={({ isActive }) =>
                  ` py-3 font-[500] px-4 rounded-xl flex items-center gap-4 ${
                    isActive
                      ? "bg-white text-primary"
                      : "text-[#939393] hover:bg-[#e8efff]"
                  }`
                }
              >
                <LoanIcon color="currentColor" />
                Loan Management
              </NavLink>

              <NavLink
                onClick={toggleSidebar}
                to="/admin/settings"
                className={({ isActive }) =>
                  ` py-3 font-[500] px-4 rounded-xl flex items-center gap-4 ${
                    isActive
                      ? "bg-white text-primary"
                      : "text-[#939393] hover:bg-[#e8efff]"
                  }`
                }
              >
                <SettingsIcon color="currentColor" />
                Settings
              </NavLink>
            </div>

            <div
              onClick={handleOpen}
              className={` py-3 cursor-pointer font-[500] px-4 rounded-xl flex items-center gap-4  
            text-[#fc242b] `}
            >
              <LogoutIcon color="#fc242b" />
              Log Out
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
            <button onClick={handleLogout} className="bg-[red] p-2 rounded-lg text-white">
              Yes, Continue
            </button>
            <button  onClick={handleClose}  className="border border-[red] p-2 rounded-lg text-[red]">
              Cancel
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default AdminSideBar;
