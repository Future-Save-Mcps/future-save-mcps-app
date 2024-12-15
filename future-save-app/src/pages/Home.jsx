import React from "react";
import SignUpForm from "../components/SignupForm";

const Home = () => {
  return (
    <div className="flex h-screen">
      <div
        style={{
          flex: "1",
        }}
        className=" bg-blue-900 text-white p-8 flex flex-col justify-center"
      >
        <div className="max-w-md">
          <h1 className="text-4xl font-semibold mb-6">
            Save, Borrow, & Thrive with Ease
          </h1>
          <p className="text-lg mb-6">
            Unlock structured savings plans, easy loan applications, and
            exclusive incentives. Future Save is your trusted financial partner.
          </p>
          <div className="mt-6">
            <h3 className="text-2xl font-semibold">
              Savings & Contribution Plans
            </h3>
            <p className="mt-4">
              Users can join structured savings plans for 25 or 50 weeks, making
              weekly contributions that are tracked using a color-coded system
              to indicate timeliness.
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          flex: "2",
        }}
        className="flex justify-center items-center p-4"
      >
        <SignUpForm />
      </div>
    </div>
  );
};

export default Home;
