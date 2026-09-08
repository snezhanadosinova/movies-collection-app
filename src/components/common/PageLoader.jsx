function PageLoader() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center"
      role="status"
    >
      <div
        className="h-8 w-8 animate-spin rounded-full border-2
                   border-zinc-700 border-t-red-500
                   motion-reduce:animate-none"
        aria-hidden="true"
      />

      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default PageLoader;