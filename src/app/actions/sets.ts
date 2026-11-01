"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { setsTable, type NewSet } from "@/db/schema";

async function requireUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

// A set is owned via its workout-exercise instance → workout → userId.
async function assertOwnsWorkoutExercise(
  workoutExerciseId: number,
  userId: string,
) {
  const workoutExercise = await db.query.workoutExercisesTable.findFirst({
    columns: { id: true },
    where: { id: workoutExerciseId, workout: { userId } },
  });
  if (!workoutExercise) throw new Error("Workout exercise not found");
}

export async function addSet(
  input: Pick<
    NewSet,
    "workoutExerciseId" | "setNumber" | "reps" | "weight" | "unit"
  >,
) {
  const userId = await requireUserId();
  await assertOwnsWorkoutExercise(input.workoutExerciseId, userId);
  const [set] = await db.insert(setsTable).values(input).returning();
  revalidatePath("/");
  return set;
}

export async function updateSet(
  id: number,
  input: Partial<Pick<NewSet, "setNumber" | "reps" | "weight" | "unit">>,
) {
  const userId = await requireUserId();
  const existing = await db.query.setsTable.findFirst({
    columns: { workoutExerciseId: true },
    where: { id },
  });
  if (!existing) throw new Error("Set not found");
  await assertOwnsWorkoutExercise(existing.workoutExerciseId, userId);
  const [set] = await db
    .update(setsTable)
    .set(input)
    .where(eq(setsTable.id, id))
    .returning();
  revalidatePath("/");
  return set;
}

export async function deleteSet(id: number) {
  const userId = await requireUserId();
  const existing = await db.query.setsTable.findFirst({
    columns: { workoutExerciseId: true },
    where: { id },
  });
  if (!existing) throw new Error("Set not found");
  await assertOwnsWorkoutExercise(existing.workoutExerciseId, userId);
  await db.delete(setsTable).where(eq(setsTable.id, id));
  revalidatePath("/");
}
