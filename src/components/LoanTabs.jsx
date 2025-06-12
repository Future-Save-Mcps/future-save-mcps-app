import React, { useState } from "react";
import PaymentBarChart from "./charts/PaymentBarChart"; // Import PaymentBarChart
import { ContributionIcon } from "../components/icons/Icons";
import formatTimeAgo from "../utils/formatTimeAgo";
import PaymentTag from "./PaymentTag";

const LoanTabs = ({ activities = [], transactions = [], totalWeek }) => {
  const [activeTab, setActiveTab] = useState("activities");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  console.log(transactions);
  return (
    <div className="max-w-2xl mx-auto p-6 rounded-lg bg-white">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => handleTabClick("activities")}
          className={`flex-1 py-2 text-center font-semibold ${
            activeTab === "activities"
              ? "border-b-2 border-primary text-black"
              : "text-gray-400"
          }`}
        >
          Activities
        </button>
        <button
          onClick={() => handleTabClick("payment")}
          className={`flex-1 py-2 text-center font-semibold ${
            activeTab === "payment"
              ? "border-b-2 border-primary text-black"
              : "text-gray-400"
          }`}
        >
          Payment History/Tracking
        </button>
      </div>

      {/* Content */}
      {activeTab === "activities" && (
        <div className="mt-4 space-y-4">
          {activities
            ?.slice()
            .reverse()
            .map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-900 text-white">
                  <ContributionIcon color="white" />
                </div>
                <div>
                  <p className="font-medium">{activity.description}</p>
                  <p className="text-sm text-gray-500">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}

      {activeTab === "payment" && (
        <div className="mt-4 space-y-4">
          {transactions.length < 1 ? (
            <div className="flex justify-center items-center h-[150px] font-semibold text-lg">
              No Transaction History
            </div>
          ) : (
            <>
              <div className="flex gap-6 mb-4 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#34C759]"></div>
                  <span>Timely Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#E2C626]"></div>
                  <span>Weekend Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#1342B7]"></div>
                  <span>Advance Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#FB0300]"></div>
                  <span>Defaulted Payment</span>
                </div>
              </div>

              {/* Render Payment History Bar Chart */}
              <PaymentBarChart
                transactions={transactions}
                totalWeek={totalWeek}
              />
              {/* <div className="mt-6">
                {transactions
                  ?.slice()
                  .reverse()
                  .map((activity, index) => (
                    <div
                      key={index}
                      className="flex p-1 justify-between items-center space-x-4"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-900 text-white">
                          <ContributionIcon color="white" />
                        </div>
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-gray-500">
                            {formatTimeAgo(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="gap-2 flex flex-col justify-end items-end">
                        <div className=""> NGN {activity.amount}</div>
                        <PaymentTag type={activity.paymentStatus} />
                      </div>
                    </div>
                  ))}
              </div> */}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LoanTabs;
