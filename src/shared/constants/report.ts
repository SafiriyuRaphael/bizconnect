import {
    X,
    AlertTriangle,
    Flag,
    Shield,
    FileText,
    User,
    MessageSquareWarning,
} from "lucide-react";

const REPORT_CATEGORIES = [
    {
        id: "spam",
        label: "Spam or Fake Account",
        icon: Shield,
        description: "Fake profiles, spam messages, or suspicious activity",
    },
    {
        id: "harassment",
        label: "Harassment or Bullying",
        icon: MessageSquareWarning,
        description: "Threatening, intimidating, or abusive behavior",
    },
    {
        id: "inappropriate",
        label: "Inappropriate Content",
        icon: AlertTriangle,
        description: "Adult content, violence, or disturbing material",
    },
    {
        id: "misleading",
        label: "False or Misleading Information",
        icon: FileText,
        description: "Deceptive business practices or false claims",
    },
    {
        id: "impersonation",
        label: "Impersonation",
        icon: User,
        description: "Pretending to be someone else or a fake business",
    },
    {
        id: "other",
        label: "Something Else",
        icon: Flag,
        description: "Other policy violations or concerns",
    },
];

export { REPORT_CATEGORIES }