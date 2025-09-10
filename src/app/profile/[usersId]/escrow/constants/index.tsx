export const DISPUTE_REASONS = [
  { value: "", label: "Select a reason..." },
  { value: "product_not_delivered", label: "Product/Service Not Delivered" },
  { value: "product_defective", label: "Product Defective/Damaged" },
  { value: "not_as_described", label: "Not As Described" },
  { value: "incomplete_delivery", label: "Incomplete Delivery" },
  { value: "late_delivery", label: "Late Delivery" },
  { value: "quality_issues", label: "Quality Issues" },
  { value: "unauthorized_changes", label: "Unauthorized Changes to Agreement" },
  { value: "communication_issues", label: "Communication Problems" },
  { value: "refund_request", label: "Refund Request" },
  { value: "other", label: "Other" },
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
