import {
  integer,
  pgTable,
  pgEnum,
  varchar,
  text,
  timestamp,
  date,
  real,
  index,
} from "drizzle-orm/pg-core";
import { defineRelations } from "drizzle-orm";

// Users are authenticated via Clerk; `userId` holds the Clerk user id (string).
// There is no local users table.

// Weight unit recorded per set (allows mixed units across a session).
export const weightUnit = pgEnum("weight_unit", ["kg", "lb"]);

// Reusable, per-user catalog of exercise definitions.
export const exercisesTable = pgTable(
  "exercises",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar({ length: 255 }).notNull(),
    name: varchar({ length: 255 }).notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("exercises_user_idx").on(t.userId)],
);

// A workout session.
export const workoutsTable = pgTable(
  "workouts",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar({ length: 255 }).notNull(),
    title: varchar({ length: 255 }),
    performedOn: date().notNull(),
    // Nullable timestamps set when the session begins / ends.
    startedAt: timestamp(),
    completedAt: timestamp(),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (t) => [index("workouts_user_idx").on(t.userId)],
);

// Junction/instance: an exercise performed within a specific workout, ordered
// by `position`. This is what makes the model normalized — the workout↔exercise
// association lives here, and sets hang off it.
export const workoutExercisesTable = pgTable(
  "workout_exercises",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    workoutId: integer()
      .notNull()
      .references(() => workoutsTable.id, { onDelete: "cascade" }),
    exerciseId: integer()
      .notNull()
      .references(() => exercisesTable.id, { onDelete: "cascade" }),
    // Order of this exercise within the workout.
    position: integer().notNull().default(1),
    notes: text(),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (t) => [
    index("workout_exercises_workout_idx").on(t.workoutId),
    index("workout_exercises_exercise_idx").on(t.exerciseId),
  ],
);

// A single set belonging to one workout-exercise instance.
export const setsTable = pgTable(
  "sets",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    workoutExerciseId: integer()
      .notNull()
      .references(() => workoutExercisesTable.id, { onDelete: "cascade" }),
    setNumber: integer().notNull().default(1),
    reps: integer().notNull(),
    // weight in the accompanying `unit`.
    weight: real().notNull(),
    unit: weightUnit().notNull().default("kg"),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (t) => [index("sets_workout_exercise_idx").on(t.workoutExerciseId)],
);

export const relations = defineRelations(
  { exercisesTable, workoutsTable, workoutExercisesTable, setsTable },
  (r) => ({
    exercisesTable: {
      workoutExercises: r.many.workoutExercisesTable(),
    },
    workoutsTable: {
      workoutExercises: r.many.workoutExercisesTable(),
    },
    workoutExercisesTable: {
      workout: r.one.workoutsTable({
        from: r.workoutExercisesTable.workoutId,
        to: r.workoutsTable.id,
      }),
      exercise: r.one.exercisesTable({
        from: r.workoutExercisesTable.exerciseId,
        to: r.exercisesTable.id,
      }),
      sets: r.many.setsTable(),
    },
    setsTable: {
      workoutExercise: r.one.workoutExercisesTable({
        from: r.setsTable.workoutExerciseId,
        to: r.workoutExercisesTable.id,
      }),
    },
  }),
);

export type Exercise = typeof exercisesTable.$inferSelect;
export type NewExercise = typeof exercisesTable.$inferInsert;
export type Workout = typeof workoutsTable.$inferSelect;
export type NewWorkout = typeof workoutsTable.$inferInsert;
export type WorkoutExercise = typeof workoutExercisesTable.$inferSelect;
export type NewWorkoutExercise = typeof workoutExercisesTable.$inferInsert;
export type Set = typeof setsTable.$inferSelect;
export type NewSet = typeof setsTable.$inferInsert;
