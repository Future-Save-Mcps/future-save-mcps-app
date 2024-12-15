import React from "react";
import { useLocation } from "react-router-dom";
import Bell from "../assets/bellIcon.svg";
import { Drawer } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Navbar = () => {
  const location = useLocation();
  const [state, setState] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState(open);
  };

  const getGreetingText = () => {
    switch (location.pathname) {
      case "/user":
        return "Hello Williams"; // Default or Dashboard greeting
      case "/user/contribution_plan":
        return "Contribution Plans";
      case "/user/loan_management":
        return "Loan Management";
      case "/user/account":
        return "Account";
      default:
        return "Welcome!";
    }
  };

  return (
    <>
      <div className="flex w-[100%] md:p-4 py-4 md:pt-[60px]  justify-between items-center pr-4  pl-[50px] bg-white">
        <div className="text-lg font-semibold">{getGreetingText()}</div>
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
              <div className="absolute w-[10px] h-[10px] right-0 rounded-full top-0 bg-[#FF5555] border-2 border-white"></div>
            </div>
            <div className="bg-[#CD2280]  rounded-full p-2">
              <span className="text-sm aspect-square h-[2.5em] text-white flex items-center justify-center">
                W
              </span>
            </div>
          </div>
        </div>
      </div>
      <Drawer anchor="right" open={state} >
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
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;
