import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

type DatePickerProps = {
  onDateChange?: (date: Date | undefined) => void;
  value?: Date | undefined;
};

export default function DatePicker({ onDateChange, value }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [open, setOpen] = React.useState(false);

  function handleSelect(selectedDate: Date | undefined) {
    setDate(selectedDate);
    onDateChange?.(selectedDate);
    if (selectedDate) {
      setOpen(false);
    }
  }

  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const threeMonthsFromNow = React.useMemo(() => {
    const d = new Date(today);
    d.setMonth(d.getMonth() + 3);
    return d;
  }, [today]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            type="button"
            id="date-trigger"
            className={cn(
              "flex h-auto w-full items-center justify-start gap-2.5 rounded-xl border border-white/10 bg-bg-dark/60 px-4 py-3 text-left text-sm font-normal text-text-inverse transition-colors hover:border-accent-primary hover:bg-bg-dark hover:text-text-inverse sm:text-base",
              !date && "text-text-inverse/60",
            )}
          />
        }
      >
        <CalendarIcon
          className="h-4 w-4 shrink-0 text-accent-primary"
          aria-hidden="true"
        />
        {date ? (
          <span className="font-medium capitalize">
            {format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
          </span>
        ) : (
          <span>Elige un día…</span>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="w-auto border-white/10 bg-surface-mid p-2 text-text-inverse"
        align="start"
      >
        <Calendar
          mode="single"
          locale={es}
          selected={date}
          onSelect={handleSelect}
          disabled={[{ before: today }, { dayOfWeek: [0, 6] }]}
          startMonth={today}
          endMonth={threeMonthsFromNow}
          autoFocus
        />
        <p className="px-3 pt-1 pb-2 text-xs text-text-inverse/50">
          Lun–Vie · Cerramos fines de semana
        </p>
      </PopoverContent>
    </Popover>
  );
}
