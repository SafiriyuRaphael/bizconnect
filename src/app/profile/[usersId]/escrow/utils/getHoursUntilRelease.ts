export default function getHoursUntilRelease(releaseDate: Date | string | null) {
    if (!releaseDate) return null;
    const release = new Date(releaseDate);
    const now = new Date();

    const diffInMs = release.getTime() - now.getTime();
    const diffInHours = Math.ceil(diffInMs / (1000 * 60 * 60));
    return diffInHours > 0 ? diffInHours : 0;
};