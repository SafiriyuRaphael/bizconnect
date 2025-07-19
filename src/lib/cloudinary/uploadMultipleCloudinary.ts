import { uploadCloudinary } from "./uploadClodinary";

export const uploadMultipleCloudinary = async (files: File[]) => {
    const uploadPromises = files.map((file) => uploadCloudinary(file));
    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls; 
};