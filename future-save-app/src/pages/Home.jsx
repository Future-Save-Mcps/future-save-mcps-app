import React from "react";
import SignUpForm from "../components/SignupForm";

const Home = () => {
  return (
    <div className="md:flex-row flex-col  flex md:gap-4 h-screen md:p-4">
      <div className="bg-primary text-[#fff] rounded-b-2xl md:rounded-xl flex-[1] flex justify-center items-center">this is fucking responsive</div>
      <div className="border  border-green-500 overflow-auto flex-[2]">
        <SignUpForm />
      </div>
    </div>
  );
};

export default Home;
