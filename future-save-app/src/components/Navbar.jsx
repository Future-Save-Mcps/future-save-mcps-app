import React from "react";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md">
      <div className="text-lg font-semibold">Hello Williams</div>
      <div className="flex items-center space-x-4">
        <div>Hope you are doing great!</div>
        <div className="bg-gray-200 rounded-full p-2">
          <span className="text-sm">W</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
