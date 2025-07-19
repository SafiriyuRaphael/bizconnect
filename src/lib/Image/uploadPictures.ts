import { BASEURL } from "@/constants/url";
import { BusinessDisplayPicsProps } from "../../../types";

export default async function uploadPictures({ businessId, pictures }: { businessId: string, pictures: { url: string; name: string; public_id: string }[] }) {
    try {
        const res = await fetch(`/api/pictures/upload-picture`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ businessId, pictures }),
        });

        if (!res.ok) {
            const errorText = await res.json();
            throw new Error(`Failed to upload pictures.${errorText.error}`);
        }
        const data: { message: string; pics: BusinessDisplayPicsProps[] } = await res.json();

        return data
    }
    catch (err: any) {
        throw new Error(`Error uploading pictures: ${err.message || err}`);
    }
}
