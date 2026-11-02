"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Dumbbell } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

// UI-only placeholder data. No fetching / server code yet — this is replaced
// by real data later. Shaped to match the workout model (title, exercises,
// each with its sets).
type PlaceholderSet = { reps: number; weight: number; unit: "kg" | "lb" };
type PlaceholderExercise = { name: string; sets: PlaceholderSet[] };
type PlaceholderWorkout = {
  id: number;
  title: string;
  exercises: PlaceholderExercise[];
};

const PLACEHOLDER_WORKOUTS: PlaceholderWorkout[] = [
  {
    id: 1,
    title: "Push Day",
    exercises: [
      {
        name: "Bench Press",
        sets: [
          { reps: 8, weight: 80, unit: "kg" },
          { reps: 8, weight: 80, unit: "kg" },
          { reps: 6, weight: 85, unit: "kg" },
        ],
      },
      {
        name: "Overhead Press",
        sets: [
          { reps: 10, weight: 40, unit: "kg" },
          { reps: 10, weight: 40, unit: "kg" },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Accessories",
    exercises: [
      {
        name: "Triceps Pushdown",
        sets: [
          { reps: 12, weight: 25, unit: "kg" },
          { reps: 12, weight: 25, unit: "kg" },
        ],
      },
    ],
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const workouts = PLACEHOLDER_WORKOUTS;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Workouts logged on the selected date.
          </p>
        </div>

        <Popover>
          <PopoverTrigger
            render={
              <Button variant="outline" className="w-full justify-start sm:w-56">
                <CalendarIcon data-icon="inline-start" />
                {date ? format(date, "do MMM yyyy") : "Pick a date"}
              </Button>
            }
          />
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              autoFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col gap-4">
        {workouts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
              <Dumbbell className="text-muted-foreground size-8" />
              <p className="text-sm font-medium">No workouts logged</p>
              <p className="text-muted-foreground text-sm">
                {date
                  ? `Nothing recorded for ${format(date, "do MMM yyyy")}.`
                  : "Pick a date to see workouts."}
              </p>
            </CardContent>
          </Card>
        ) : (
          workouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader>
                <CardTitle>{workout.title}</CardTitle>
                <CardDescription>
                  {date ? format(date, "do MMM yyyy") : null}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {workout.exercises.map((exercise, exerciseIndex) => (
                  <div key={exerciseIndex} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{exercise.name}</span>
                      <Badge variant="secondary">
                        {exercise.sets.length} set
                        {exercise.sets.length === 1 ? "" : "s"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {exercise.sets.map((set, setIndex) => (
                        <Badge key={setIndex} variant="outline">
                          {set.reps} × {set.weight}
                          {set.unit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
