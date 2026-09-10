import { useId, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import { getTmdbImageUrl } from "@/utils/tmdbImages";

const PHOTOS_PER_PAGE = 6;

const buttonClassName =
  "inline-flex min-h-11 min-w-11 items-center justify-center " +
  "rounded-xl border border-zinc-700 bg-zinc-900 px-3 text-white " +
  "hover:bg-zinc-800 focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-red-400";

export function PersonGallery({ photos = [], name }) {
  const headingId = useId();
  const listId = useId();

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PHOTOS_PER_PAGE);

  const images = Array.from(
    new Map(
      photos
        .filter((photo) => photo.file_path)
        .map((photo) => [photo.file_path, photo]),
    ).values(),
  );

  if (images.length === 0) return null;

  const visibleImages = images.slice(0, visibleCount);
  const hasMoreImages = visibleImages.length < images.length;

  const isOpen = selectedIndex !== null;
  const currentIndex = Math.min(selectedIndex ?? 0, images.length - 1);
  const currentImage = images[currentIndex];
  const hasMultipleImages = images.length > 1;

  const closeGallery = () => setSelectedIndex(null);

  const showPrevious = () => {
    setSelectedIndex((index) => {
      const current = Math.min(index ?? 0, images.length - 1);

      return (current - 1 + images.length) % images.length;
    });
  };

  const showNext = () => {
    setSelectedIndex((index) => {
      const current = Math.min(index ?? 0, images.length - 1);

      return (current + 1) % images.length;
    });
  };

  const handleKeyDown = (event) => {
    if (
      !hasMultipleImages ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    ) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPrevious();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showNext();
    }
  };

  const showMoreImages = () => {
    setVisibleCount((count) =>
      Math.min(count + PHOTOS_PER_PAGE, images.length),
    );
  };

  return (
    <section aria-labelledby={headingId} className="mt-12">
      <h2 id={headingId} className="text-2xl font-bold">
        Photos
      </h2>

      <ul
        id={listId}
        className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
      >
        {visibleImages.map((photo, index) => (
          <li key={photo.file_path}>
            <button
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Open photo ${index + 1} of ${name}`}
              aria-haspopup="dialog"
              className="
                block aspect-[2/3] w-full overflow-hidden rounded-xl
                bg-zinc-900
                focus-visible:outline-2 focus-visible:outline-offset-2
                focus-visible:outline-red-400
              "
            >
              <img
                src={getTmdbImageUrl(photo.file_path, "w185")}
                alt=""
                loading="lazy"
                width="185"
                height="278"
                className="h-full w-full object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-col items-center gap-3">
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="text-sm text-zinc-400"
        >
          Showing {visibleImages.length} of {images.length} photos
        </p>

        {hasMoreImages && (
          <button
            type="button"
            onClick={showMoreImages}
            aria-controls={listId}
            className={`${buttonClassName} px-6`}
          >
            Load More
          </button>
        )}
      </div>

      <Dialog
        open={isOpen}
        onClose={closeGallery}
        onKeyDown={handleKeyDown}
        className="relative z-50"
      >
        <div
          aria-hidden="true"
          className="fixed inset-0 bg-black/90"
        />

        <div className="fixed inset-0 overflow-y-auto p-3 sm:p-6">
          <div className="flex min-h-full items-center justify-center">
            <DialogPanel
              className="
                flex w-full max-w-5xl flex-col gap-4 rounded-2xl
                border border-zinc-800 bg-zinc-950 p-3 text-white sm:p-5
              "
            >
              <div className="flex items-center justify-between gap-4">
                <DialogTitle className="min-w-0 text-lg font-semibold">
                  Photos of {name}
                </DialogTitle>

                <button
                  type="button"
                  onClick={closeGallery}
                  aria-label="Close gallery"
                  className={buttonClassName}
                >
                  <span aria-hidden="true">✕</span>
                </button>
              </div>

              <div
                className="
                  flex h-[55dvh] items-center justify-center
                  overflow-hidden rounded-xl bg-black sm:h-[65dvh]
                "
              >
                <img
                  key={currentImage.file_path}
                  src={getTmdbImageUrl(currentImage.file_path, "original")}
                  alt={`Photo ${currentIndex + 1} of ${name}`}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                {hasMultipleImages ? (
                  <button
                    type="button"
                    onClick={showPrevious}
                    aria-label="Previous photo"
                    className={buttonClassName}
                  >
                    <span aria-hidden="true">←</span>
                  </button>
                ) : (
                  <span aria-hidden="true" className="w-11" />
                )}

                <p
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  className="text-sm text-zinc-300"
                >
                  Photo {currentIndex + 1} of {images.length}
                </p>

                {hasMultipleImages ? (
                  <button
                    type="button"
                    onClick={showNext}
                    aria-label="Next photo"
                    className={buttonClassName}
                  >
                    <span aria-hidden="true">→</span>
                  </button>
                ) : (
                  <span aria-hidden="true" className="w-11" />
                )}
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </section>
  );
}