import React from "react";
import Bg from "../../assets/cardBd.svg";
import Copy from "../../assets/copy.svg";
import Upload from "../../assets/withdrawicon.svg";
const ReferAndEarn = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="font-[600] text-[22px]">Refer and Earn</div>
      </div>
      <div
        style={{
          backgroundImage: `url(${Bg})`,
          backgroundSize: "contain",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
        }}
        className="min-h-[200px] border bg-[#171717] gap-4 p-4 flex flex-col justify-center items-center flex-1 rounded-2xl"
      >
        <div className="font-[700] text-center text-[28px] text-[#fff] ">
          Balance
        </div>
        <div className="font-[700] text-center text-[32px] text-[#fff]">
          N 0.00
        </div>
        <button
          // onClick={copyToClipboard}
          className="   text-[18px] font-[600] text-[#fff] bg-[#FFFFFF1F] py-2 w-[40%] flex items-center justify-center rounded-lg"
        >
          <span className="px-2">
            <img src={Copy} alt="copy" />
          </span>
          Copy Referral Link
        </button>
      </div>
      <div className="flex justify-center my-6">
        <button className="text-[18px] font-[600] text-[#fff] bg-[#041F62] py-4 w-[30%] flex items-center justify-center rounded-lg">
          <span className="px-2">
            <img src={Upload} alt="upload" />
          </span>
          Withdraw funds
        </button>
      </div>
    </div>
  );
};

export default ReferAndEarn;
