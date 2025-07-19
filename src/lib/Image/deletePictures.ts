import { BASEURL } from "@/constants/url";
import { BusinessDisplayPicsProps } from "../../../types";

export default async function deletePictures({ businessId, public_id }: { businessId: string; public_id: string }) {
    try {
        const res = await fetch(`/api/pictures/delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ businessId, public_id }),
        });

        if (!res.ok) {
            throw new Error(`Failed to delete picture`);
        }
        const data: { message: string; pics: BusinessDisplayPicsProps[] } = await res.json();

        return data
    }
    catch (err: any) {
        throw new Error(`Error deleting picture: ${err.message || err}`);
    }
}
