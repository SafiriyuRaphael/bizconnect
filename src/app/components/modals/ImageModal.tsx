import { ChevronLeft, ChevronRight, X } from "lucide-react";
import React from "react";
import { BusinessDisplayPicsProps } from "../../../../types";

type Props = {
  selectedImageIndex: number | null;
  setSelectedImageIndex: React.Dispatch<React.SetStateAction<number | null>>;
  displayPics?: BusinessDisplayPicsProps[];
};

export default function ImageModal({
  selectedImageIndex,
  setSelectedImageIndex,
  displayPics,
}: Props) {
  const closeImageModal = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (
      selectedImageIndex !== null &&
      displayPics &&
      selectedImageIndex < displayPics.length - 1
    ) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  if (selectedImageIndex === null || !displayPics) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={closeImageModal}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <X className="w-8 h-8" />
        </button>

        <img
          src={displayPics[selectedImageIndex].url}
          alt={`Business image ${selectedImageIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />

        {displayPics.length > 1 && (
          <>
            <button
              onClick={prevImage}
              disabled={selectedImageIndex === 0}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 disabled:opacity-50"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={nextImage}
              disabled={selectedImageIndex === displayPics.length - 1}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 disabled:opacity-50"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
          {selectedImageIndex + 1} / {displayPics.length}
        </div>
      </div>
    </div>
  );
}
