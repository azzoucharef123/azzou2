export default function ArticleLoading() {
  return (
    <div className="shell pt-14 pb-20 sm:pt-16 sm:pb-24">
      <div className="h-5 w-48 rounded-full bg-white/40 dark:bg-slate-950/35" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-5">
          <div className="h-8 w-32 rounded-full bg-white/45 dark:bg-slate-950/35" />
          <div className="h-16 w-4/5 rounded-[1.8rem] bg-white/50 dark:bg-slate-950/40" />
          <div className="h-5 w-2/3 rounded-full bg-white/40 dark:bg-slate-950/35" />
        </div>
        <div className="h-[24rem] rounded-[1.95rem] bg-[linear-gradient(135deg,#07152d,#2368c5)]" />
      </div>
      <div className="mt-12 grid gap-10 xl:grid-cols-[0.78fr_2fr]">
        <div className="editorial-card h-56 rounded-[2rem]" />
        <div className="editorial-card h-[52rem] rounded-[2.2rem]" />
      </div>
    </div>
  );
}
