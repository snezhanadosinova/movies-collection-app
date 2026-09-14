function PageLoader() {
  return (
    <div role="status" aria-label="Loading page" className="mx-auto min-h-[60vh] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <span className="sr-only">Loading...</span>
      <div aria-hidden="true" className="space-y-6 skeleton-pulse">
        <div className="h-10 w-2/3 max-w-md rounded-xl bg-zinc-800" />
        <div className="h-6 w-1/3 rounded-xl bg-zinc-800" />
        <div className="h-64 rounded-xl bg-zinc-800" />
      </div>
    </div>
  );
}
export default PageLoader;
