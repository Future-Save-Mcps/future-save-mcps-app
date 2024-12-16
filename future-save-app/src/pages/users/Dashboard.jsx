import React from "react";
import PieChartComponent from "../../components/charts/PieChartComponent";
import DashboardCard from "../../components/DashboardCard";
import {
  ContributionIcon,
  LoanIcon,
  PercentIcon,
} from "../../components/icons/Icons";

const Dashboard = () => {
  return (
    <div className=" relative">
      <div className=" flex  relative w-full h-[185px] flex-1 gap-4  ">
        <div className="w-full  absolute gap-4 flex  overflow-auto">
          <DashboardCard
            color="#1342B7"
            title={"Total Savings Bal"}
            amount={"100,000.00"}
            icon={<ContributionIcon color="white" />}
          />
          <DashboardCard
            color="#C61111"
            title={"Total Loan Bal"}
            amount={"90,000.00"}
            icon={<LoanIcon color="white" />}
          />
          <DashboardCard
            color="#D15E12"
            title={"Total Dividend Bal"}
            amount={"600.000"}
            icon={<PercentIcon />}
          />
        </div>
      </div>
      <div className="flex lg:flex-row flex-col h-fit flex-wrap   gap-6  mt-8">
        <div className="flex-1 rounded-xl border border-blue-500 "></div>
        <div
          style={{
            boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
          }}
          className=" relative max-w-[400px] rounded-xl shadow-md h-fit flex-1 p-4 "
        >
          <h2 className="text-center text-primary text-[28px] my-4 font-[600]">
            Total Savings Progress
          </h2>
          <p className="text-primary text-[18px] font-[500] text-center">
            Total Savings Target - ₦125,000
          </p>
          <PieChartComponent percentagePaid={90} />
          <div className="flex gap-4 flex-wrap justify-center items-center my-6">
            <div className="flex gap-4 justify-center items-center">
              <div className="w-4 h-4 border border-[#041F6233] rounded-full bg-[#041F621A]"></div>
              <div className="font-[500] text-[18px]">Total Saving Target</div>
            </div>
            <div className="flex gap-4 justify-center items-center">
              <div className="w-4 h-4 rounded-full bg-primary"></div>
              <div className="font-[500] text-[18px]">Total Savings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
