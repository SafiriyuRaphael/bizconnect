import { format, parseISO } from "date-fns";
import { Message } from "../../../../types";

export default function groupMessagesByDate(messages: Message[]) {
    const grouped: { date: string; messages: Message[] }[] = [];
    let currentDate = "";
    messages.forEach((msg) => {
        if (!msg.timestamp || typeof msg.timestamp !== "string") {
            console.error("Invalid timestamp for message:", msg);
            return;
        }
        try {
            const parsedDate = parseISO(msg.timestamp);
            if (isNaN(parsedDate.getTime())) {
                console.error("Invalid date parsed for message:", msg);
                return;
            }
            const msgDate = format(parsedDate, "yyyy-MM-dd");
            if (msgDate !== currentDate) {
                currentDate = msgDate;
                grouped.push({ date: msgDate, messages: [msg] });
            } else {
                grouped[grouped.length - 1].messages.push(msg);
            }
        } catch (error) {
            console.error("Error parsing timestamp for message:", msg, error);
        }
    });
    return grouped;
};