import { useState } from "react";
import { Search, Clock, Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FilterDropdown } from "./FilterDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import TableContainer from "@mui/material/TableContainer";
import { ExportIcon, FilterIcon } from "./icons/Icons";
import { Drawer } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DatePickerComponent from "./DatePickerComponent";
import { useApiGet } from "@/hooks/useApi";
import Spinner from "./Spinner";

const AdminTableComponent = ({
  headers,
  data,
  onSearch,
  onFilter,
  onExport,
  onAuditTrail,
  view,
  onAddUser, // Function to handle adding a user
  showAddUserButton = false,
  loading,
}) => {
  // const [data, setData] = useState(initialData);
  const [activeFilter, setActiveFilter] = useState(null);

  const {
    data: auditTrail,
    isLoading: isLoadingAuditTrail,
    isFetching,
    refetch: refetchAuditTrail,
  } = useApiGet(`admin/audit-trail/all`);

  ///admin/audit-trail/all
  const [state, setState] = useState(false);
  const [dateValue, setDateValue] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const toggleDrawer = (open) => () => {
    setState(open);
  };
  const handleFilterChange = (filter) => {
    if (onFilter) onFilter(filter);
  };

  const handleValueChange = (value) => {
    setDateValue(value);
  };

  const notifications = [
    {
      id: 1,
      message: "David Agama approved a Thrift Loan of N300,000 for Nonso Udo",
      timeAgo: "5hrs ago",
      isNew: true,
    },
    {
      id: 2,
      message: "Musa Huga rejected a Thrift Loan of N300,000 for Nonso Udo",
      timeAgo: "5hrs ago",
      isNew: true,
    },
    {
      id: 3,
      message: "David Agama approved a Premium Loan of N300,000 for Nonso Udo",
      timeAgo: "5hrs ago",
      isNew: false,
    },
    {
      id: 4,
      message: "David Agama rejected a Premium Loan of N300,000 for Nonso Udo",
      timeAgo: "5hrs ago",
      isNew: false,
    },
  ];

  return (
    <div className="border min-h-[400px] p-4 rounded-2xl">
      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            onChange={(e) => onSearch?.(e.target.value)}
            placeholder="Search for savings plan by User's name"
            className="pl-10 max-w-[300px]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button
            onClick={toggleDrawer(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            Audit Trail
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <FilterIcon />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-[400px] w-[90vw] p-0" align="end">
              <FilterDropdown onFilterChange={handleFilterChange} />
            </PopoverContent>
          </Popover>

          <Button
            onClick={onExport}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ExportIcon />
            Export
          </Button>

          {showAddUserButton && (
            <Button
              onClick={onAddUser}
              variant="default"
              className="bg-[#041F62] text-white px-4 hover:bg-[#041F62]"
            >
              <span>+</span>
              Add User
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="  flex justify-center items-center min-h-[300px] ">
          <Spinner />
        </div>
      ) : (
        <div className="border max-w-[80vw] w-full rounded-lg">
          <TableContainer style={{ overflow: "auto" }}>
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((item, index) => (
                    <TableHead className="whitespace-nowrap" key={index}>
                      {item.label}
                    </TableHead>
                  ))}
                  <TableHead className="whitespace-nowrap">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((item) => (
                  <TableRow key={item.id}>
                    {headers?.map((column, colIndex) => (
                      <TableCell
                        className="font-semibold whitespace-nowrap text-[#5b5b5b]"
                        key={colIndex}
                      >
                        {item[column.value]}
                      </TableCell>
                    ))}

                    <TableCell>
                      <Button
                        onClick={()=>view(item.id)}
                        size="small"
                        variant="default"
                        className="bg-primary py-1 text-white px-4 min-w-[80px] hover:bg-[#1e3f99]"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      <Drawer
        anchor="right"
        sx={{
          zIndex: 50,
        }}
        open={state}
        onClose={toggleDrawer(false)}
      >
        <div className="w-[100vw] relative max-w-[600px]">
          <div className="p-4 bg-white sticky top-0 flex justify-between items-center">
            <h2 className="text-[24px] font-[700]">Audit Trail</h2>
            <CloseIcon
              onClick={toggleDrawer(false)}
              sx={{
                cursor: "pointer",
                padding: "5px",
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                backgroundColor: "#F8F8FA",
              }}
            />
          </div>

          <div className="p-4">
            <div className="">
              <div className="flex items-center justify-end gap-1">
                <p className=" text-base font-normal">Filter by</p>
                <DatePickerComponent
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                />
              </div>
              {selectedDate && (
                <p className="mt-2">
                  Selected Date: {selectedDate.toDateString()}
                </p>
              )}
            </div>
            <div className="max-w-2xl mx-auto p-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="mb-6 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {notification.message}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {notification.timeAgo}
                    </p>
                  </div>
                  {notification.isNew && (
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
export default AdminTableComponent;
