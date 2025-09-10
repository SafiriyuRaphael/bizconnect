import { File, Image } from "lucide-react";
import React from "react";

export default function getFileIcon({ fileName }: { fileName: string }) {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || ""))
    return <Image className="w-4 h-4" />;
  return <File className="w-4 h-4" />;
}
