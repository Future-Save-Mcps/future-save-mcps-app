import React from "react";
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
const SideBar = ({ toggleSidebar }) => {
  return (
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
            to="/logout"
            className={` py-3 font-[500] px-4 rounded-xl flex items-center gap-4  
            text-white hover:bg-[#1e3774]`}
          >
            <LogoutIcon color="white" />
            Log Out
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
