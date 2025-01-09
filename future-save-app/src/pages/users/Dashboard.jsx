import React, { useEffect } from "react";
import PieChartComponent from "../../components/charts/PieChartComponent";
import DashboardCard from "../../components/DashboardCard";
import NoActivity from "../../assets/noActivity.svg";
import Nosavings from "../../assets/nosavings.svg";
import {
  ContributionIcon,
  LoanIcon,
  PercentIcon,
} from "../../components/icons/Icons";

import Refer from "../../assets/refer.svg";
import { useApiGet } from "../../hooks/useApi";
import formatTimeAgo from "../../utils/formatTimeAgo";

const Dashboard = () => {
  const { data, isLoading, error, refetch } = useApiGet("user/dashboard");

  let percentage = 0;
  if (data?.data?.userSavingsProgress?.totalSavingsTarget > 0) {
    percentage =
      (data?.data?.userSavingsProgress?.totalSavingsCurrentBalance /
        data?.data?.userSavingsProgress?.totalSavingsTarget) *
      100;
    percentage = isNaN(percentage) ? 0 : percentage;
  }



  return (
    <div className=" relative">
      <div className=" flex  relative w-full h-[185px] flex-1 gap-4  ">
        <div className="w-full  absolute gap-4 flex  overflow-auto">
          <DashboardCard
            color="#1342B7"
            title={"Total Savings Bal"}
            amount={data?.data?.userDashboard?.totalSavingsBalance}
            icon={<ContributionIcon color="white" />}
          />
          <DashboardCard
            color="#C61111"
            title={"Total Loan Bal"}
            amount={data?.data?.userDashboard?.totalLoanBalance}
            icon={<LoanIcon color="white" />}
          />
          <DashboardCard
            color="#D15E12"
            title={"Total Dividend Bal"}
            amount={data?.data?.userDashboard?.totalDividendBalance}
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
              <h2 className="text-lg mb-6 font-semibold ">Recent Activities</h2>
              {data?.data?.activities.length < 1 || !data ? (
                <div className="flex flex-col mt-4 gap-4 justify-center items-center">
                  <img src={NoActivity} alt="" />
                  <div className="text-[18px] font-[500]">No activity yet!</div>
                </div>
              ) : (
                <ul className="space-y-5  max-h-[250px] overflow-auto">
                  {data?.data?.activities?.map((activity, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-2xl">
                          {/* {activity.icon} */}
                          <ContributionIcon color="white" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {activity.title}
                            {/* {activity.description} */}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {formatTimeAgo(activity.timeStamp)}
                          </p>
                        </div>
                      </div>
                      {/* {activity.amount && (
                        <div className="text-lg font-bold text-gray-900">
                          {activity.amount}
                        </div>
                      )} */}
                    </li>
                  ))}
                </ul>
              )}
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
            Total Savings Target - ₦{" "}
            {data?.data?.userSavingsProgress?.totalSavingsTarget}
          </p>
          {data?.data?.userSavingsProgress?.totalSavingsTarget < 1 ? (
            <div className="flex my-4 font-[500] flex-col gap-4 justify-center items-center">
            <img src={Nosavings} alt="" />
            <div className="text-[18px] mt-4 ">No savings target yet!</div>
            <p className="text-[#9c9c9c]">Start a contribution plan to see your savings target</p>
          </div>
          ) : (
            <>
              <PieChartComponent percentage={percentage} />

              <div className="flex gap-4  flex-wrap justify-center items-center my-6">
                <div className="flex gap-4 justify-center items-center">
                  <div className="w-4 h-4 border border-[#041F6233] rounded-full bg-[#041F621A]"></div>
                  <div className="font-[500] text-[18px]">
                    Total Saving Target
                  </div>
                </div>
                <div className="flex gap-4 justify-center items-center">
                  <div className="w-4 h-4 rounded-full bg-primary"></div>
                  <div className="font-[500] text-[18px]">Total Savings</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
