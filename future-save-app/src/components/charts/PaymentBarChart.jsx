import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
//   CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Function to generate the data for 50 weeks based on payment logic
const generatePaymentData = () => {
  const data = [];
  const weeklyPayment = 5000;

  for (let week = 1; week <= 25; week++) {
    const status = Math.floor(Math.random() * 4); // Random payment status for simulation
    let Timely = 0;
    let Weekend = 0;
    let Advanced = 0;
    let Defaulted = 0;

    if (status === 0) {
      Timely = weeklyPayment; // Paid on time (Monday - Friday)
    } else if (status === 1) {
      Weekend = weeklyPayment; // Paid on weekend (Saturday - Sunday)
    } else if (status === 2) {
      Advanced = weeklyPayment; // Paid in advance
    } else if (status === 3) {
      Defaulted = weeklyPayment; // Defaulted and paid in later weeks
    }

    data.push({
      name: `WK${week}`,
      Timely,
      Weekend,
      Advanced,
      Defaulted,
    });
  }

  return data;
};

const PaymentBarChart = () => {
  const data = generatePaymentData();

  return (
    <div className="p-4 bg-white rounded shadow-lg">
      <BarChart
        width={1000}
        height={400}
        data={data}
        cx={"none"}
        // barCategoryGap="100px"
        barGap={50} // Add space between bars in the same group
        barCategoryGap={50}
        barSize={15}
        margin={{ top: 20, right: 20, left: -30, bottom: 10 }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10 }}
          style={{ fontSize: "10px" }}
        />
        <YAxis
          tickFormatter={(value) => `${value / 1000}K`}
          tick={{ fontSize: 10 }}
          style={{ fontSize: "10px" }}
        />
        <Tooltip
          formatter={(value) => `₦${value.toLocaleString()}`}
          contentStyle={{ fontSize: "10px" }}
        />
        {/* <Legend wrapperStyle={{ fontSize: "10px" }} /> */}
        <Bar
          dataKey="Timely"
          stackId="a"
          radius={[15, 15, 15, 15]}
          fill="#34C759"
        />
        <Bar
          dataKey="Weekend"
          stackId="a"
          radius={[15, 15, 15, 15]}
          fill="#E2C626"
        />
        <Bar
          dataKey="Advanced"
          stackId="a"
          radius={[15, 15, 15, 15]}
          fill="#1342B7"
        />
        <Bar
          dataKey="Defaulted"
          stackId="a"
          radius={[15, 15, 15, 15]}
          fill="#FB0300"
        />
      </BarChart>
    </div>
  );
};

export default PaymentBarChart;




// <div className="w-full max-w-md mx-auto">
// <form onSubmit={handleSubmit(onSubmit)} >
//   {/* Payment Type */}
//   <div className="space-y-2">
//     <label className="block text-sm font-bold">
//       Payment Type
//     </label>
//     <Controller
//       name="paymentType"
//       control={control}
//       render={({ field }) => (
//         <div className="flex gap-4">
//           <label className="flex  border border-red-500 p-4  rounded-lg my-3 flex-1  items-center space-x-2">
//             <input
//               type="radio"
//               {...field}
//               value="this-week"
//               checked={field.value === "this-week"}
//               className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//             />
//             <span>This week payment</span>
//           </label>
//           <label className="flex  border border-red-500 p-4  rounded-lg my-3 flex-1 items-center space-x-2">
//             <input
//               type="radio"
//               {...field}
//               value="advance"
//               checked={field.value === "advance"}
//               className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//             />
//             <span>Advance Payment</span>
//           </label>
//         </div>
//       )}
//     />
//   </div>

//   {/* Number of weeks */}
//   <div className="space-y-2">
//     <label
//       htmlFor="numberOfWeeks"
//       className="block text-sm font-bold"
//     >
//       Number of weeks (25 weeks Plan)
//     </label>
//     <Controller
//       name="numberOfWeeks"
//       control={control}
//       render={({ field }) => (
//         <select
//           {...field}
//           className="mt-1 border  block w-full pl-3 pr-10 py-4 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//         >
//           {[...Array(25)].map((_, i) => (
//             <option key={i + 1} value={String(i + 1)}>
//               {i + 1} {i === 0 ? "week" : "weeks"}
//             </option>
//           ))}
//         </select>
//       )}
//     />
//   </div>

//   {/* Weekly Amount */}
//   <div className=" mt-4 space-y-2">
//     <label className="block text-sm font-medium text-gray-700">
//       Weekly Amount (Your weekly payment is NGN 5000.00)
//     </label>
//     <div className="text-2xl h-[100px] flex justify-center items-center rounded-lg mb-6 border font-semibold">
//       ₦{" "}
//       {(Number(numberOfWeeks) * weeklyAmount).toLocaleString(
//         "en-NG",
//         {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         }
//       )}
//     </div>
//   </div>

//   <button
//     type="submit"
//     className="w-full py-2 px-4 mt-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00205C] hover:bg-[#001845] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00205C]"
//   >
//     Make payment
//   </button>
// </form>

// </div>