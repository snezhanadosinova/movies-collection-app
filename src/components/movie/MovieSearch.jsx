import { useId } from "react";

function MovieSearch({ value, onChange }) {
  const inputId = useId();

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-medium text-zinc-200"
      >
        Search movies
      </label>

      <input
        id={inputId}
        type="search"
        placeholder="Enter a movie title..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="
          min-h-12 w-full rounded-xl border border-zinc-700
          bg-zinc-900 px-4 py-3 text-white
          placeholder:text-zinc-400
          focus-visible:outline-2 focus-visible:outline-offset-2
          focus-visible:outline-red-400
        "
      />
    </div>
  );
}

export default MovieSearch;
