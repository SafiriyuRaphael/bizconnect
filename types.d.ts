import NextAuth, { DefaultSession } from "next-auth"
import type { NextApiResponse } from 'next';
import { Server as HTTPServer } from 'http';
import { Socket } from 'net';
import { Server as IOServer } from 'socket.io';
import React from "react";

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: string
            username?: string;
            logo?: string | null;
            businessName?: string;
            userRole: "user" | "admin"

        } & DefaultSession["user"]
    }

    interface User {
        id: string;
        role: string;
        username?: string;
        logo?: string | null;
        businessName?: string;
        userRole: "user" | "admin"
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
        userRole: "user" | "admin"
    }
}


interface SessionUser {
    id: string;
    role: string;
    username?: string;
    picture?: string | null;
    businessName?: string;
    name?: string | null;
    email?: string | null;
    logo?: string | null
    userRole: string
}


// types/socket.ts


export interface NextApiResponseWithSocket extends NextApiResponse {
    socket: Socket & {
        server: HTTPServer & {
            io?: IOServer;
        };
    };
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
    displayPics?: BusinessDisplayPicsProps[]
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
    reviews?: BusinessReviewsProps[];
    displayPics?: BusinessDisplayPicsProps[]
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
    displayPics?: BusinessDisplayPicsProps[]
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
    displayPics?: BusinessDisplayPicsProps[]
    averageRating: number
}
interface BusinessDisplayPicsProps {
    url: string
    name: string
    uploadedAt: Date
    public_id: string;
}

interface BusinessPriceRangeProps {
    min: number
    max: number
}

interface BusinessReviewsProps {
    _id?: string
    rating: number;
    comment: string;
    username?: string
    displayPic: string
    userId: string
    createdAt?: Date
    helpful?: BusinessReviewHelpfulProps
    fullName?: string | null
}

interface BusinessReviewHelpfulProps {
    count: number;
    voters: string[]
}

type AddReviewProps = BusinessReviewsProps & {
    businessId: string;
};

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

interface AllUsernames {
    _id: string[]
    status: string
}

interface PasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    title?: string
    variant?: "default" | "premium" | "success" | "warning" | "error";
    size?: "sm" | "md" | "lg" | "xl";
    showPattern?: boolean;
    showGlow?: boolean;
    blurIntensity?: "light" | "medium" | "heavy";
}

interface PasswordValidation {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
}

interface Contact {
    id: string;
    name: string;
    company: string;
    lastMessage: string;
    timestamp: string; // ISO timestamp
    displayTime: string; // Formatted time for display
    avatar: string;
    online: boolean;
    unread: number;
    username: string
}


export type IdDocumentType = {
    idUrl: string;
    public_id: string;
    idType: "driver_license" | "national_id_card" | "voters_card" | "international_passport";
};

export interface VerificationType {
    _id?: string;
    userId?: string;
    fullName: string;
    businessName: string;
    businessAddress: string;
    businessPhone: string;
    documentUrl?: string;
    selfieUrl?: string;
    idDocument: IdDocumentType;
    businessLogo?: string;
    status?: "pending" | "approved" | "rejected";
    reason?: string;
    submittedAt?: Date;
    verifiedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

interface VerificationStatusProps {
    status: "pending" | "approved" | "rejected"
    submittedAt: Date
    verifiedAt?: Date
    reason?: string
}