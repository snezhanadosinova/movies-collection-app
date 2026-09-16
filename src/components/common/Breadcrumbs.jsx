import { useContext } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { BreadcrumbHostContext } from "@/components/layout/breadcrumbContext";

export default function Breadcrumbs({ to, state, replace, label, current }) {
  const host = useContext(BreadcrumbHostContext);
  const parentLabel = label.replace(/^Back to /i, "").replace(/^Browse /i, "");
  const displayLabel = parentLabel.charAt(0).toUpperCase() + parentLabel.slice(1);
  const content = (
    <nav aria-label="Breadcrumb" className="border-t border-zinc-800 bg-zinc-950">
      <ol className="mx-auto flex min-h-12 max-w-7xl items-center gap-2 px-4 text-sm sm:px-6 lg:px-8">
        <li className="shrink-0">
          <Link to="/" className="inline-flex min-h-11 items-center rounded px-1 text-zinc-300 hover:text-red-400 focus-visible:outline-2 focus-visible:outline-red-400">Home</Link>
        </li>
        <li aria-hidden="true" className="shrink-0 text-zinc-500">/</li>
        <li className="min-w-0 shrink">
          <Link to={to} state={state} replace={replace} aria-label={label}
            className="flex min-h-11 items-center rounded px-1 text-zinc-300 hover:text-red-400 focus-visible:outline-2 focus-visible:outline-red-400">
            <span className="truncate">{displayLabel}</span>
          </Link>
        </li>
        <li aria-hidden="true" className="shrink-0 text-zinc-500">/</li>
        <li aria-current="page" className="min-w-0 flex-1 truncate py-3 font-medium text-white" title={current}>{current}</li>
      </ol>
    </nav>
  );
  return host ? createPortal(content, host) : content;
}