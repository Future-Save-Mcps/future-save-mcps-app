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


