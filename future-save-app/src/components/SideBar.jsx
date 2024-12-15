import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  AccountIcon,
  ContributionIcon,
  DashboardIcon,
  LoanIcon,
  LogoutIcon,
} from "./icons/Icons";
import Logo from "../assets/logo.svg";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Modal, Typography } from "@mui/material";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "none",
  outline: "none",
  p: 4,
};

const SideBar = ({ toggleSidebar }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    toggleSidebar();
  };
  const handleClose = () => setOpen(false);
  return (
    <>
      <div className=" text-white sticky p-4  w-fit bg-white  top-0 h-screen border md:border-none">
        <div
          onClick={toggleSidebar}
          className="absolute md:hidden right-[20px] top-[20px] rounded-full p-1 bg-[#fff]"
        >
          <CloseIcon className="text-primary" />
        </div>
        <div className=" w-72 flex flex-col gap-8  bg-primary h-[100%] rounded-xl p-8">
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
                to="/user"
                end
                className={({ isActive }) =>
                  `  py-3 font-[500] px-4 rounded-xl flex items-center gap-4 ${
                    isActive
                      ? "bg-white text-primary"
                      : "text-white hover:bg-[#1e3774]"
                  }`
                }
              >
                <DashboardIcon color="currentColor" />
                Dashboard
              </NavLink>

              <NavLink
                onClick={toggleSidebar}
                to="/user/contribution_plan"
                className={({ isActive }) =>
                  ` py-3 font-[500] px-4 rounded-xl flex items-center gap-4 ${
                    isActive
                      ? "bg-white text-primary"
                      : "text-white hover:bg-[#1e3774]"
                  }`
                }
              >
                <ContributionIcon color="currentColor" />
                Contribution Plan
              </NavLink>

              <NavLink
                onClick={toggleSidebar}
                to="/user/loan_management"
                className={({ isActive }) =>
                  ` py-3 font-[500] px-4 rounded-xl flex items-center gap-4 ${
                    isActive
                      ? "bg-white text-primary"
                      : "text-white hover:bg-[#1e3774]"
                  }`
                }
              >
                <LoanIcon color="currentColor" />
                Loan Management
              </NavLink>

              <NavLink
                onClick={toggleSidebar}
                to="/user/account"
                className={({ isActive }) =>
                  ` py-3 font-[500] px-4 rounded-xl flex items-center gap-4 ${
                    isActive
                      ? "bg-white text-primary"
                      : "text-white hover:bg-[#1e3774]"
                  }`
                }
              >
                <AccountIcon color="currentColor" />
                Account
              </NavLink>
            </div>

            <div
              onClick={handleOpen}
              className={` py-3 font-[500] px-4 rounded-xl flex items-center gap-4  
            text-white hover:bg-[#1e3774]`}
            >
              <LogoutIcon color="white" />
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default SideBar;
