import { ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useEffect, useCallback, useState } from "react";
import { BusinessDisplayPicsProps } from "../../../../types";

type Props = {
  selectedImageIndex: number | null;
  setSelectedImageIndex: (index: number | null) => void;
  displayPics?: BusinessDisplayPicsProps[];
};

export default function ImageModal({
  selectedImageIndex,
  setSelectedImageIndex,
  displayPics,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const closeImageModal = useCallback(() => {
    setSelectedImageIndex(null);
  }, [setSelectedImageIndex]);

  const nextImage = useCallback(() => {
    if (
      selectedImageIndex !== null &&
      displayPics &&
      selectedImageIndex < displayPics.length - 1
    ) {
      setSelectedImageIndex(selectedImageIndex + 1);
      setIsLoading(true);
    }
  }, [selectedImageIndex, displayPics, setSelectedImageIndex]);

  const prevImage = useCallback(() => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
      setIsLoading(true);
    }
  }, [selectedImageIndex, setSelectedImageIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;

      switch (e.key) {
        case "Escape":
          closeImageModal();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prevImage();
          break;
        case "ArrowRight":
          e.preventDefault();
          nextImage();
          break;
      }
    };

    if (selectedImageIndex !== null) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedImageIndex, closeImageModal, nextImage, prevImage]);

  // Touch navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeImageModal();
    }
  };

  if (selectedImageIndex === null || !displayPics) return null;

  const currentImage = displayPics[selectedImageIndex];
  const isFirstImage = selectedImageIndex === 0;
  const isLastImage = selectedImageIndex === displayPics.length - 1;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center transition-opacity duration-300"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-modal-title"
      aria-describedby="image-modal-description"
    >
      <div className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center">
        {/* Close button */}
        <button
          onClick={closeImageModal}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200 z-20 bg-black bg-opacity-50 rounded-full p-2"
          aria-label="Close image modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}

        {/* Main image */}
        <img
          src={currentImage.url}
          alt={`Business image ${selectedImageIndex + 1} of ${
            displayPics.length
          }`}
          className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={handleImageLoad}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          id="image-modal-title"
        />

        {/* Navigation buttons */}
        {displayPics.length > 1 && (
          <>
            <button
              onClick={prevImage}
              disabled={isFirstImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              disabled={isLastImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image counter and dots indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
            {selectedImageIndex + 1} / {displayPics.length}
          </div>

          {/* Dots indicator for better visual navigation */}
          {displayPics.length > 1 && displayPics.length <= 10 && (
            <div className="flex gap-1">
              {displayPics.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImageIndex(index);
                    setIsLoading(true);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === selectedImageIndex
                      ? "bg-white"
                      : "bg-white bg-opacity-50 hover:bg-opacity-75"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Keyboard navigation hint */}
        <div
          className="absolute lg:block hidden top-4 left-4 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded opacity-75 "
          id="image-modal-description"
        >
          Use ←→ keys or swipe to navigate • ESC to close
        </div>
      </div>
    </div>
  );
}
