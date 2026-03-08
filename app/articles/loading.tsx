export default function ArticlesLoading() {
  return (
    <div className="shell pt-14 pb-20 sm:pt-16 sm:pb-24">
      <div className="h-5 w-40 rounded-full bg-white/40 dark:bg-slate-950/35" />
      <div className="mt-6 h-16 w-2/3 rounded-[1.8rem] bg-white/50 dark:bg-slate-950/40" />
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div className="editorial-card h-[28rem] rounded-[2.15rem]" key={index} />
        ))}
      </div>
      <div className="editorial-card mt-12 h-28 rounded-[2rem]" />
      <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="editorial-card h-[22rem] rounded-[2.15rem]" key={index} />
        ))}
      </div>
    </div>
  );
}
