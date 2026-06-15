"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error("Unhandled application error", error);
  }, [error]);

  return (
    <div className="grid min-h-screen place-items-center px-6">
      <main className="max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.25em] text-rose-300">Application error</p>
        <h1 className="mt-4 text-3xl font-semibold">ToolHive hit an unexpected error</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          The app shell captured the failure so the rest of the platform can continue to recover.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-emerald-400 px-5 text-sm font-medium text-slate-950 transition hover:bg-emerald-300"
        >
          Try again
        </button>
      </main>
    </div>
  );
}