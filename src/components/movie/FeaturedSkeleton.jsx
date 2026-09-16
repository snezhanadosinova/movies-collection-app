export default function FeaturedSkeleton() {
  return (
    <div className="pb-6" role="status" aria-label="Loading featured movies">
      <span className="sr-only">Loading featured movies...</span>
      <div aria-hidden="true" className="h-[75vh] w-full bg-zinc-900 skeleton-pulse" />
    </div>
  );
}
