import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-xl text-gray-600 mt-4">Oops! Page not found.</p>
      <div
        onClick={()=>navigate(-1)}
        className="mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600"
      >
        Go to Home
      </div>
    </div>
  );
};

export default NotFound;
