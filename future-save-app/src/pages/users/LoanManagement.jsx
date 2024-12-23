import React from "react";
import OngoingCompletedCard from "../../components/Cards/OngoingCompletedCard";

const LoanManagement = () => {
  return (
    <div>
      <div className="border mb-4">
        You are eligible for both Thrift & Premium Loans
      </div>
      <div className="flex gap-6 mb-8">
        <div className="min-h-[200px] border p-4 flex flex-col justify-center items-center flex-1 rounded-2xl"></div>
        <div className="min-h-[200px] border p-4 flex flex-col justify-center items-center flex-1 rounded-2xl"></div>
      </div>
      <h2 className="text-[24px] font-[600] mb-4 ">My Loans</h2>
      <div className=" max-w-[600px] border min-h-[500px] p-4 rounded-2xl ">
      <div className="flex border-b ">
        <button className="flex-1 text-[20px] font-[600] p-4 border-b-2 border-red-500">OnGoing</button>
        <button className="flex-1 text-[20px] font-[600] text-[#717171] p-4">Completed</button>
      </div>
      <div className="">
        <OngoingCompletedCard/>
      </div>
      </div>
    </div>
  );
};

export default LoanManagement;
