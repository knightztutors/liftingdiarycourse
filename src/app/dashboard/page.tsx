import { format, isValid, parse } from "date-fns";
import { Dumbbell } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getWorkoutsByDate } from "@/data/workouts";

import { DatePicker } from "./date-picker";

export default async function DashboardPage(props: PageProps<"/dashboard">) {
  const { date: dateParam } = await props.searchParams;

  // Resolve the selected date from the URL (?date=YYYY-MM-DD), falling back to
  // today when it is missing or invalid.
  const raw = Array.isArray(dateParam) ? dateParam[0] : dateParam;
  const parsed = raw ? parse(raw, "yyyy-MM-dd", new Date()) : null;
  const selectedDate = parsed && isValid(parsed) ? parsed : new Date();
  const performedOn = format(selectedDate, "yyyy-MM-dd");

  const workouts = await getWorkoutsByDate(performedOn);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Workouts logged on the selected date.
          </p>
        </div>

        <DatePicker selected={selectedDate} />
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col gap-4">
        {workouts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
              <Dumbbell className="text-muted-foreground size-8" />
              <p className="text-sm font-medium">No workouts logged</p>
              <p className="text-muted-foreground text-sm">
                Nothing recorded for {format(selectedDate, "do MMM yyyy")}.
              </p>
            </CardContent>
          </Card>
        ) : (
          workouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader>
                <CardTitle>{workout.title ?? "Untitled workout"}</CardTitle>
                <CardDescription>
                  {format(selectedDate, "do MMM yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {workout.workoutExercises.map((workoutExercise) => (
                  <div
                    key={workoutExercise.id}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {workoutExercise.exercise?.name ?? "Exercise"}
                      </span>
                      <Badge variant="secondary">
                        {workoutExercise.sets.length} set
                        {workoutExercise.sets.length === 1 ? "" : "s"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {workoutExercise.sets.map((set) => (
                        <Badge key={set.id} variant="outline">
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
