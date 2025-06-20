import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: string
            
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        role: string
        username: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: string
    }
}

interface FormErrors {
    [key: string]: string;
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
  }