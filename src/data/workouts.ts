import "server-only";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";

async function requireUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

export type WorkoutWithExercises = Awaited<
  ReturnType<typeof getWorkoutsByDate>
>[number];

// All workouts the authenticated user performed on a given date (YYYY-MM-DD),
// with their exercises (ordered) and each exercise's sets (ordered). The query
// is scoped to the current user's id so a user can only ever read their own data.
export async function getWorkoutsByDate(performedOn: string) {
  const userId = await requireUserId();

  return db.query.workoutsTable.findMany({
    where: { userId, performedOn },
    orderBy: { createdAt: "asc" },
    with: {
      workoutExercises: {
        orderBy: { position: "asc" },
        with: {
          exercise: true,
          sets: { orderBy: { setNumber: "asc" } },
        },
      },
    },
  });
}
