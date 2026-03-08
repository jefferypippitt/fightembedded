export default function AllTimePopularityLoading() {
  return (
    <section className="container space-y-6 pt-4 pb-6">
      <div className="space-y-2">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="h-8 w-56 animate-pulse rounded bg-muted" />
        <div className="h-4 w-96 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-[600px] w-full animate-pulse rounded-xl border border-border/60 bg-muted/40" />
    </section>
  );
}
