"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { workoutsTable, type NewWorkout } from "@/db/schema";

async function requireUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

export async function listWorkouts() {
  const userId = await requireUserId();
  return db
    .select()
    .from(workoutsTable)
    .where(eq(workoutsTable.userId, userId))
    .orderBy(desc(workoutsTable.performedOn));
}

// All workouts performed on a given date (YYYY-MM-DD), with their exercises
// (ordered) and each exercise's sets — everything the dashboard needs to render.
export async function listWorkoutsByDate(performedOn: string) {
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

// A single workout with its sets (and each set's exercise) via relational query.
export async function getWorkout(id: number) {
  const userId = await requireUserId();
  const workout = await db.query.workoutsTable.findFirst({
    where: { id, userId },
    with: {
      workoutExercises: {
        with: { exercise: true, sets: true },
      },
    },
  });
  return workout ?? null;
}

export async function createWorkout(
  input: Pick<NewWorkout, "title" | "performedOn">,
) {
  const userId = await requireUserId();
  const [workout] = await db
    .insert(workoutsTable)
    .values({ ...input, userId })
    .returning();
  revalidatePath("/");
  return workout;
}

export async function updateWorkout(
  id: number,
  input: Partial<Pick<NewWorkout, "title" | "performedOn">>,
) {
  const userId = await requireUserId();
  const [workout] = await db
    .update(workoutsTable)
    .set(input)
    .where(and(eq(workoutsTable.id, id), eq(workoutsTable.userId, userId)))
    .returning();
  revalidatePath("/");
  return workout;
}

// FormData wrappers for use directly as <form action={...}>.
export async function createWorkoutAction(formData: FormData) {
  const performedOn = String(formData.get("performedOn") || "");
  const title = String(formData.get("title") || "").trim();
  if (!performedOn) throw new Error("Date is required");
  await createWorkout({
    performedOn,
    title: title || null,
  });
}

export async function deleteWorkoutAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Invalid workout id");
  await deleteWorkout(id);
}

export async function deleteWorkout(id: number) {
  const userId = await requireUserId();
  await db
    .delete(workoutsTable)
    .where(and(eq(workoutsTable.id, id), eq(workoutsTable.userId, userId)));
  revalidatePath("/");
}
