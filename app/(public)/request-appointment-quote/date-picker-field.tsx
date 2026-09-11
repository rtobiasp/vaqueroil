import DatePicker from "@/components/date-picker";

type DatePickerFieldProps = {
  onDateChange: (date: Date | undefined) => void;
};

export function DatePickerField({ onDateChange }: DatePickerFieldProps) {
  return (
    <div>
      <label htmlFor="date">Date</label>
      <DatePicker onDateChange={onDateChange} />
    </div>
  );
}
