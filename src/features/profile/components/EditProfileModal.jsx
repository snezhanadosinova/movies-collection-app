import { useId } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Description,
} from "@headlessui/react";
import toast from "react-hot-toast";

import { updateUserProfile } from "@/features/auth/services/authService";
import {
  DISPLAY_NAME_MAX_LENGTH,
  normalizeDisplayName,
  validateDisplayName,
} from "@/utils/displayName";

export function EditProfileModal({ user, onClose, onProfileUpdate }) {
  const inputId = useId();
  const errorId = `${inputId}-error`;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      displayName: user.displayName || "",
    },
  });

  const requestClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const onSubmit = async ({ displayName }) => {
    const normalizedName = normalizeDisplayName(displayName);

    if (normalizedName === (user.displayName || "")) {
      onClose();
      return;
    }

    try {
      await updateUserProfile({
        displayName: normalizedName,
      });
    } catch {
      setError("root.server", {
        message: "Could not save your name. Please try again.",
      });

      return;
    }

    try {
      await onProfileUpdate();
    } catch {
      setError("root.server", {
        message:
          "Your name was saved, but the profile could not refresh. Reload the page to see the update.",
      });

      return;
    }

    toast.success("Profile updated");
    onClose();
  };

  return (
    <Dialog open onClose={requestClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/70" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            className="w-full max-w-md rounded-2xl border
                       border-zinc-700 bg-zinc-900 p-6
                       text-white shadow-xl"
          >
            <DialogTitle className="text-xl font-bold">
              Edit display name
            </DialogTitle>

            <Description className="mt-2 text-sm text-zinc-400">
              This name appears on your profile.
            </Description>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              aria-busy={isSubmitting}
              className="mt-6"
            >
              <label
                htmlFor={inputId}
                className="mb-2 block text-sm font-medium"
              >
                Display name
              </label>

              <input
                id={inputId}
                type="text"
                autoComplete="name"
                data-autofocus
                maxLength={DISPLAY_NAME_MAX_LENGTH}
                readOnly={isSubmitting}
                aria-invalid={Boolean(errors.displayName)}
                aria-describedby={errors.displayName ? errorId : undefined}
                className="w-full rounded-lg border border-zinc-700
                           bg-zinc-800 p-3 text-white outline-none
                           focus:border-red-400"
                {...register("displayName", {
                  validate: validateDisplayName,
                })}
              />

              <div className="min-h-6 pt-1">
                {errors.displayName && (
                  <p id={errorId} role="alert" className="text-sm text-red-400">
                    {errors.displayName.message}
                  </p>
                )}
              </div>

              <div className="min-h-16 py-2">
                {errors.root?.server && (
                  <p role="alert" className="text-sm text-red-400">
                    {errors.root.server.message}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={requestClose}
                  disabled={isSubmitting}
                  className="rounded-lg border border-zinc-600
                             px-4 py-2 transition hover:bg-zinc-800
                             disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-36 rounded-lg bg-red-500
                             px-4 py-2 font-semibold transition
                             hover:bg-red-600 disabled:cursor-not-allowed
                             disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
