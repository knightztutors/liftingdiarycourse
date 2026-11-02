"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Interactive date selector. Does NOT fetch data — it only reflects the
// selected date into the URL (`?date=YYYY-MM-DD`) so the Server Component can
// read it and fetch the matching workouts.
export function DatePicker({ selected }: { selected: Date }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSelect(date: Date | undefined) {
    if (!date) return;
    setOpen(false);
    startTransition(() => {
      router.push(`/dashboard?date=${format(date, "yyyy-MM-dd")}`);
    });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="w-full justify-start sm:w-56"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : (
              <CalendarIcon data-icon="inline-start" />
            )}
            {format(selected, "do MMM yyyy")}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
