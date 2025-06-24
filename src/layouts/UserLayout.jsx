import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
 const [userInfo, setUserInfo] = useState(() => {
        // Initialize state with data from localStorage
        const storedUserInfo = localStorage.getItem("userInfo");
        return storedUserInfo ? JSON.parse(storedUserInfo) : null;
    });

    useEffect(() => {
        // Function to handle localStorage updates
        const handleStorageChange = () => {
            const updatedUserInfo = localStorage.getItem("userInfo");
            setUserInfo(updatedUserInfo ? JSON.parse(updatedUserInfo) : null);
        };

        // Listen for changes in localStorage
        window.addEventListener("storage", handleStorageChange);

        // Cleanup listener on unmount
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    useEffect(() => {
      // ref
        // React to local state changes if needed
    }, [userInfo]);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen m-auto max-w-screen-2xl relative  ">
      <div
        className={`fixed top-0 left-0  h-screen w-fit z-30 text-white transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:translate-x-0 md:h-auto`}
      >
        <SideBar toggleSidebar={toggleSidebar} />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white  sticky top-0 z-10 flex justify-between items-center ">
          <div className="md:hidden ml-2 absolute">
            <button
              className="rounded-full p-1 bg-[#2438ee34]"
              onClick={toggleSidebar}
            >
              <MenuOpenIcon />
            </button>
          </div>

          <Navbar refresh={userInfo} />
        </div>

        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
