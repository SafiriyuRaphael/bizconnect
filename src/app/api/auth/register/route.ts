import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongo/initDB'
import User from '@/model/User'
import { hash } from 'bcrypt'
import { Customer } from '@/model/Customer'
import { Business } from '@/model/Business'
import { RegisterData } from '../../../../../types'


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
