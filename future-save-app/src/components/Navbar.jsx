import React from "react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

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
    <div className="flex justify-between items-center p-4 bg-white shadow-md">
      <div className="text-lg font-semibold">{getGreetingText()}</div>
      <div className="flex items-center space-x-4">
        {location.pathname === "/user" && (
          <div>Hope you are doing great!</div> // Show only on Dashboard page
        )}
        <div className="bg-gray-200 rounded-full p-2">
          <span className="text-sm">W</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
