import { useId, useState } from "react";

const PREVIEW_LENGTH = 600;

export function PersonBiography({ biography }) {
  const [expanded, setExpanded] = useState(false);
  const headingId = useId();
  const contentId = useId();

  const text = biography?.trim() || "";
  const isLong = text.length > PREVIEW_LENGTH;

  let preview = text;

  if (isLong) {
    const candidate = text.slice(0, PREVIEW_LENGTH);
    const lastWhitespace = candidate.search(/\s+\S*$/);

    preview =
      lastWhitespace > 0
        ? candidate.slice(0, lastWhitespace).trimEnd()
        : candidate;
  }

  const visibleText =
    isLong && !expanded ? `${preview}…` : text;

  return (
    <section aria-labelledby={headingId} className="mt-8">
      <h2 id={headingId} className="text-2xl font-bold">
        Biography
      </h2>

      <p
        id={contentId}
        className="mt-4 whitespace-pre-line leading-7 text-zinc-300"
      >
        {visibleText || "Biography is unavailable."}
      </p>

      {isLong && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={() => setExpanded((current) => !current)}
          className="
            mt-3 min-h-11 rounded py-2 font-medium text-red-400
            focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-red-400
          "
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </section>
  );
}