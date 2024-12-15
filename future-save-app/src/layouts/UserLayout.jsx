import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";

const UserLayout = () => (
  <div className="flex min-h-screen  bg-gray-100">
    <div className=" text-white p-4 sticky top-0 h-screen border border-red-500">
      <SideBar />
    </div>

    <div className="flex-1 flex flex-col">
      <div className="bg-white shadow-md sticky top-0 z-10">
        <Navbar />
      </div>

      <main className="flex-1  overflow-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

export default UserLayout;
