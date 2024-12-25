import React, { useState } from "react";
import OngoingCompletedCard from "../../components/Cards/OngoingCompletedCard";
import Warning from "../../components/Cards/Warning";
import Bg from "../../assets/cardBd.svg";
import { Drawer } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import SendImg from "../../assets/send.svg"

const LoanManagement = () => {
  const [state, setState] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState(open);
  };

  const ggg = () => {
    console.log(hello);
  };

  return (
    <>
      <div>
        <Warning
          WarningType="Green"
          text="You are eligible for both Thrift & Premium Loans"
        />
        <div className="flex gap-6 mb-8">
          <div
            style={{
              backgroundImage: `url(${Bg})`,
              backgroundSize: "contain",
              backgroundRepeat: "repeat",
              backgroundPosition: "center",
            }}
            className="min-h-[200px] border bg-[#72109D] gap-4 p-4 flex flex-col justify-center items-center flex-1 rounded-2xl"
          >
            <div className="font-[700] text-[28px] text-[#fff] ">
              Thrift Loan
            </div>
            <div className="font-[400] text-[16px] text-[#fff]">
              4.2% monthly interest
            </div>
            <button className="border text-[18px] font-[600] text-[#72109D] bg-[#fff] py-2 w-[60%] flex items-center justify-center rounded-xl">
              Apply
            </button>
          </div>
          <div
            style={{
              backgroundImage: `url(${Bg})`,
              backgroundSize: "contain",
              backgroundRepeat: "repeat",
              backgroundPosition: "center",
            }}
            className="min-h-[200px] border bg-[#1DAB40] gap-4 p-4 flex flex-col justify-center items-center flex-1 rounded-2xl"
          >
            <div className="font-[700] text-[28px] text-[#fff] ">
              Premium Loan
            </div>
            <div className="font-[400] text-[16px] text-[#fff]">
              8.4% monthly interest
            </div>
            <button className="border text-[18px] font-[600] text-[#1DAB40] bg-[#fff] py-2 w-[60%] flex items-center justify-center rounded-xl">
              Apply
            </button>
          </div>{" "}
        </div>
        <h2 className="text-[24px] font-[600] mb-4 ">My Loans</h2>
        <div className=" max-w-[550px] border min-h-[500px] p-4 rounded-2xl ">
          <div className="flex border-b ">
            <button className="flex-1 text-[20px] font-[600] p-4 border-b-2 border-red-500">
              OnGoing
            </button>
            <button className="flex-1 text-[20px] font-[600] text-[#717171] p-4">
              Completed
            </button>
            <button className="flex-1 text-[20px] font-[600] text-[#717171] p-4">
              Rejected
            </button>
          </div>
          <div className="">
            <OngoingCompletedCard
              onClick={toggleDrawer(true)}
              percentage={20}
            />
            <OngoingCompletedCard
              onClick={toggleDrawer(true)}
              percentage={90}
            />
          </div>
        </div>
      </div>
      <Drawer anchor="right" open={state}>
        <div className="p-4 w-[100vw] max-w-[700px]">
          <div className=" flex justify-between mb-8 items-center ">
            <h2 className="text-[24px] font-[700]">Loan Details</h2>
            <CloseIcon
              onClick={toggleDrawer(false)}
              sx={{
                cursor: "pointer",
                padding: "5px",
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                backgroundColor: "#F8F8FA",
              }}
            />
          </div>
          <Warning WarningType="Yellow" text="You Loan is being processed " />
          <OngoingCompletedCard
            percentage={20}
          />

          <div className="flex justify-center items-center">
            <button className="flex my-6 justify-center items-center gap-6 px-6 py-3 rounded-xl text-[#fff] bg-primary "> <img src={SendImg} alt="" /> Make Repayment</button>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default LoanManagement;
