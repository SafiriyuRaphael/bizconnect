export default function getBaseType(mime: string): "image" | "pdf" | "document" {
    const imageTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
    const pdfTypes = ["application/pdf"];
    const docTypes = [
        "application/msword", // .doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/vnd.ms-excel", // .xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "text/plain", // .txt
        "application/rtf", // .rtf
        "application/vnd.ms-powerpoint", // .ppt
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    ];

    if (imageTypes.includes(mime)) return "image";
    if (pdfTypes.includes(mime)) return "pdf";
    if (docTypes.includes(mime)) return "document";

    throw new Error("Unsupported file type");
};