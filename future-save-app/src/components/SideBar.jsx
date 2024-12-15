import React from "react";
import { NavLink } from "react-router-dom";
import {
  AccountIcon,
  ContributionIcon,
  DashboardIcon,
  LoanIcon,
  LogoutIcon,
} from "./icons/Icons";

const SideBar = () => {
  return (
    <div className=" w-72 flex flex-col  bg-primary h-[100%] rounded-xl p-8">
      <div className="text-white font-bold text-xl mb-6">
        Future Save MPCS LTD
      </div>

      <div
        
        className="flex flex-1 flex-col justify-between "
      >
        <div
          className="flex  flex-col gap-8
       "
        >
          <NavLink
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
  );
};

export default SideBar;
