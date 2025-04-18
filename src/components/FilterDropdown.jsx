"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function FilterDropdown({ onFilterChange }) {
  const [filterType, setFilterType] = useState("status");
  const [statusValue, setStatusValue] = useState("");
  const [planValue, setPlanValue] = useState("");
  const [dateValue, setDateValue] = useState();

  const handleFilterTypeChange = (value) => {
    setFilterType(value);
    // Reset values when changing filter type
    setStatusValue("");
    setPlanValue("");
    setDateValue(null);
    onFilterChange({ type: value, value: null });
  };

  const handleValueChange = (value) => {
    switch (filterType) {
      case "status":
        setStatusValue(value);
        onFilterChange({ type: "status", value });
        break;
      case "plan":
        setPlanValue(value);
        onFilterChange({ type: "plan", value });
        break;
      case "date":
        setDateValue(value);
        onFilterChange({ type: "date", value });
        break;
    }
  };

  return (
 
      <CardContent  className=" p-3">
        <h2 className="mb-2"> Filter</h2>
        <div className="flex w-full   items-center gap-3">
          <Select  className="bg-black" value={filterType} onValueChange={handleFilterTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select filter type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="status">By Status</SelectItem>
              <SelectItem value="plan">By Plan</SelectItem>
              <SelectItem value="date">By Date</SelectItem>
            </SelectContent>
          </Select>

          {filterType === "status" && (
            <Select value={statusValue} onValueChange={handleValueChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
              </SelectContent>
            </Select>
          )}

          {filterType === "plan" && (
            <Select value={planValue} onValueChange={handleValueChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25 Weeks">25 weeks</SelectItem>
                <SelectItem value="50 Weeks">50 weeks</SelectItem>
              </SelectContent>
            </Select>
          )}

          {filterType === "date" && (
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
          )}
        </div>
      </CardContent>
 
  );
}
