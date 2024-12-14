import React from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="w-64 bg-blue-800 h-[100%] rounded-xl p-4">
      <div className="text-white font-bold text-xl mb-6">
        Future Save MPCS LTD
      </div>
      <ul>
        <li><Link to="/dashboard" className="block py-2 px-4 hover:bg-blue-700">Dashboard</Link></li>
        <li><Link to="/contribution-plans" className="block py-2 px-4 hover:bg-blue-700">Contribution Plans</Link></li>
        <li><Link to="/loan-management" className="block py-2 px-4 hover:bg-blue-700">Loan Management</Link></li>
        <li><Link to="/account" className="block py-2 px-4 hover:bg-blue-700">Account</Link></li>
        <li><Link to="/logout" className="block py-2 px-4 hover:bg-blue-700">Log Out</Link></li>
      </ul>
    </div>
  );
};

export default SideBar;
