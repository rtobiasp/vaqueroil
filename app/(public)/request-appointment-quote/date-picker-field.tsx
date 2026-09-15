import DatePicker from "@/components/date-picker";

type DatePickerFieldProps = {
  onDateChange: (date: Date | undefined) => void;
  value?: Date | undefined;
};

export function DatePickerField({ onDateChange, value }: DatePickerFieldProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label
        htmlFor="date-trigger"
        className="text-sm font-medium text-text-inverse/90"
      >
        Fecha <span aria-hidden="true" className="text-accent-ink">*</span>
      </label>
      <DatePicker onDateChange={onDateChange} value={value} />
      <p className="text-xs text-text-inverse/50">
        Solo días laborables. Podrás elegir la hora justo debajo.
      </p>
    </div>
  );
}
