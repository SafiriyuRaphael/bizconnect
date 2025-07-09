import { Book, Briefcase, Car, Code, Home, Palette, Scissors, SoapDispenserDroplet, Stethoscope, Utensils, Volleyball, Wrench } from "lucide-react";
import { BusinessCategory } from "../../types";

const BUSINESSCATEGORIES:BusinessCategory[] =  [
    { value: "all", name: "All Services", icon: Briefcase},
    { value: "fashion", name: "Fashion & Clothing", icon: Scissors },
    { value: "electronics", name: "Electronics & Tech", icon: Code },
    { value: "home", name: "Home & Garden", icon: Home },
    { value: "food", name: "Food & Beverages", icon: Utensils },
    { value: "automotive", name: "Automotive", icon: Car },
    { value: "health", name: "Health & Wellness", icon: Stethoscope },
    { value: "sport", name: "Sports & Recreation", icon: Volleyball },
    {
      value: "beauty",
      name: "Beauty & Personal Care",
      icon: SoapDispenserDroplet
    },
    { value: "books", name: "Books & Education", icon: Book },
    { value: "art", name: "Art & Crafts", icon: Palette },
    { value: "other", name: "Others", icon: Wrench },
  ];


export {BUSINESSCATEGORIES}