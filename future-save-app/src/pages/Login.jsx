import React from "react";
import SignUpForm from "../components/SignupForm";
import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <div className="md:flex-row flex-col  flex md:gap-4 h-screen md:p-4">
      <div className="bg-primary text-[#fff] rounded-b-2xl md:rounded-xl flex-[1] flex justify-center items-center">
        this is fucking responsive
      </div>
      <div className=" flex items-center  overflow-auto flex-[1.5]">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
