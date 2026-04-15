import { useSocketStore } from "@/shared/store/useSocketStore";

export default async function handleFileDownload(url: string, name: string) {
    try {
        const response = await fetch(url, { mode: "cors" });
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = name || "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
        console.error("Download failed:", err);
        useSocketStore.getState().setError("Download failed");
    }
};
