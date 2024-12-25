import React from "react";
import LoadingBar from "./LoadingBar";
import LoanImg from "../../assets/loanImg.svg";

const OngoingCompletedCard = ({ percentage, onClick }) => {
  return (
    <div onClick={onClick} className="p-3 bg-[#F8F8FA] rounded-lg mb-2 gap-4 flex ">
      <div
        style={{
          backgroundImage: `url(${LoanImg})`,
          backgroundColor: "#041F621A",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="w-[30%] max-w-[150px]  aspect-square rounded-xl"
      ></div>
      <div className="flex-1   flex justify-evenly gap-2 flex-col  ">
        <div className="flex justify-between">
          <div className="font-[600] text-[18px]">Thrift Loan</div>
          <div className="font-[600] text-[18px]">₦375,000.00 </div>
        </div>
        <div className="">
          <div className="flex justify-between">
            <div className="font-[600] text-[18px]">₦ 15,650.00</div>
            <div className="font-[500] text-[16px] text-[#FF790C]">
              In progress{" "}
            </div>
          </div>
          <div className="flex justify-between">
            <div className=" text-[#939393] text-[16px] font-[500]">
              Repayment Bal
            </div>
            <div className=" text-[#939393] text-[16px] font-[500]">
              299 days remaining
            </div>
          </div>
        </div>
        <LoadingBar percentage={percentage} />
      </div>
    </div>
  );
};

export default OngoingCompletedCard;
