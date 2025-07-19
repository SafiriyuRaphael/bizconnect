const getSignature = async () => {
    const res = await fetch("/api/sign-cloudinary");
    return await res.json();
};

export const uploadCloudinary = async (file: File | null) => {
    if (!file) return
    const { signature, timestamp, apiKey, cloudName } = await getSignature();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", "business_logos");

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData
    });

    const data = await res.json();
    const imageUrl = data.secure_url
    const image = { imageUrl, public_id: data.public_id }
    return image
};