import {
  DashboardDlIcon,
  DashboardPendingIcon,
  DashboardReferIcon,
  DashboardTCIcon,
  DashboardTLIcon,
  DashboardTRIcon,
  FilterIcon,
} from "@/components/icons/Icons";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useApiGet } from "@/hooks/useApi";
import { formatCurrency } from "@/utils/currencyFormatter";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const yearlyData = [
  { name: "Jan", interest: 1000000, deactivation: 500000, defaulting: 300000 },
  { name: "Feb", interest: 1200000, deactivation: 600000, defaulting: 400000 },
  { name: "Mar", interest: 1400000, deactivation: 700000, defaulting: 500000 },
  { name: "Apr", interest: 1600000, deactivation: 800000, defaulting: 600000 },
  { name: "May", interest: 1800000, deactivation: 900000, defaulting: 700000 },
  { name: "Jun", interest: 2000000, deactivation: 1000000, defaulting: 800000 },
  {
    name: "Jul",
    interest: 5000000,
    deactivation: 2000000,
    defaulting: 1000000,
  },
  { name: "Aug", interest: 2200000, deactivation: 1100000, defaulting: 900000 },
  { name: "Sep", interest: 1800000, deactivation: 900000, defaulting: 700000 },
  { name: "Oct", interest: 2000000, deactivation: 1000000, defaulting: 800000 },
  { name: "Nov", interest: 1900000, deactivation: 950000, defaulting: 750000 },
  { name: "Dec", interest: 2100000, deactivation: 1050000, defaulting: 850000 },
];

const monthlyData = [
  {
    name: "Week 1",
    interest: 500000,
    deactivation: 200000,
    defaulting: 100000,
  },
  {
    name: "Week 2",
    interest: 600000,
    deactivation: 250000,
    defaulting: 150000,
  },
  {
    name: "Week 3",
    interest: 700000,
    deactivation: 300000,
    defaulting: 200000,
  },
  {
    name: "Week 4",
    interest: 800000,
    deactivation: 350000,
    defaulting: 250000,
  },
];

const weeklyData = [
  { name: "Monday", interest: 100000, deactivation: 50000, defaulting: 20000 },
  { name: "Tuesday", interest: 120000, deactivation: 60000, defaulting: 30000 },
  {
    name: "Wednesday",
    interest: 140000,
    deactivation: 70000,
    defaulting: 40000,
  },
  {
    name: "Thursday",
    interest: 160000,
    deactivation: 80000,
    defaulting: 50000,
  },
  { name: "Friday", interest: 180000, deactivation: 90000, defaulting: 60000 },
  {
    name: "Saturday",
    interest: 200000,
    deactivation: 100000,
    defaulting: 70000,
  },
  { name: "Sunday", interest: 220000, deactivation: 110000, defaulting: 80000 },
];

const data = [
  { name: "Jan", interest: 1000000, deactivation: 500000, defaulting: 300000 },
  { name: "Feb", interest: 1200000, deactivation: 600000, defaulting: 400000 },
  { name: "Mar", interest: 1400000, deactivation: 700000, defaulting: 500000 },
  { name: "Apr", interest: 1600000, deactivation: 800000, defaulting: 600000 },
  { name: "May", interest: 1800000, deactivation: 900000, defaulting: 700000 },
  { name: "Jun", interest: 2000000, deactivation: 1000000, defaulting: 800000 },
  {
    name: "Jul",
    interest: 5000000,
    deactivation: 2000000,
    defaulting: 1000000,
  },
  { name: "Aug", interest: 2200000, deactivation: 1100000, defaulting: 900000 },
  { name: "Sep", interest: 1800000, deactivation: 900000, defaulting: 700000 },
  { name: "Oct", interest: 2000000, deactivation: 1000000, defaulting: 800000 },
  { name: "Nov", interest: 1900000, deactivation: 950000, defaulting: 750000 },
  { name: "Dec", interest: 2100000, deactivation: 1050000, defaulting: 850000 },
];

const Dashboard = () => {
  const filterOptions = ["This Year", "This Month", "This Week"];

  const [selected, setSelected] = useState("Today");
  const [selectedFilter, setSelectedFilter] = useState("This Year");
  const [data, setChartData] = useState(yearlyData);

  const handleFilterChange = (option) => {
    setSelectedFilter(option);

    if (option === "This Year") setChartData(yearlyData);
    if (option === "This Month") setChartData(monthlyData);
    if (option === "This Week") setChartData(weeklyData);
  };

  const options = ["Today", "This Week", "This Month", "This Year"];

  const {
    data: dashboardData,
    isLoading: isLoadingDashboardData,
    refetch: refetchDashboardData,
    isFetching: isFerchingDashboardData,
  } = useApiGet(`admin/dashboard?DateRange=${selected}`);

  // "description": "Invalid DateRange. Allowed values are: Today, This Week, This Month, This Year."  //

  useEffect(() => {
    console.log("this", dashboardData?.data);
  }, [dashboardData]);

  // api/admin/dashboard
  const stats = [
    {
      title: "Total Contributions",
      subtitle: "Total Savings ",
      amount: formatCurrency(
        dashboardData?.data?.metrics?.totalSavings?.value || 0
      ),
      change: "+24%",
      icon: <DashboardTCIcon />,
      color: "text-pink-500",
      bgColor: "bg-pink-100",
      changeColor: "text-green-600 bg-green-100",
    },
    {
      title: "Refer Success Rate",
      subtitle: "Referral Success rate ",
      amount: dashboardData?.data?.metrics?.referralSuccessRate?.value || "0",
      change: "-14%",
      icon: <DashboardReferIcon />,
      color: "text-green-500",
      bgColor: "bg-green-100",
      changeColor: "text-red-600 bg-red-100",
    },
    {
      title: "Total Loans Disbursed",
      subtitle: "Total loans disbursed ",
      amount: formatCurrency(
        dashboardData?.data?.metrics?.totalLoansDisbursed?.value || 0
      ),
      change: "+24%",
      icon: <DashboardTLIcon />,
      color: "text-red-500",
      bgColor: "bg-red-100",
      changeColor: "text-green-600 bg-green-100",
    },
    {
      title: "Pending Loan Applications",
      subtitle: "Pending loan applications ",
      amount: formatCurrency(
        dashboardData?.data?.metrics?.totalPendingLoan?.value || 0
      ),
      change: "-60%",
      icon: <DashboardPendingIcon />,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
      changeColor: "text-red-600 bg-red-100",
    },
    {
      title: "Total Registered Users",
      subtitle: "Total registered users ",
      amount: dashboardData?.data?.metrics?.totalRegisteredUsers?.value || "0",
      change: "+74%",
      icon: <DashboardTRIcon />,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      changeColor: "text-green-600 bg-green-100",
    },
    {
      title: "Defaulted Loan Amount",
      subtitle: "Defaulted loan amount ",
      amount: formatCurrency(
        dashboardData?.data?.metrics?.defaultedLoanAmount?.value || 0
      ),
      change: "+90%",
      icon: <DashboardDlIcon />,
      color: "text-gray-500",
      bgColor: "bg-gray-100",
      changeColor: "text-green-600 bg-green-100",
    },
  ];
  return (
    <div className="">
      <div className=" mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <FilterIcon className="w-4 h-4" />
              <span>{selected}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {options.map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => setSelected(option)}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4 ">
        {stats.map((stat, index) => (
          <div key={index} className="p-4 bg-white rounded-2xl border">
            <div className="flex items-center space-x-2">
              <span className={`text-xl ${stat.color}`}>{stat.icon}</span>
              <h3 className="text-base font-semibold">{stat.title}</h3>
            </div>
            <p className="text-[#939393] font-normal text-xs">
              {stat.subtitle} {selected}
            </p>
            {isLoadingDashboardData || isFerchingDashboardData ? (
              <Spinner />
            ) : (
              <div className=" flex gap-4  flex-wrap mt-7 items-center">
                <span className="text-xl font-semibold">{stat.amount}</span>
                {/* <span
                className={`text-sm px-2 py-1 rounded-full ${stat.changeColor}`}
              >
                {stat.change}
              </span> */}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 bg-white rounded-lg mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Total Revenue</h2>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <FilterIcon className="w-4 h-4" />
                <span>{selectedFilter}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {filterOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => handleFilterChange(option)}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
            >
              <XAxis width={70} dataKey="name" />
              <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
              <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
              {/* <Legend /> */}
              <Bar
                radius={[6, 6, 6, 6]}
                dataKey="interest"
                fill="#041F62"
                name="Loan Interest"
              />
              <Bar
                radius={[6, 6, 6, 6]}
                dataKey="deactivation"
                fill="#FB0300"
                name="Deactivation Fee"
              />
              <Bar
                radius={[6, 6, 6, 6]}
                dataKey="defaulting"
                fill="#34C759"
                name="Loan Defaulting Fee"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
