import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

type DatePickerProps = {
  onDateChange?: (date: Date | undefined) => void;
};

export default function DatePicker({ onDateChange }: DatePickerProps) {
  const [date, setDate] = React.useState<Date>();

  function handleSelect(selectedDate: Date | undefined) {
    setDate(selectedDate);
    onDateChange?.(selectedDate);
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          />
        }
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, "PPP") : <span>Pick a date</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
