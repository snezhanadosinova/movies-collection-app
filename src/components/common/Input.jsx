function Input({ type = "text", placeholder, error, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      <input
        type={type}
        placeholder={placeholder}
        className="
          rounded-md
          border
          border-zinc-700
          bg-zinc-800
          p-3
          outline-none
          transition
          focus:border-red-500
        "
        {...props}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default Input;
