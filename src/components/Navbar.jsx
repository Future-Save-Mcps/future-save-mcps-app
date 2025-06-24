import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Bell from "../assets/bellIcon.svg";
import { Drawer } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getUserData } from "../utils/getUserData";
import { useApiGet } from "../hooks/useApi";
import NotificationsComponent from "./Notification";

const Navbar = ({ refresh }) => {
  const location = useLocation();
  const [state, setState] = React.useState(false);
  const { data: userData, isLoading, error, refetch } = useApiGet("user");

  useEffect(() => {
    refetch();
  }, [refresh]);

  const {
    data: userNotif,
    isLoading: isLoadingUserNotif,
    error: errorNotif,
    refetch: refetchNotif,
  } = useApiGet("user/notification/all?PageNumber=1&PageSize=10000");

  function areAllNotificationsRead(notifications) {
    if (notifications?.length === 0) return true;
    return notifications?.every((notification) => notification.isRead);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (refetchNotif) {
        refetchNotif();
      }
    }, 4 * 60 * 1000); // 4 minutes in milliseconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [refetchNotif]);

  const toggleDrawer = (open) => (event) => {
    refetchNotif();
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
        return `Hello, ${userData?.data?.firstName || ""}`; // Default or Dashboard greeting
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
              )}
            </div>
            <div className="bg-[#CD2280]  rounded-full p-2">
              <span className="text-sm aspect-square h-[2.5em] text-white flex items-center justify-center">
                {userData?.data?.firstName.charAt(0)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Drawer anchor="right" open={state}>
        <div className="p-4 w-[100vw] max-w-[500px]">
          <div className=" flex justify-between items-center ">
            <h2 className="text-[24px] font-[700]">Notifications</h2>
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
    </>
  );
};

export default Navbar;
