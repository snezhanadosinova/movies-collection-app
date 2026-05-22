/**
 * Movie Trailer Section Component
 */

export function MovieTrailerSection({ trailer }) {
  if (!trailer) return null;

  return (
    <div className="mx-auto max-w-7xl p-10">
      <h2 className="mb-4 text-2xl font-bold">Trailer</h2>

      <iframe
        className="h-[500px] w-full"
        src={`https://www.youtube.com/embed/${trailer.key}`}
        allowFullScreen
        title="Movie Trailer"
      />
    </div>
  );
}
