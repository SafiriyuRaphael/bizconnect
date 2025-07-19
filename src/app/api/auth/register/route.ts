import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongo/initDB'
import User from '@/model/User'
import { hash } from 'bcrypt'
import { Customer } from '@/model/Customer'
import { Business } from '@/model/Business'
import { RegisterData } from '../../../../../types'
import Message from '@/model/Message'
import mongoose from 'mongoose'


export async function POST(req: Request) {
    try {
        const data = await req.json()

        const { email, password, username, phone, userType, businessCategory, businessName, businessDescription, fullName, agreedToTerms, businessAddress, dateOfBirth, gender, deliveryAddress, website, confirmPassword, logo }: RegisterData = data
        console.log(userType);

        if (password !== confirmPassword) return NextResponse.json({ error: "Password mismatched" }, { status: 409 })

        if (!email || !password || !username || !phone || !fullName || !agreedToTerms)
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        if (userType === "business" && (!businessCategory || !businessName || !businessDescription || !businessAddress)) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

        await connectToDatabase();

        // Check for existing email OR username
        const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase().trim() }, // Case-insensitive check
                { username: username.trim() } // Exact match
            ]
        });
        if (existingUser) {
            const errorField =
                existingUser.email.toLowerCase() === email.toLowerCase().trim()
                    ? 'email'
                    : 'username';

            return NextResponse.json(
                {
                    error: `${errorField === 'email' ? 'Email' : 'Username'} already exists`,
                    field: errorField
                },
                { status: 400 }
            );
        }

        const hashedPassword = await hash(password, 12)
        let user;
        if (data.userType === 'customer') {
            user = await Customer.create({
                email,
                phone,
                username,
                password: hashedPassword,
                fullName,
                agreedToTerms,
                deliveryAddress: deliveryAddress || "",
                gender: gender || "prefer-not-to-say",
                dateOfBirth: dateOfBirth || "",
                userType
            });
        } else {
            user = await Business.create({
                email,
                phone,
                username,
                password: hashedPassword,
                fullName,
                agreedToTerms,
                businessName,
                businessCategory,
                businessAddress,
                businessDescription,
                website: website || "",
                userType,
                logo
            });
        }

        // Send welcome message from a system user (e.g., admin with fixed ID)
        const systemUserId = "687647bbc0511928b3c87d70";

        const businessWelcome = `Welcome to BizCon — the hub where businesses connect, grow, and thrive. Showcase your brand, engage with customers, and discover meaningful partnerships tailored to your niche. Get started by completing your profile and uploading your first product or service.`;

        const customerWelcome = `Welcome to BizCon — your platform for discovering trusted local businesses and services. Connect directly with verified providers, explore top-rated offerings, and enjoy a seamless communication experience. Start by updating your profile and finding what matters most to you.`;

        const content = userType === 'business' ? businessWelcome : customerWelcome;

        const welcomeMessage = new Message({
            sender: new mongoose.Types.ObjectId(systemUserId),
            recipient: user._id,
            content,
            isSeen: false,
        });
        await welcomeMessage.save();

        return NextResponse.json({ msg: "User created", user: { fullName, email, username, userType }, status: "success" })
    }

    catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            {
                error: "Internal server error",
                details: process.env.NODE_ENV === 'development'
                    ? error instanceof Error ? error.message : String(error)
                    : undefined
            },
            { status: 500 }
        )
    }
}
