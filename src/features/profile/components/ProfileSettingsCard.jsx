/**
 * Profile Settings Card Component
 */
import { useState } from "react";
import toast from "react-hot-toast";
import { updateUserProfile } from "@/features/auth/services/authService";

export function ProfileSettingsCard({ user, onProfileUpdate }) {
  const [firstName, setFirstName] = useState(
    user?.displayName?.split(" ")[0] || "",
  );

  const [lastName, setLastName] = useState(
    user?.displayName?.split(" ")[1] || "",
  );

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      await updateUserProfile({
        firstName,
        lastName,
      });

      await onProfileUpdate();

      setEditMode(false);

      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 rounded-xl bg-zinc-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Settings</h2>

        <button
          onClick={() => setEditMode(!editMode)}
          className="text-sm text-red-400"
        >
          {editMode ? "Cancel" : "Edit"}
        </button>
      </div>

      {editMode ? (
        <div className="space-y-4">
          <input
            className="w-full rounded bg-zinc-800 p-3 text-white"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
          />

          <input
            className="w-full rounded bg-zinc-800 p-3 text-white"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
          />

          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded bg-red-500 px-4 py-2 font-semibold disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
        </div>
      ) : (
        <p className="text-zinc-400">You can only change your display name.</p>
      )}
    </div>
  );
}
