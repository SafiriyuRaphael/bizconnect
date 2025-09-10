export default function handleDirection(address: string | null | undefined) {
    if (!address) return;
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(mapsUrl, "_blank");
}
