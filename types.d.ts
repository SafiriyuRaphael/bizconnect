import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: string
            username?: string;
            logo?: string | null;
            businessName?: string;

        } & DefaultSession["user"]
    }

    interface User {
        id: string;
        role: string;
        username?: string;
        logo?: string | null;
        businessName?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
        username?: string;
        picture?: string | null;
        businessName?: string;
        name?: string | null;
        email?: string | null;
    }
}

interface FormErrors {
    [key: string]: string;
}

type ProfileData = {
    fullName?: string;
    email?: string;
    phone?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
    dateOfBirth?: string;
    gender?: string;
    deliveryAddress?: string;
    agreedToTerms?: boolean;

    // Business-only
    businessName?: string;
    businessCategory?: string;
    businessAddress?: string;
    businessDescription?: string;
    website?: string;
    priceRange?: {
        min: number | string;
        max: number | string;
    };
    deliveryTime?: number;
    logo?: string
};


interface AnyUser {
    _id: string;
    userType: "customer" | "business";
    email: string;
    phone: string;
    username: string;
    fullName: string;
    verified?: boolean;
    createdAt?: string;

    // Optional customer fields
    deliveryAddress?: string;
    gender?: "male" | "female" | "other" | "prefer-not-to-say";
    dateOfBirth?: string;
    logo?: string;

    // Optional business fields
    businessName?: string;
    businessCategory?: string;
    businessAddress?: string;
    businessDescription?: string;
    website?: string;
    priceRange?: {
        min: number;
        max: number;
    };
    deliveryTime?: number;
    verifiedBusiness?: boolean;
    reviews?: {
        rating: number;
        comment: string;
    }[];
}

interface RegisterData {
    fullName: string;
    businessName: string;
    email: string;
    phone: string;
    businessCategory: string;
    businessAddress: string;
    deliveryAddress: string;
    username: string;
    password: string;
    confirmPassword: string;
    businessDescription: string;
    website: string;
    gender: string;
    dateOfBirth: string;
    agreedToTerms: boolean;
    userType: "customer" | "business";
    logo: string | null
}

interface AllBusinessData {
    entrepreneurs: AllBusinessProps[]
    status: string
    total: number
}

interface AllBusinessProps {
    _id: string
    businessName: string;
    businessCategory: string;
    businessAddress: string;
    businessDescription: string;
    website: string;
    logo: string;
    email: string;
    phone: string;
    username: string;
    fullName: string;
    reviews: BusinessReviewsProps[];
    priceRange: BusinessPriceRangeProps;
    deliveryTime: number;
    verified: boolean
    averageRating: number
}

interface BusinessPriceRangeProps {
    min: number
    max: number
}

interface BusinessReviewsProps {
    userId: string
    rating: number
    comment: string
    createdAt: Date
}

interface BusinessQueryParams {
    category?: string;
    search?: string;
    rating?: number;
    deliveryTime?: number;
    sort?: "newest" | "rating" | "price-low" | "price-high" | "best";
    page?: number;
    limit?: number;
    maxPrice?: number;
    minPrice?: number
}


type BusinessCategory = {
    value: string;
    name: string;
    icon: LucideIcon;
};

interface AllUsernames {
    usernames: string[]
    status: string
}