// export const calculateLoanDetails = (loanAmount, paymentDurationInWeeks, monthlyInterestRate) => {
//     // Convert weeks to months
//     const paymentDurationInMonths = paymentDurationInWeeks / 4.345;
  
//     // Calculate total repayment amount with compound interest
//     const totalRepaymentAmount = loanAmount * Math.pow(1 + monthlyInterestRate, paymentDurationInMonths);
  
//     // Calculate interest value (Total Repayment - Loan Amount)
//     const interestAmount = totalRepaymentAmount - loanAmount;
  
//     // Calculate weekly repayment
//     const weeklyRepayment = totalRepaymentAmount / paymentDurationInWeeks;
  
//     // Format values to two decimal places
//     return {
//       totalRepaymentAmount: totalRepaymentAmount.toFixed(),
//       interestAmount: interestAmount.toFixed(),
//       weeklyRepayment: weeklyRepayment.toFixed(),
//     };
//   };



export const calculateLoanDetails = (loanAmount, paymentDurationInWeeks, monthlyInterestRate) => {
  // Convert weeks to months (approximate conversion)
  const paymentDurationInMonths = paymentDurationInWeeks / 4.345;

  // Calculate total repayment amount with compound interest
  const totalRepaymentAmount = loanAmount * Math.pow(1 + monthlyInterestRate, paymentDurationInMonths);

  // Calculate interest value (Total Repayment - Loan Amount)
  const interestAmount = totalRepaymentAmount - loanAmount;

  // Calculate monthly interest amount (simple interest for each month)
  const monthlyInterestAmount = loanAmount * monthlyInterestRate;

  // Calculate weekly repayment (divide total repayment by the number of weeks)
  const weeklyRepayment = totalRepaymentAmount / paymentDurationInWeeks;

  // Return results with two decimal places
  return {
    totalRepaymentAmount: totalRepaymentAmount.toFixed(),  // Total repayment including interest
    interestAmount: interestAmount.toFixed(),              // Total interest
    monthlyInterestAmount: monthlyInterestAmount.toFixed(), // Interest amount per month
    weeklyRepayment: weeklyRepayment.toFixed(),             // Weekly repayment
  };
};