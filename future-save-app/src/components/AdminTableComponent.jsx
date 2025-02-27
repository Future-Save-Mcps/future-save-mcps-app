"use client";

import { useState } from "react";
import { Search, Clock, FileText, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
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

const initialData = [
  {
    id: 1,
    name: "Williams Elum",
    plan: "25 Weeks",
    targetAmount: "₦ 300,000.00",
    dateCreated: "12/05/2025",
    weeklyAmount: "₦ 5,000.00",
    status: "completed",
  },
  {
    id: 2,
    name: "Williams Elum",
    plan: "50 Weeks",
    targetAmount: "₦ 300,000.00",
    dateCreated: "12/05/2025",
    weeklyAmount: "₦ 5,000.00",
    status: "in-progress",
  },
];

export default function AdminTableComponent({
  headers,
  data,
  onSearch,
  onFilter,
  onExport,
  onAuditTrail,
  view,
}) {
  // const [data, setData] = useState(initialData);
  const [activeFilter, setActiveFilter] = useState(null);
  const [state, setState] = useState(false);
  const [dateValue, setDateValue] = useState();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    // setPlanId(id);
    setState(open);
  };

  const handleFilterChange = (filter) => {
    onFilter();
    // setActiveFilter(filter);
  };



  const handleValueChange = (value) => {
  
        setDateValue(value);
        // onFilterChange({ type: "date", value });
       
    }


  return (
    <div className=" border p-4 rounded-2xl ">
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search for savings plan by Users name"
            className="pl-10 w-[300px]"
          />
        </div>
        <div className="flex items-center gap-4">
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
            <PopoverContent className="max-w-[400px] w-[90vw]  p-0" align="end">
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
        </div>
      </div>

      <div className="border  w-[100%]  rounded-lg">
        <TableContainer
          style={{
            overflow: "auto",
          }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((item) => (
                  <TableHead>{item}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.plan}</TableCell>
                  <TableCell>{item.targetAmount}</TableCell>
                  <TableCell>{item.dateCreated}</TableCell>
                  <TableCell>{item.weeklyAmount}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    <Button
                      onClick={view(true, item.id)}
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

      <Drawer anchor="right" open={state}>
        <div className=" w-[100vw] relative max-w-[600px]">
          <div className=" p-4  bg-white  sticky top-0 flex justify-between mb-4 items-center ">
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

          <div className="p-4 border">

            <div className="border">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateValue && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateValue ? (
                    format(dateValue, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={dateValue}
                  onSelect={handleValueChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            </div>
          

            {/* {isLoadingLoan || isFetching ? <Spinner /> : <>hrllo</>} */}
          </div>
        </div>
      </Drawer>
    </div>
  );
}
