import React from "react";
import Bg from "../../assets/cardBd.svg";
import Copy from "../../assets/Copy.svg";
const Subscription = () => {
  const userdata = localStorage.getItem("userInfo");
  const code = JSON.parse(userdata);

  const copyToClipboard = () => {
    if (code && code.data && code.data.subscriptionCode) {
      navigator.clipboard
        .writeText(code.data.subscriptionCode)
        .then(() => alert("Subscription Code copied to clipboard!"))
        .catch((err) => console.error("Failed to copy:", err));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="font-[600] text-[22px]">Subscription Code</div>
      </div>
      <div
        style={{
          backgroundImage: `url(${Bg})`,
          backgroundSize: "contain",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
        }}
        className="min-h-[200px] border bg-[#CD2280] gap-4 p-4 flex flex-col justify-center items-center flex-1 rounded-2xl"
      >
        <div className="font-[700] text-center text-[28px] text-[#fff] ">
          Your Subscription Code
        </div>
        <div className="font-[700] text-center text-[32px] text-[#fff]">
          {code.data.subscriptionCode}
        </div>
        <button
          onClick={copyToClipboard}
          className="   text-[18px] font-[600] text-[#fff] bg-[#0000001F] py-2 w-[40%] flex items-center justify-center rounded-lg"
        >
          <span className="px-2">
            <img src={Copy} alt="copy" />
          </span>
          Copy Subscription Code
        </button>
      </div>
    </div>
  );
};

export default Subscription;
