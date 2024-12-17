import React from "react";
import PieChartComponent from "../../components/charts/PieChartComponent";
import DashboardCard from "../../components/DashboardCard";
import {
  ContributionIcon,
  LoanIcon,
  PercentIcon,
} from "../../components/icons/Icons";

import Refer from "../../assets/refer.svg";

const Dashboard = () => {
  const activities = [
    {
      id: 1,
      title: "You started a contribution plan",
      time: "5hrs ago",
      icon: <ContributionIcon color="white" />, 
      amount: null,
    },
    {
      id: 2,
      title: "You borrowed money",
      time: "10hrs ago",
      icon: <LoanIcon color="white" />, 
      amount: "₦ 5,000.00",
    },
    {
      id: 3,
      title: "You withdrew money",
      time: "2 days ago",
      icon: <LoanIcon color="white" />, 
      amount: "₦ 10,000.00",
    },

    {
      id: 1,
      title: "You started a contribution plan",
      time: "5hrs ago",
      icon: <ContributionIcon color="white" />, 
      amount: null,
    },
    {
      id: 2,
      title: "You borrowed money",
      time: "10hrs ago",
      icon: <LoanIcon color="white" />, 
      amount: "₦ 5,000.00",
    },
    {
      id: 3,
      title: "You withdrew money",
      time: "2 days ago",
      icon: <LoanIcon color="white" />, 
      amount: "₦ 10,000.00",
    },
    {
      id: 1,
      title: "You started a contribution plan",
      time: "5hrs ago",
      icon: <ContributionIcon color="white" />, 
      amount: null,
    },
    {
      id: 2,
      title: "You borrowed money",
      time: "10hrs ago",
      icon: <LoanIcon color="white" />, 
      amount: "₦ 5,000.00",
    },
    {
      id: 3,
      title: "You withdrew money",
      time: "2 days ago",
      icon: <LoanIcon color="white" />, 
      amount: "₦ 10,000.00",
    },
  ];
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
      <div className="flex lg:flex-row flex-col-reverse h-fit flex-wrap   gap-6  mt-8">
        <div className="flex-1 rounded-xl  ">
          <div className="w-full ">
            {/* Top Banner */}
            <div
              style={{
                backgroundImage: `url(${Refer})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              className=" w-full h-48 flex flex-col rounded-xl overflow-hidden bg-gray-800 text-white p-6"
            >
              <h1 className="text-2xl font-bold">
                Refer <br /> & Earn Now!
              </h1>
              <button className="mt-4 w-fit bg-white text-black font-semibold px-12 py-2 rounded-lg">
                Proceed
              </button>
            </div>

            {/* Recent Activities */}
            <div className="py-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
              <ul className="space-y-5  max-h-[250px] overflow-auto">
                {activities.map((activity) => (
                  <li
                    key={activity.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-2xl">
                        {activity.icon}
                      </div>
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-gray-500 text-sm">{activity.time}</p>
                      </div>
                    </div>
                    {activity.amount && (
                      <div className="text-lg font-bold text-gray-900">
                        {activity.amount}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
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
