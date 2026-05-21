function MovieSearch({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search movies..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full
        rounded-xl
        border
        border-zinc-700
        bg-zinc-900
        p-4
        outline-none
        transition
        focus:border-red-500
      "
    />
  );
}

export default MovieSearch;
