export default function getTimeAgo(date: string | Date): string {
    const createdAt = new Date(date).getTime();
    const now = Date.now();
    const diffInSeconds = Math.floor((now - createdAt) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} sec${diffInSeconds !== 1 ? "s" : ""} ago`;
    }

    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) {
        return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }

    const days = Math.floor(hours / 24);
    if (days < 30) {
        return `${days} day${days !== 1 ? "s" : ""} ago`;
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
        return `${months} month${months !== 1 ? "s" : ""} ago`;
    }

    const years = Math.floor(months / 12);
    return `${years} year${years !== 1 ? "s" : ""} ago`;
}
