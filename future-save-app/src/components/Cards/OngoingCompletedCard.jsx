import React from "react";
import LoadingBar from "./LoadingBar";
import LoanImg from "../../assets/loanImg.svg";
import Savings from "../../assets/savings.svg";

const OngoingCompletedCard = ({
  percentage,
  onClick,
  cardTitle,
  cardType,
  contributionWeekPlan,
  contrubutionBalance,
  status,
  remainingDays,
  loanAmount,
  loanBalance
}) => {
  return (
    <div
      onClick={onClick}
      className="p-3 bg-[#F8F8FA] rounded-lg mb-2 gap-4 flex "
    >
      <div
        style={{
          backgroundImage: `url(${ cardType ==="Loan"? LoanImg : Savings})`,
          backgroundColor: "#041F621A",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="w-[30%] max-w-[150px]  aspect-square rounded-xl"
      ></div>
      <div className="flex-1   flex justify-evenly gap-2 flex-col  ">
        <div className="flex justify-between">
          <div className="font-[600] text-[18px]"> {cardTitle} </div>
          <div className="font-[600] text-[18px]">{loanAmount ?? contributionWeekPlan}</div>
        </div>
        <div className="">
          <div className="flex justify-between">
            <div className="font-[600] text-[18px]">{contrubutionBalance ?? loanBalance}</div>
            <div className="font-[500] text-[16px] text-[#FF790C]">
              {status}
            </div>
          </div>
          <div className="flex justify-between">
            <div className=" text-[#939393] text-[16px] font-[500]">
              Repayment Bal
            </div>
            <div className=" text-[#939393] text-[16px] font-[500]">
             {remainingDays}
            </div>
          </div>
        </div>
        <LoadingBar percentage={percentage} />
      </div>
    </div>
  );
};

export default OngoingCompletedCard;
