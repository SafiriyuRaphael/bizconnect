import {
  CheckCircle,
  Clock,
  DollarSign,
  Heart,
  MapPin,
  MessageCircle,
  Star,
  User,
} from "lucide-react";
import { AllBusinessProps } from "../../../../types";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { generateDefaultLogo } from "@/lib/Image/generateDefaultLogo";
import { useRouter } from "next/navigation";

type Props = {
  service: AllBusinessProps;
  setSelectedServices: React.Dispatch<React.SetStateAction<string[]>>;
  selectedServices: string[];
};

export default function ServiceCard({
  service,
  setSelectedServices,
  selectedServices,
}: Props) {
  const toggleFavorite = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  function formatDeliveryTime(days: number) {
    if (days === 0) return "Not specified";
    if (days <= 1) return "Same day";
    if (days <= 3) return "1-3 days";
    if (days <= 7) return "1 week";
    return "2+ weeks";
  }

  const router = useRouter();

  const generateDefaultLogoDataUrl = (name: string): string => {
    const svg = generateDefaultLogo(name);
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const {
    reviews,
    _id,
    businessAddress,
    priceRange,
    businessDescription,
    verified,
    logo,
    username,
    businessName,
    deliveryTime,
    averageRating,
  } = service;
  const allReviews = reviews?.flatMap((r) => r.comment).length || 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group w-full max-w-sm mx-auto sm:max-w-none">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        {logo ? (
          <CldImage
            alt={businessName}
            src={logo}
            width="500"
            className="w-full h-40 sm:h-48 md:h-52 object-cover group-hover:scale-105 transition-transform duration-300"
            height="500"
            crop={{
              type: "auto",
              source: true,
            }}
          />
        ) : (
          <Image
            src={generateDefaultLogoDataUrl(businessName)}
            alt={businessName}
            width={500}
            height={500}
            className="w-full h-40 sm:h-48 md:h-52 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <button
          onClick={() => toggleFavorite(_id)}
          className={`absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full transition-colors ${
            selectedServices.includes(_id)
              ? "bg-red-500 text-white"
              : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
          }`}
        >
          <Heart
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill={selectedServices.includes(_id) ? "white" : "none"}
          />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight pr-2">
            {businessName}
          </h3>
          {verified && (
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
          )}
        </div>

        {/* Username */}
        <div className="flex items-center gap-2 mb-2">
          <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
          <span className="text-xs sm:text-sm text-gray-600 truncate">
            {username}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
          <span className="text-xs sm:text-sm font-medium text-gray-900">
            {averageRating || 0}
          </span>
          <span className="text-xs sm:text-sm text-gray-500">
            ({allReviews} reviews)
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 leading-relaxed">
          {businessDescription?.length > 80
            ? `${businessDescription.slice(0, 80)}...`
            : businessDescription || "No description available"}
        </p>

        {/* Location and Delivery Time */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 text-xs text-gray-500">
          <div className="flex items-center gap-1 min-w-0">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{businessAddress}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span className="whitespace-nowrap">
              {formatDeliveryTime(deliveryTime)}
            </span>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Price */}
          <div className="flex items-center gap-1">
            <span className="text-base sm:text-lg font-bold text-gray-900">
              {priceRange?.max === 0
                ? "₦ Varies"
                : `₦${priceRange?.min} - ₦${priceRange?.max}` || "₦ Varies"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <MessageCircle className="w-4 h-4" />
            </button>
            <button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 sm:px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 text-xs sm:text-sm font-medium"
              onClick={() => router.push(`/${username}`)}
            >
              More Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
