import { format, isToday, isYesterday, parseISO } from "date-fns";

export default function getDateLabel(date: string) {
    const parsed = parseISO(date);
    if (isToday(parsed)) return "Today";
    if (isYesterday(parsed)) return "Yesterday";
    return format(parsed, "MMMM d, yyyy");
};