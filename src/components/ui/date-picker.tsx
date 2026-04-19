import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: string; // ISO date string "YYYY-MM-DD" or ""
  onChange: (value: string) => void;
  max?: string; // ISO date string upper bound
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  max,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const selected = React.useMemo(() => {
    if (!value) return null;
    const d = parse(value, "yyyy-MM-dd", new Date());
    return isValid(d) ? d : null;
  }, [value]);

  const maxDate = React.useMemo(() => {
    if (!max) return undefined;
    const d = parse(max, "yyyy-MM-dd", new Date());
    return isValid(d) ? d : undefined;
  }, [max]);

  const handleValueChange = (date: Date | undefined) => {
    onChange(date && isValid(date) ? format(date, "yyyy-MM-dd") : "");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              className,
            )}
          />
        }
      >
        <CalendarIcon className="mr-2 size-4 shrink-0 opacity-60" />
        {selected ? format(selected, "d MMMM yyyy") : placeholder}
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected ?? undefined}
          onSelect={handleValueChange}
          captionLayout="dropdown"
          disabled={maxDate ? (date) => date > maxDate : undefined}
        />
      </PopoverContent>
    </Popover>
  );
}
