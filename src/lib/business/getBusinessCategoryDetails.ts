import { BUSINESSCATEGORIES } from "@/constants/business";
import { BusinessCategory } from "../../../types";

export function getBusinessCategoryDetails(category: string): BusinessCategory {
  return (
    BUSINESSCATEGORIES.find((item) => item.value === category) ??
    BUSINESSCATEGORIES.find((item) => item.value === "other")! 
  );
}
