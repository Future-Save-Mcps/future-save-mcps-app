import { useState } from "react";
import { Search, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FilterDropdown } from "./FilterDropdown";
import { ExportIcon, FilterIcon } from "./icons/Icons";
import { Drawer } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DatePickerComponent from "./DatePickerComponent";
import { useApiGet, useApiPatch } from "@/hooks/useApi";
import Spinner from "./Spinner";
import TableContainer from "@mui/material/TableContainer";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const AdminTableComponent = ({
  headers,
  data,
  onSearch,
  onFilter,
  onExport,
  view,
  onAddUser,
  showAddUserButton = false,
  loading,
  searchKey = "",
  totalCount = 0,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [auditData, setAuditData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { refetch: refetchAuditTrail } = useApiGet(`admin/audit-trail/all`);
  const { patch } = useApiPatch();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const filteredData = data?.filter((item) => {
    const value = item[searchKey];
    return value?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const displayedData = filteredData;

  const handleFilterChange = (filter) => {
    if (onFilter) onFilter(filter);
  };

  const handleAuditTrail = async () => {
    try {
      const result = await refetchAuditTrail();
      const items = result?.data?.data?.items || [];

      const processedItems = items
        .map((item) => ({
          ...item,
          showFullDescription: false,
          isRead: item.isRead ?? false,
          timeAgo: format(new Date(item.dateTime), "PPpp"),
        }))
        .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

      setAuditData(processedItems);
      setSelectedDate(null);
      setDrawerOpen(true);
    } catch (error) {
      console.error("Failed to fetch audit trail:", error);
    }
  };

  const markAuditTrailAsRead = async (auditTrailId) => {
    try {
      const result = await patch(`/admin/mark-audit-as-read?AuditTrailId=${auditTrailId}`);
      return result?.success === true;
    } catch (error) {
      console.error("Failed to mark audit trail as read:", error);
      return false;
    }
  };

  const handleExport = () => {
    const exportData = data.map((row) => {
      const rowData = {};
      headers.forEach((header) => {
        rowData[header.label] = row[header.value];
      });
      return rowData;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, "exported-data.xlsx");
  };

  const filteredAuditData = selectedDate
    ? auditData.filter((item) => {
        const itemDate = new Date(item.dateTime);
        return itemDate.toDateString() === new Date(selectedDate).toDateString();
      })
    : auditData;

  return (
    <div className="border min-h-[400px] p-4 rounded-2xl">
      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);
              onSearch?.(value);
            }}
            placeholder="Search by User's name"
            className="pl-10 max-w-[300px]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button
            onClick={handleAuditTrail}
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

          <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
            <ExportIcon />
            Export
          </Button>

          {showAddUserButton && (
            <Button
              onClick={onAddUser}
              variant="default"
              className="bg-[#041F62] text-white px-4 hover:bg-[#041F62]"
            >
              <span>+</span> Add User
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
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
                {displayedData?.map((item) => (
                  <TableRow key={item.id}>
                    {headers.map((column, colIndex) => (
                      <TableCell
                        className="font-semibold whitespace-nowrap text-[#5b5b5b]"
                        key={colIndex}
                      >
                        {item[column.value]}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button
                        onClick={() => view(item.id)}
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

          <div className="flex justify-end items-center gap-2 mt-4">
            <Button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              variant="outline"
              size="sm"
            >
              Prev
            </Button>

            <span className="text-sm font-medium">
              Page {currentPage} of {Math.ceil(totalCount / pageSize)}
            </span>

            <Button
              disabled={currentPage === Math.ceil(totalCount / pageSize)}
              onClick={() => onPageChange(currentPage + 1)}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Drawer anchor="right" sx={{ zIndex: 50 }} open={drawerOpen} onClose={toggleDrawer(false)}>
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
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <p className="text-base font-normal">Filter by</p>
                <DatePickerComponent
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                />
              </div>
              {selectedDate && (
                <Button size="sm" variant="outline" onClick={() => setSelectedDate(null)}>
                  Clear
                </Button>
              )}
            </div>

            {selectedDate && (
              <p className="mt-2 text-sm">Selected Date: {selectedDate.toDateString()}</p>
            )}

            <div className="max-w-2xl mx-auto p-4">
              {filteredAuditData?.map((notification) => (
                <div key={notification.auditTrailId} className="mb-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 mt-1">
                      {notification.showFullDescription ||
                      notification.description.length <= 30
                        ? notification.description
                        : `${notification.description.substring(0, 30)}...`}
                      {notification.description.length > 20 &&
                        !notification.showFullDescription && (
                          <span
                            className="text-[#7499cf] font-semibold cursor-pointer ml-1"
                            onClick={async () => {
                              const success = await markAuditTrailAsRead(notification.auditTrailId);
                              if (success) {
                                setAuditData((prev) =>
                                  prev.map((n) =>
                                    n.auditTrailId === notification.auditTrailId
                                      ? { ...n, showFullDescription: true, isRead: true }
                                      : n
                                  )
                                );
                              }
                            }}
                          >
                            Read more
                          </span>
                        )}
                    </p>
                    <p className="text-gray-500 text-xs">{notification.timeAgo}</p>
                  </div>
                  {!notification.isRead && (
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
