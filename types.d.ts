import NextAuth, { DefaultSession } from "next-auth"
import type { NextApiResponse } from 'next';
import { Server as HTTPServer } from 'http';
import { Socket } from 'net';
import { Server as IOServer } from 'socket.io';
import React from "react";
import { Document } from "mongoose";

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: string
            username?: string;
            logo?: string | null;
            businessName?: string;
            userRole: "user" | "admin"
            verified: boolean
            verifiedBusiness?: boolean

        } & DefaultSession["user"]
    }

    interface User {
        id: string;
        role: string;
        username?: string;
        logo?: string | null;
        businessName?: string;
        userRole: "user" | "admin"
        verifiedBusiness?: boolean
        verified: boolean
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
        verifiedBusiness?: boolean
        verified: boolean
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
    verified?: boolean
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
    createdAt: string;
    updatedAt?: string

    // Optional customer fields
    deliveryAddress?: string;
    gender?: "male" | "female" | "other" | "prefer-not-to-say";
    dateOfBirth?: string;
    logo?: string;
    role?: "admin" | "user"

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
    verifiedBusiness?: boolean
    verificationData?: BusinessVerificationType
    verificationLog?: VerificationLogType
}



type RegisterData = {
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
    deliveryTime: string
    priceRange?: {
        min: number | string;
        max: number | string;
    };
    verifiedBusiness: boolean
}

interface AllBusinessData {
    entrepreneurs: AllBusinessProps[] | AdminAllBusinessProps[]
    status: string
    total: number
}

interface Pagination {
    total: number
    business: number
    customers: number
    page: number
    limit: number,
    totalPages: number
}

interface AllUserData {
    data: AnyUser[]
    success: boolean
    pagination: Pagination
}

type AdminAllBusinessProps = AllBusinessProps & {
    contactCount: number
    verificationStatus: string
}

type IDType = "driver_license" | "national_id_card" | "voters_card" | "international_passport";

interface VerificationIdDocument {
    idUrl: string;
    public_id: string;
    idType: IDType;
}

interface BusinessVerificationType {
    _id: string;
    userId: string;
    fullName: string;
    businessName: string;
    businessAddress: string;
    businessPhone: string;
    documentUrl?: string;
    selfieUrl?: string;
    idDocument: VerificationIdDocument;
    businessLogo?: string;
    status: "pending" | "approved" | "rejected";
    reason?: string;
    submittedAt?: Date;
    verifiedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
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
    verifiedBusiness: boolean
    contactCount: number
    verificationStatus?: string
    updatedAt: Date
    createdAt: Date
    userType: "business" | "user"
    verificationData: BusinessVerificationType
    verificationLog: VerificationLogType
}

interface VerificationLogType {
    _id?: string;
    verificationId: string;
    userId: string;
    fullName?: string;
    businessName?: string;
    businessAddress?: string;
    businessPhone?: string;
    documentUrl?: string;
    selfieUrl?: string;
    idDocument?: VerificationIdDocument;
    status?: "pending" | "approved" | "rejected";
    businessLogo?: string;
    reason?: string;
    submittedAt?: Date;
    verifiedAt?: Date;
    modifiedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}


interface BusinessDisplayPicsProps {
    file?: File
    url: string
    name: string
    public_id: string;
    uploadedAt?: Date
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

interface UserQueryParams {
    role?: "admin" | "user";
    userType?: "customer" | "business";
    verified?: boolean;
    page?: number;
    limit?: number
    sortBy?: string;
    sortOrder?: string;
    search?: string;
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

interface ProductsItem {
    _id?: string
    userId?: string;
    title: string;
    description?: string;
    tags?: string[];
    type: 'product' | 'service';
    price: string;
    deliveryTime?: string;
    useEscrow?: boolean;
    media?: BusinessDisplayPicsProps[];
    isAvailable?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

interface ProductsItemsPageProps {
    _id?: string
    userId?: string;
    title: string;
    description?: string;
    tags?: string[];
    type: 'product' | 'service';
    price: string;
    deliveryTime?: string;
    useEscrow?: boolean;
    media?: BusinessDisplayPicsProps[];
    isAvailable?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    user: {
        logo: string
        fullName: string
        businessName: string
        averageRating: string
        totalReviews: string
        username: string
        verified: boolean
        email: string
    }
}

type ProductItemsResponse = {
    items: ProductsItem[]
    pagination: {
        page: number
        limit: number
        totalPages: number
        total: number
    },
    stats: {
        totalItems: number
        activeItems: number
        avgPrice: number
        escrowEnabled: number
    },
}


interface PasswordModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    onSubmit?: (data: any) => void;
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

interface CallerProps {
    name: string;
    avatar: string;
    callType: "video" | "audio" | null
}


type IdDocumentType = {
    idUrl: string;
    public_id: string;
    idType: "driver_license" | "national_id_card" | "voters_card" | "international_passport";
};

interface VerificationType {
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


interface Message {
    id: string;
    sender: string;
    recipient: string;
    content?: string;
    file?: {
        url: string;
        type: string;
        name: string;
    };
    type: "text" | "file" | "call";
    callDetails: {
        status: "attempted" | "connected" | "failed" | "rejected" | "ended" | "unavailable";
        callType: "audio" | "video";
    };
    timestamp: string;
    displayTime: string;
    isOwn: boolean;
    isSeen: boolean;
    seenAt?: string;
    avatar: string;
}


interface DisputeResponse {
    userId: Types.ObjectId;
    role: 'buyer' | 'seller';
    message?: string;
    evidence?: string[];
    submittedAt: Date;
}

interface DisputeDocument {
    escrowId: string;
    raisedBy: string;
    raisedByRole: 'buyer' | 'seller';
    reason: string;
    details?: string;
    evidence?: string[];
    responses: DisputeResponse[];
    status: 'open' | 'in_review' | 'resolved' | 'rejected';
    resolution?: string;
    resolvedBy?: string;
    resolvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}


interface Escrow {
    itemId: string;
    buyerId: string;
    sellerId: string;
    price: number;
    status: 'pending' | 'funded' | 'delivered' | 'disputed' | 'released' | 'refunded';
    isDisputed: boolean;
    releaseDate?: Date;
    paymentIntentId?: string;
    deliveryProof?: string;
    notes?: string;
    disputeId?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface EscrowPaymentBody {
    paymentProvider: 'flutterwave' | 'paystack';
    tx_ref: string;
    itemId: string;
    buyerId: string;
    sellerId: string;
    price: number;
    quantity: number;
}

interface IWallet  {
    _id: string;
    userId: string; 
    balance: number;
    locked: number;
    currency: string; 
    status: "active" | "locked";
    createdAt: Date;
    updatedAt: Date;
  }