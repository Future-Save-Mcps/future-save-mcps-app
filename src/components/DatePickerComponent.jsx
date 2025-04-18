import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";


const DatePickerComponent = ({ selectedDate, onDateChange }) => {
  const [date, setDate] = React.useState(selectedDate);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    onDateChange && onDateChange(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="p-0 border-none  justify-between text-left">
          {date ? format(date, "PPP") : "Date"} <CalendarIcon className=" h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerComponent;
