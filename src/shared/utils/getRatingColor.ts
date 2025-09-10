export default function getRatingColor(rating: number): string {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 3.5) return "text-yellow-600";
    if (rating >= 2.5) return "text-orange-600";
    return "text-red-600";
}
