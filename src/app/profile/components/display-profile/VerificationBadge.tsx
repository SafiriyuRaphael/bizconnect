import { AlertCircle, CheckCircle } from "lucide-react";

export default function VerificationBadge({
  verified,
}: {
  verified: boolean | undefined;
}) {
  return (
    <div
      className={`flex items-center space-x-2 px-3 py-2 rounded-full ${
        verified
          ? "bg-green-50 border border-green-200"
          : "bg-gray-50 border border-gray-200"
      }`}
    >
      {verified ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <AlertCircle className="w-4 h-4 text-gray-400" />
      )}
      <span
        className={`text-sm font-medium ${
          verified ? "text-green-700" : "text-gray-600"
        }`}
      >
        {verified ? "Verified Account" : "Unverified Account"}
      </span>
    </div>
  );
}
