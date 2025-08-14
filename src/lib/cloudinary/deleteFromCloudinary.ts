import cloudinary from "./cloudinary";

export async function deleteFromCloudinary(publicId: string) {
    try {
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result !== 'ok' && result.result !== 'not found') {
            console.warn(`Cloudinary deletion warning for ${publicId}:`, result);
            throw new Error(`Failed to delete image with public_id: ${publicId}`);
        }

        return true;
    } catch (error) {
        console.error(`Cloudinary deletion error for ${publicId}:`, error);
        return false;
    }
}
