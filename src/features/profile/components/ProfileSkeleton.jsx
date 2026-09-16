import { ProfileFavoritesPreview } from "./ProfileFavoritesPreview";
export default function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-5xl p-6 text-white">
      <h1 className="mb-6 text-3xl font-bold">Profile</h1>
      <section role="status" aria-label="Loading profile" className="min-h-[124px] rounded-xl bg-zinc-900 p-6">
        <span className="sr-only">Loading profile...</span>
        <div aria-hidden="true" className="skeleton-pulse">
          <div className="flex h-10 items-center"><div className="h-6 w-48 max-w-full rounded bg-zinc-800" /></div>
          <div className="mt-3 flex h-6 items-center"><div className="h-4 w-56 max-w-full rounded bg-zinc-800" /></div>
        </div>
      </section>
      <ProfileFavoritesPreview loading slots={[]} />
    </div>
  );
}
