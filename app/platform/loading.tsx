export default function PlatformLoading() {
  return (
    <div className="shell-wide pt-6 pb-20">
      <div className="glass-panel rounded-[2.4rem] px-6 py-8 sm:px-8 sm:py-10">
        <div className="space-y-4">
          <div className="h-6 w-40 rounded-full bg-white/45 dark:bg-slate-950/35" />
          <div className="h-12 w-3/4 rounded-[1.6rem] bg-white/50 dark:bg-slate-950/40" />
          <div className="h-5 w-2/3 rounded-full bg-white/40 dark:bg-slate-950/35" />
        </div>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
        <div className="platform-panel hidden h-96 rounded-[2rem] xl:block" />
        <div className="space-y-6">
          <div className="metric-grid">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="platform-panel h-36 rounded-[2rem]" key={index} />
            ))}
          </div>
          <div className="grid gap-6 2xl:grid-cols-[1.18fr_0.82fr]">
            <div className="platform-panel h-[30rem] rounded-[2rem]" />
            <div className="platform-panel h-[30rem] rounded-[2rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}
