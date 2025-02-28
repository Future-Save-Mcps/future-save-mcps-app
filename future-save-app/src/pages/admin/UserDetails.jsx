import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const UserDetails = () => {
  const { state: user } = useLocation();
  const navigate = useNavigate();

  if (!user) {
    return <p>User not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow rounded-lg">
      <button onClick={() => navigate(-1)} className="text-blue-600">
        ← Back to User Management
      </button>

      <h1 className="text-2xl font-bold mt-4">User Management</h1>

      <div className="grid grid-cols-2 gap-4 mt-6">
        {/* Personal Info */}
        <div className="border p-4 rounded-lg">
          <h2 className="font-semibold text-lg mb-2">Personal & Contact Information</h2>
          <p><strong>First Name:</strong> {user.name}</p>
          <p><strong>Last Name:</strong> Nonso</p>
          <p><strong>Gender:</strong> Nil</p>
          <p><strong>Email:</strong> nonso@gmail.com</p>
          <p><strong>Phone Number:</strong> 08099776655</p>
          <p><strong>Date of Birth:</strong> Nil</p>
        </div>

        {/* Bank Info */}
        <div className="border p-4 rounded-lg">
          <h2 className="font-semibold text-lg mb-2">Bank & Account Information</h2>
          <p><strong>Bank:</strong> Nil</p>
          <p><strong>Account Number:</strong> Nil</p>
          <p><strong>Account Name:</strong> Nil</p>
          <p><strong>BVN:</strong> Nil</p>
          <p><strong>Account Status:</strong> <span className="text-gray-500">● Inactive</span></p>
          <p><strong>Last Login:</strong> Nil</p>
        </div>

        {/* Referral Info */}
        <div className="border p-4 rounded-lg col-span-2">
          <h2 className="font-semibold text-lg mb-2">Referral Information</h2>
          <p><strong>Number of Referrals:</strong> Nil</p>
          <p><strong>Dividends Earned:</strong> Nil</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end mt-6 gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Create Savings Plan</button>
        <button className="bg-red-600 text-white px-4 py-2 rounded">Deactivate Account</button>
      </div>

      {/* Tabs */}
      <div className="border-b mt-6 flex">
        <button className="pb-2 px-4 border-b-2 border-blue-600 font-semibold">Savings Information</button>
        <button className="pb-2 px-4 text-gray-400">Loan Information</button>
      </div>

      {/* No Contribution Message */}
      <div className="text-center mt-6">
        <img src="/no-contributions.png" alt="No Contributions" className="mx-auto w-20" />
        <p className="text-gray-600 mt-2">No Contribution plans yet!</p>
      </div>
    </div>
  );
};

export default UserDetails;
