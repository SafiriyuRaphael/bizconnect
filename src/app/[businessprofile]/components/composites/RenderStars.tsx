import { Star } from "lucide-react";
import React from "react";

export default function RenderStars({
  rating,
  size = "w-4 h-4",
}: {
  rating: number;
  size?: string;
}) {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`${size} ${
        i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
      }`}
    />
  ));
}
