interface ContactResponse {
    id: string;
    name: string;
    username: string;
    company: string;
    lastMessage: string;
    timestamp: string;
    avatar: string;
    online: boolean;
    unread: number;
    createdAt?: string
    starred?: boolean
}


type ContactResponse = Contact;
type ContactsResponse = Contact[];




type GetContactsResponse =
    | ContactResponse
    | ContactsResponse
