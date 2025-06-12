import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PaymentBarChart = ({ transactions }) => {
  console.log("Transactions in PaymentBarChart:", transactions); // Log transactions for debugging

  // Initialize arrays for weeks, total payments, and payment colors
  const weeks = [];
  const totalPayments = [];
  const paymentColors = [];
  
  const getColorForPaymentType = (type) => {
    switch (type) {
      case "AdvancePayment":
        return "blue"; // Blue for Advance Payment
      case "TimelyPayment":
        return "green"; // Green for Timely Payment
      case "WeekendPayment":
        return "yellow"; // Yellow for Weekend Payment
      case "DefaultedPayment":
        return "red"; // Red for Defaulted Payment
      default:
        return "gray"; // Default color if no match is found
    }
  };

  // Process the transactions data
  transactions.forEach((transaction) => {
    console.log("Processing transaction:", transaction); // Log each transaction

    const week = transaction.weekNumber; // Week number (e.g., "6", "7", "8")
    const amount = transaction.totalAmount; // Amount paid for the week
    const type = transaction.paymentTime; // Payment type (e.g., "AdvancePayment")

    // Check if the week already exists in the weeks array
    if (!weeks.includes(week)) {
      weeks.push(week); // Add week number to the weeks array
      totalPayments.push(amount); // Add payment amount for this week
      paymentColors.push(getColorForPaymentType(type)); // Add color based on payment type
    } else {
      // If the week exists, update the total payment for that week (if there are multiple payments in a week)
      const weekIndex = weeks.indexOf(week);
      totalPayments[weekIndex] += amount;
    }
  });

  // Function to return color based on payment type

  // Prepare chart data
  const chartData = {
    labels: weeks, // Week numbers (e.g., "6", "7", "8")
    datasets: [
      {
        label: "Weekly Payments",
        data: totalPayments, // Total amount paid for each week
        backgroundColor: paymentColors, // Color of the bars based on payment type
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Payment History/Tracking",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Weeks",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Total Amount (NGN)",
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default PaymentBarChart;
