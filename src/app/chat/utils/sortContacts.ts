import { Contact } from "../../../../types";

export default function sortContacts(contacts: Contact[]) {
    return [...contacts].sort((a, b) => {
      
      if (a.starred && !b.starred) return -1;
      if (!a.starred && b.starred) return 1;
  
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeB - timeA;
    });
  }
  