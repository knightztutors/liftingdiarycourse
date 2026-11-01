"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { exercisesTable, type NewExercise } from "@/db/schema";

async function requireUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

export async function listExercises() {
  const userId = await requireUserId();
  return db
    .select()
    .from(exercisesTable)
    .where(eq(exercisesTable.userId, userId));
}

export async function createExercise(input: Pick<NewExercise, "name">) {
  const userId = await requireUserId();
  const [exercise] = await db
    .insert(exercisesTable)
    .values({ ...input, userId })
    .returning();
  revalidatePath("/");
  return exercise;
}

export async function updateExercise(
  id: number,
  input: Partial<Pick<NewExercise, "name">>,
) {
  const userId = await requireUserId();
  const [exercise] = await db
    .update(exercisesTable)
    .set(input)
    .where(and(eq(exercisesTable.id, id), eq(exercisesTable.userId, userId)))
    .returning();
  revalidatePath("/");
  return exercise;
}

export async function deleteExercise(id: number) {
  const userId = await requireUserId();
  await db
    .delete(exercisesTable)
    .where(and(eq(exercisesTable.id, id), eq(exercisesTable.userId, userId)));
  revalidatePath("/");
}
