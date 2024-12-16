import React from "react";
import Bg from "../assets/cardBd.svg";

const DashboardCard = ({ title, icon, amount, color = "#C61111" }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${Bg})`,
        backgroundColor: color,
        backgroundSize: "contain",
        backgroundRepeat: "repeat",
        backgroundPosition: "center",
      }}
      className="border flex flex-col min-w-[340px] flex-1 h-[180px] rounded-xl p-4 shadow-lg"
    >
      <div className="flex justify-between items-center">
        <div style={{ color: color }} className="text-[14px] font-[600] p-2 rounded-xl bg-white text-lg">
          {title || "Total Savings Balance"}
        </div>
        {icon}
      </div>

      <div className="flex-1 text-white flex justify-center items-center text-[32px] font-bold  ">
        {amount ? `₦ ${amount}` : "₦ 0.00"}
      </div>
    </div>
  );
};

export default DashboardCard;
