import { Upload, X } from "lucide-react";
import { useState } from "react";
import { BusinessDisplayPicsProps, ProfileData } from "../../../../../types";
import MessageModal from "@/app/components/ui/MessageModal";
import { uploadMultipleCloudinary } from "@/lib/cloudinary/uploadMultipleCloudinary";
import uploadPictures from "@/lib/Image/uploadPictures";
import deletePictures from "@/lib/Image/deletePictures";

interface DisplayPictureSectionProps {
  pictures: BusinessDisplayPicsProps[];
  onUpdatePictures: (pictures: BusinessDisplayPicsProps[]) => void;
  businessId: string;
}

export default function DisplayPictureSection({
  pictures,
  onUpdatePictures,
  businessId,
}: DisplayPictureSectionProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const handleFileUpload = async (files: File[]) => {
    setUploading(true);
    const oversized = files.find((file) => file.size > 10 * 1024 * 1024);
    if (files.length > 10) {
      setMessage("Maximum of 10 pictures allowed.");
      setIsOpenModal(true);
      return;
    }
    if (oversized) {
      setMessage("File size must be less than 10MB");
      setIsOpenModal(true);
      return;
    }

    try {
      const uploadedUrls = await uploadMultipleCloudinary(files);

      const newPictures = uploadedUrls.map((image, index) => ({
        url: image?.imageUrl,
        public_id: image?.public_id,
        name: files[index].name,
      }));
      const pictures = await uploadPictures({
        pictures: newPictures,
        businessId,
      });
      onUpdatePictures(pictures.pics);
    } catch (err) {
      console.log(err);

      setMessage(`${err}`);
      setIsOpenModal(true);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const removePicture = async (public_id: string) => {
    console.log(pictures);
    setIsDeleting(true);
    try {
      const updatedPics = await deletePictures({ businessId, public_id });
      onUpdatePictures(updatedPics.pics);
    } catch (error) {
      setMessage("failed to delete picture");
      setIsOpenModal(true);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <MessageModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        message={message}
        type="error"
        autoClose
        autoCloseDelay={3000}
        showIcon
        title="Failed to add display pics"
      />
      {pictures.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            Business Gallery
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {pictures.map((picture) => (
              <div key={picture.url} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={picture.url}
                    alt={picture.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {!isDeleting ? (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <button
                        onClick={() => removePicture(picture.public_id)}
                        className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        title="Remove"
                        disabled={isDeleting}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="loader ease-linear rounded-full border-2 border-t-transparent border-white w-5 h-5 animate-spin" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {pictures.length === 10 ? (
          <p>
            Maximum number of pictures reached. Please delete one to upload
            more.
          </p>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
          >
            <div className="space-y-2">
              <Upload className="w-8 h-8 mx-auto text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">
                  Drag and drop images here, or{" "}
                  <label className="text-blue-600 hover:underline cursor-pointer">
                    browse
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, or GIF only • Max size: 10MB per file • Limit: 10
                  images
                </p>
              </div>
            </div>
          </div>
        )}
        {uploading && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-blue-600">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Uploading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
