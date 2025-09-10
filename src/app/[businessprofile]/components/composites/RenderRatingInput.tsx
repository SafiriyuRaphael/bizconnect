import { Star } from "lucide-react";
import { useUserDashboardStore } from "../../store";

export default function RenderRatingInput({ canRate }: { canRate: boolean }) {
  if (!canRate) return null;

  const { newRating, isEditable, setNewRating } = useUserDashboardStore();

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-6 h-6 cursor-pointer transition-colors ${
            i < newRating
              ? "text-yellow-400 fill-current"
              : "text-gray-300 hover:text-yellow-300"
          }`}
          onClick={() => (isEditable ? setNewRating(i + 1) : null)}
        />
      ))}
      <span className="ml-3 text-sm font-medium text-gray-700">
        ({newRating} / 5)
      </span>
    </div>
  );
}
