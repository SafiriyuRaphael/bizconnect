export default function getDaysUntilRelease(
    releaseDate: Date | string | null
): number | null {
    if (!releaseDate) return null;

    const release = new Date(releaseDate);
    const now = new Date();

    const diffMs = release.getTime() - now.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
};