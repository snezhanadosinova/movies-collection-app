/**
 * Profile Info Card Component
 */

export function ProfileInfoCard({ user }) {
  return (
    <div className="rounded-xl bg-zinc-900 p-6">
      <div className="text-xl font-bold">{user?.displayName}</div>
      <p className="text-zinc-400">{user?.email}</p>
    </div>
  );
}
