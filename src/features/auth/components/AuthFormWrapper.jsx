function AuthFormWrapper({
  title,
  fields,
  onSubmit,
  isSubmitting,
  submitLabel,
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="
          flex
          w-full
          max-w-md
          flex-col
          gap-5
          rounded-xl
          bg-zinc-900
          p-8
        "
      >
        <h1 className="text-3xl font-bold">{title}</h1>

        {fields}

        <button
          disabled={isSubmitting}
          className="
            rounded-md
            bg-red-500
            p-3
            font-semibold
            transition
            hover:bg-red-600
            disabled:opacity-50
          "
        >
          {isSubmitting ? `${submitLabel}...` : submitLabel}
        </button>
      </form>
    </div>
  );
}

export default AuthFormWrapper;
