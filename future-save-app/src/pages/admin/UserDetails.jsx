import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import back from "../../assets/back.svg";
import { useApiGet } from "@/hooks/useApi";
import empty from "../../assets/empty.svg";
const UserDetails = () => {
  const { state: user } = useLocation();
  const [activeTab, setActiveTab] = useState("savings");
  const navigate = useNavigate();
  const {
    data: loan,
    isLoading: isLoadingLoan,
    refetch: refetchLoan,
  } = useApiGet(`admin/user-details?memberUserId=${user}`);
  console.log(loan);
  if (!user) {
    return <p>User not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mt-4">User Management</h1>
      <div className="flex items-center justify-between w-full mt-4">
        {/* Back Button */}
        <button className="flex items-center text-[#313131] text-lg font-medium">
          <img
            onClick={() => navigate(-1)}
            src={back}
            alt="Back"
            className="mr-2"
          />
          User Details
        </button>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="bg-[#041F62] text-white px-4 py-2 rounded">
            Create Savings Plan
          </button>
          <button className="bg-[#FB0300] text-white px-4 py-2 rounded">
            Deactivate Account
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        {/* Personal Info */}
        <div className="border p-4 rounded-lg ">
          <h2 className="font-semibold text-lg mb-2">
            Personal & Contact Information
          </h2>
          <div className="space-y-4">
            <p>
              <strong>First Name:</strong>{" "}
              {loan?.data?.userInformation?.firstName}
            </p>
            <p>
              <strong>Last Name:</strong>{" "}
              {loan?.data?.userInformation?.lastName}
            </p>
            <p>
              <strong>Gender:</strong> {loan?.data?.userInformation?.gender}
            </p>
            <p>
              <strong>Email:</strong> {loan?.data?.userInformation?.email}
            </p>
            <p>
              <strong>Phone Number:</strong>{" "}
              {loan?.data?.userInformation?.phoneNumber}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {loan?.data?.userInformation?.dateOfBirth}
            </p>
          </div>
        </div>

        {/* Bank Info */}
        <div className="border p-4 rounded-lg">
          <h2 className="font-semibold text-lg mb-2">
            Bank & Account Information
          </h2>
          <div className="space-y-4">
            <p>
              <strong>Bank:</strong>{" "}
              {loan?.data?.bankAccountInformation?.bankName}
            </p>
            <p>
              <strong>Account Number:</strong>{" "}
              {loan?.data?.bankAccountInformation?.bankAccountNumber}
            </p>
            <p>
              <strong>Account Name:</strong>{" "}
              {loan?.data?.bankAccountInformation?.accountName}
            </p>
            <p>
              <strong>BVN:</strong> {loan?.data?.bankAccountInformation?.bvn}
            </p>
            {/* <p><strong>Account Status:</strong> <span className="text-gray-500">● Inactive</span></p>
          <p><strong>Last Login:</strong> Nil</p> */}
          </div>
        </div>

        {/* Referral Info */}
        <div className="border p-4 rounded-lg col-span-2">
          <h2 className="font-semibold text-lg mb-2">Referral Information</h2>
          <div className="space-y-4">
            <p>
              <strong>Number of Referrals:</strong> Nil
            </p>
            <p>
              <strong>Dividends Earned:</strong> Nil
            </p>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b flex">
        <button
          className={`pb-2 px-6 font-semibold ${
            activeTab === "savings"
              ? "border-b-2 border-blue-600 text-black"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("savings")}
        >
          Savings Information
        </button>

        <button
          className={`pb-2 px-6 ${
            activeTab === "loan"
              ? "border-b-2 border-blue-600 text-black"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("loan")}
        >
          Loan Information
        </button>
      </div>
      {/* Content Section */}
      <div className="mt-4">
        {activeTab === "savings" ? (
          loan?.data?.savingsInformation.length > 0 ? (
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">Contribution Plans</th>
                  <th className="p-2 border">Target Amount</th>
                  <th className="p-2 border">Date Created</th>
                  <th className="p-2 border">Weekly Amount</th>
                  <th className="p-2 border">Account Status</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {loan?.data?.savingsInformation.map((plan, index) => (
                  <tr key={index} className="border">
                    <td className="p-2 border">{plan.savingsPlanType}</td>
                    <td className="p-2 border">
                      ₦ {plan.targetAmount.toLocaleString()}
                    </td>
                    <td className="p-2 border">{plan.dateCreated}</td>
                    <td className="p-2 border">
                      ₦ {plan.weeklyAmount.toLocaleString()}
                    </td>
                    <td className="p-2 border">
                      <span className="bg-orange-200 text-orange-600 px-2 py-1 rounded">
                        {plan.status}
                      </span>
                    </td>
                    <td className="p-2 border">
                      <button className="bg-[#041F62] text-white px-4 py-1 rounded">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center mt-6">
              <img
                src={empty}
                alt="No Contribution plan yet"
                className="mx-auto w-20"
              />
              <p className="text-gray-600 mt-2">No Savings Plan Found!</p>
            </div>
          )
        ) : loan?.data?.loanInformation.length > 0 ? (
          <table className="w-full  ">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Loan Type</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Date Created</th>
                <th className="p-2 border">Monthly Payment</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {loan?.data?.loanInformation.map((loan, index) => (
                <tr key={index} className="border">
                  <td className="p-2 border">{loan.loanType}</td>
                  <td className="p-2 border">
                    ₦ {loan.amount.toLocaleString()}
                  </td>
                  <td className="p-2 border">{loan.dateCreated}</td>
                  <td className="p-2 border">
                    ₦ {loan.monthlyPayment.toLocaleString()}
                  </td>
                  <td className="p-2 border">
                    <span className="bg-orange-200 text-orange-600 px-2 py-1 rounded">
                      {loan.status}
                    </span>
                  </td>
                  <td className="p-2 border">
                    <button className="bg-[#041F62] text-white px-4 py-1 rounded">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center mt-6">
            <img src={empty} alt="No Loans" className="mx-auto w-20" />
            <p className="text-gray-600 mt-2">No Loan Plan Found!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
