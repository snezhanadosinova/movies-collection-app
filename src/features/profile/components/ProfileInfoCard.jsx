import { useState } from "react";

import { EditProfileModal } from "./EditProfileModal";

export function ProfileInfoCard({ user, loading = false, onProfileUpdate }) {
  const [editOpen, setEditOpen] = useState(false);
  const isReady = !loading && Boolean(user);

  return (
    <>
      <section
        className="min-h-[124px] rounded-xl bg-zinc-900 p-6"
        aria-busy={loading}
      >
        {isReady ? (
          <>
            <div className="flex min-h-10 items-center gap-3">
              <h2 className="min-w-0 break-words text-xl font-bold">
                {user.displayName || "Your profile"}
              </h2>

              <button
                type="button"
                onClick={() => setEditOpen(true)}
                aria-label="Edit display name"
                className="shrink-0 rounded px-2 py-1 text-sm
                           text-red-400 hover:text-red-300
                           focus-visible:outline-2
                           focus-visible:outline-offset-2
                           focus-visible:outline-red-400"
              >
                Edit
              </button>
            </div>

            <p className="mt-3 break-words text-zinc-400">{user.email}</p>
          </>
        ) : (
          <div role="status" aria-label="Loading profile">
            <span className="sr-only">Loading profile...</span>

            <div
              aria-hidden="true"
              className="animate-pulse motion-reduce:animate-none"
            >
              <div className="flex h-10 items-center">
                <div className="h-6 w-48 max-w-full rounded bg-zinc-800" />
              </div>

              <div className="mt-3 flex h-6 items-center">
                <div className="h-4 w-56 max-w-full rounded bg-zinc-800" />
              </div>
            </div>
          </div>
        )}
      </section>

      {isReady && editOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setEditOpen(false)}
          onProfileUpdate={onProfileUpdate}
        />
      )}
    </>
  );
}
