import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Map Paystack payment types to bar keys
const getBarKeyFromPaymentTime = (type) => {
  switch (type) {
    case "TimelyPayment":
      return "Timely";
    case "WeekendPayment":
      return "Weekend";
    case "AdvancePayment":
      return "Advanced";
    case "DefaultedPayment":
      return "Defaulted";
    default:
      return null;
  }
};

const buildFullChartData = (transactions, totalWeek) => {
  const dataMap = {};

  // Map each transaction into the dataMap keyed by week number
  transactions.forEach((tx) => {
    const weekKey = `WK${tx.weekNumber}`;
    const barKey = getBarKeyFromPaymentTime(tx.paymentTime);
    if (!dataMap[weekKey]) {
      dataMap[weekKey] = {
        name: weekKey,
        Timely: 0,
        Weekend: 0,
        Advanced: 0,
        Defaulted: 0,
      };
    }
    dataMap[weekKey][barKey] = tx.totalAmount;
  });

  // Ensure all 25 weeks are present
  const chartData = [];
  for (let i = 1; i <= totalWeek; i++) {
    const key = `WK${i}`;
    chartData.push(
      dataMap[key] || {
        name: key,
        Timely: 0,
        Weekend: 0,
        Advanced: 0,
        Defaulted: 0,
      }
    );
  }

  return chartData;
};

const PaymentBarChart = ({ transactions = [],totalWeek = []  }) => {
  const data = buildFullChartData(transactions, totalWeek);

  return (
    <div className="p-4 bg-white rounded shadow-lg overflow-x-auto">
      <BarChart
        width={1000}
        height={400}
        data={data}
        barGap={50}
        barCategoryGap={50}
        barSize={15}
        margin={{ top: 20, right: 20, left: -30, bottom: 10 }}
      >
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10 }}
        />
        <YAxis
          tickFormatter={(value) => `₦${value / 1000}k`}
          tick={{ fontSize: 10 }}
        />
        <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
        <Bar dataKey="Timely" stackId="a" fill="#34C759" radius={[15, 15, 15, 15]} />
        <Bar dataKey="Weekend" stackId="a" fill="#E2C626" radius={[15, 15, 15, 15]} />
        <Bar dataKey="Advanced" stackId="a" fill="#1342B7" radius={[15, 15, 15, 15]} />
        <Bar dataKey="Defaulted" stackId="a" fill="#FB0300" radius={[15, 15, 15, 15]} />
      </BarChart>
    </div>
  );
};

export default PaymentBarChart;
