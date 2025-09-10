export default function formatTimeAgo(date: Date) {
    const now = new Date().getTime();
    const past = new Date(date).getTime();
    const diff = now - past;

    if (diff < 0) return "Just now";

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
        return `${minutes}m ago`;
    } else if (hours < 24) {
        return `${hours}h ago`;
    } else {
        return `${days}d ago`;
    }
};