export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 px-6 text-slate-100">
      <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="h-3 w-24 rounded-full bg-white/10" />
        <div className="mt-6 space-y-3">
          <div className="h-9 w-4/5 rounded-2xl bg-white/10" />
          <div className="h-4 w-full rounded-full bg-white/10" />
          <div className="h-4 w-5/6 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}