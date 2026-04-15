import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongo/initDB'
import User from '@/model/User'
import { hash } from 'bcrypt'
import { Customer } from '@/model/Customer'
import { Business } from '@/model/Business'
import { RegisterData } from '../../../../../types'
import Message from '@/model/Message'
import mongoose from 'mongoose'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { VerificationLog } from '@/model/VerificationLog'
import { Verification } from '@/model/Verification'
import { Wallet } from '@/model/Wallet'
import { BASEURL } from '@/shared/constants/url'
import { sendEmail } from '@/lib/auth/sendEmail'
import createNotification from '@/lib/socket/createNotification'


export async function POST(req: Request) {

    try {
        const session = await getServerSession(authOptions);
        const isAdmin = session?.user.userRole === "admin"
        const data = await req.json()



        const { email, password, username, phone, userType, businessCategory, businessName, businessDescription, fullName, agreedToTerms, businessAddress, dateOfBirth, gender, deliveryAddress, website, confirmPassword, logo, deliveryTime, displayPics, priceRange, verifiedBusiness }: RegisterData = data
        console.log(userType);

        if (!isAdmin && verifiedBusiness) {
            return NextResponse.json(
                { error: "Unauthorized: invalid request body, verified business passed" },
                { status: 403 }
            );
        }

        if (password !== confirmPassword) return NextResponse.json({ error: "Password mismatched" }, { status: 409 })

        if (!email || !password || !username || !phone || !fullName || !agreedToTerms)
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        if (userType === "business" && (!businessCategory || !businessName || !businessDescription || !businessAddress)) return NextResponse.json({ error: "Missing fields" }, { status: 400 })


        await connectToDatabase();

        // Check for existing email OR username
        const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase().trim() },
                { username: username.trim() }
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
                logo,
                deliveryTime, displayPics, priceRange, verifiedBusiness
            });

            if (verifiedBusiness && isAdmin) {

                await VerificationLog.create({
                    verificationId: user._id,
                    userId: user._id,
                    fullName: user.fullName,
                    businessName: user.businessName,
                    businessAddress: user.businessAddress,
                    businessPhone: user.phone,
                    documentUrl: "/fallbackproduct.png",
                    selfieUrl: "/fallbackproduct.png",
                    idDocument: {
                        idUrl: "/fallbackproduct.png",
                        public_id: "/fallbackproduct.png",
                        idType: "driver_license",
                    },
                    businessLogo: user.logo,
                    status: "approved",
                    reason: "approved on creation by admin",
                    submittedAt: user.submittedAt,
                    verifiedAt: user.verifiedAt,
                });


                await Verification.create({
                    userId: user.id,
                    fullName: user.fullName,
                    businessName: user.businessName,
                    businessAddress: user.businessAddress,
                    businessPhone: user.phone,
                    documentUrl: "/fallbackproduct.png",
                    selfieUrl: "/fallbackproduct.png",
                    idDocument: {
                        idUrl: "/fallbackproduct.png",
                        public_id: "/fallbackproduct.png",
                        idType: "driver_license",
                    },
                    businessLogo: user.logo,
                    status: "approved",
                    reason: "approved on creation by admin",
                });

                await Wallet.create({
                    userId: user._id,
                    balance: 0,
                    locked: 0,
                    currency: 'NGN'
                });

            }
        }

        const token = crypto.randomUUID();
        user.verificationToken = token;
        user.verificationTokenExpiry = Date.now() + 1000 * 60 * 60;
        await user.save()
        const verifyLink = `${BASEURL}/auth/verify?token=${token}&email=${user.email}`;

        const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color:#4F46E5;">Hey ${user.fullName} 👋, welcome aboard!</h2>
          <p>We're excited to have you join us. Before you dive in, please confirm that this email belongs to you.</p>
          <p>
            Just click the button below to verify your email and activate your account:
          </p>
          <a href="${verifyLink}" 
             style="display:inline-block;padding:12px 24px;
                    background:#4F46E5;color:#fff;text-decoration:none;
                    font-weight:bold;border-radius:8px;margin:20px 0;">
            ✅ Verify My Email
          </a>
          <p>If you didn’t sign up, you can safely ignore this email.</p>
          <p style="font-size: 12px; color: #666;">
            (P.S. This link will expire in 1 hour ⏳)
          </p>
        </div>
      `;


        await sendEmail(user.email, "Verify your email", html);


        // A welcome message from a system user 

        const systemUserId = "689ba5b3f6749f2f70664c18";

        const businessWelcome = `Welcome to BizConnect — the hub where businesses connect, grow, and thrive. Showcase your brand, engage with customers, and discover meaningful partnerships tailored to your niche. Get started by completing your profile and uploading your first product or service.`;

        const customerWelcome = `Welcome to BizConnect — your platform for discovering trusted local businesses and services. Connect directly with verified providers, explore top-rated offerings, and enjoy a seamless communication experience. Start by updating your profile and finding what matters most to you.`;

        const content = userType === 'business' ? businessWelcome : customerWelcome;

        const welcomeMessage = new Message({
            sender: new mongoose.Types.ObjectId(systemUserId),
            recipient: user._id,
            content,
            isSeen: false,
        });
        await welcomeMessage.save();

        await createNotification({
            userId: user._id,
            type: "SYSTEM",
            title: "Welcome to Bizonnect 🎉",
            message: `Hi ${fullName}, we're excited to have you join the Bizonnect community!  
          Start exploring, connect with businesses, and let’s build something amazing together.`,
            entityType: "SYSTEM",
            priority: "NORMAL",
        });

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
