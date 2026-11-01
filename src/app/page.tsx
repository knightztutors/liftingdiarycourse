import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import { listWorkouts, createWorkoutAction, deleteWorkoutAction } from "./actions/workouts";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 text-center dark:bg-black">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Track your lifts
        </h1>
        <p className="max-w-md text-zinc-600 dark:text-zinc-400">
          Sign in to log workouts and watch your progress over time.
        </p>
        <SignInButton mode="modal">
          <button className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]">
            Sign in to get started
          </button>
        </SignInButton>
      </main>
    );
  }

  const workouts = await listWorkouts();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-10">
      <section>
        <h1 className="mb-4 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          New workout
        </h1>
        <form
          action={createWorkoutAction}
          className="flex flex-col gap-3 rounded-xl border border-black/[.08] p-5 dark:border-white/[.145]"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex flex-1 flex-col gap-1 text-sm font-medium">
              Title
              <input
                name="title"
                type="text"
                placeholder="Push day"
                className="rounded-md border border-black/[.12] bg-transparent px-3 py-2 text-sm dark:border-white/[.18]"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium">
              Date
              <input
                name="performedOn"
                type="date"
                defaultValue={today}
                required
                className="rounded-md border border-black/[.12] bg-transparent px-3 py-2 text-sm dark:border-white/[.18]"
              />
            </label>
          </div>
          <button
            type="submit"
            className="self-start rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Add workout
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-black dark:text-zinc-50">
          Your workouts
        </h2>
        {workouts.length === 0 ? (
          <p className="text-sm text-zinc-500">No workouts yet — add your first one above.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {workouts.map((w) => (
              <li
                key={w.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-black/[.08] px-4 py-3 dark:border-white/[.145]"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-black dark:text-zinc-50">
                    {w.title || "Untitled workout"}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {w.performedOn}
                  </p>
                </div>
                <form action={deleteWorkoutAction}>
                  <input type="hidden" name="id" value={w.id} />
                  <button
                    type="submit"
                    className="rounded-full px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
