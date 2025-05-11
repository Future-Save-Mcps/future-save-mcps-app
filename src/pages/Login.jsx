import LoginForm from "../components/LoginForm";
import React, { useEffect, useState } from "react";
import SidePanel from "../components/SidePanel";
import { slides } from "../utils/Constants";


const Login = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="md:flex-row flex-col  flex md:gap-4 h-screen md:p-4">
      <div className="bg-primary hidden md:flex text-[#fff] rounded-b-2xl md:rounded-xl flex-[1]  justify-center items-center">
        <SidePanel currentSlide={currentSlide} slides={slides} />
      </div>
      <div className=" flex items-center  overflow-auto flex-[1.5]">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
