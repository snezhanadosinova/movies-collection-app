import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/movies", label: "Movies" },
  { to: "/tv", label: "TV Series" },
];

export default function MobileNavigation() {
  return (
    <Popover className="md:hidden">
      {({ open, close }) => (
        <>
          <PopoverButton
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            className="flex size-11 items-center justify-center rounded-lg border border-zinc-700 text-red-400 hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-5">
              {open ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </PopoverButton>
          <PopoverPanel className="absolute inset-x-0 top-full z-40 max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-zinc-700 bg-zinc-950 p-4 shadow-xl md:hidden">
            <ul className="mx-auto flex max-w-7xl flex-col gap-2">
              {links.map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    onClick={() => close()}
                    className={({ isActive }) =>
                      "flex min-h-11 items-center rounded-lg px-4 py-3 font-medium focus-visible:outline-2 focus-visible:outline-red-400 " +
                      (isActive ? "bg-red-500/15 text-red-400" : "text-white hover:bg-zinc-800")
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
}
