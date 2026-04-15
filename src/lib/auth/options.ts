// src/lib/auth/options.ts
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from '@/lib/mongo/initDB';
import User from '@/model/User';
import { compare } from "bcrypt";
import { BASEURL } from "@/shared/constants/url";
import { sendEmail } from "./sendEmail";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                emailOrUsername: { label: "Email or Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any) {
                if (!credentials?.emailOrUsername || !credentials?.password) {
                    throw new Error(JSON.stringify({
                        code: "MISSING_CREDENTIALS",
                        message: "Email/username and password are required",
                    }));
                }

                await connectToDatabase();
                const user = await User.findOne({
                    $or: [{ email: credentials.emailOrUsername }, { username: credentials.emailOrUsername }],
                }).select("+password");

                if (!user) throw new Error("No user found");

                if (user?.deleted) {
                    return null;
                }
                if (!user.verified) {
                    const token = crypto.randomUUID();
                    user.verificationToken = token;
                    user.verificationTokenExpiry = Date.now() + 1000 * 60 * 60;
                    await user.save()
                    const verifyLink = `${BASEURL}/auth/verify?token=${token}&email=${user.email}`;

                    const html = `
                    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333; max-width:600px; margin:auto; padding:20px; border:1px solid #eee; border-radius:10px;">
                      <h2 style="color:#4F46E5; text-align:center;">Action Needed: Verify Your Email</h2>
                      <p style="font-size:15px;">
                        Hi ${user.fullName}, we noticed you tried to sign in but your email hasn’t been verified yet.
                      </p>
                      <p style="font-size:15px;">
                        To access your Bizconnect account, please confirm your email by clicking the button below:
                      </p>
                      <div style="text-align:center; margin:30px 0;">
                        <a href="${verifyLink}" 
                           style="display:inline-block; padding:12px 24px; background:#4F46E5; color:#fff; text-decoration:none; font-weight:bold; border-radius:8px; font-size:16px;">
                           Verify My Email
                        </a>
                      </div>
                      <p style="font-size:14px; color:#666;">
                        Didn’t request this? You can safely ignore this email.
                      </p>
                      <p style="font-size:13px; color:#999; margin-top:30px;">
                         For security reasons, this link will expire in 1 hour.
                      </p>
                      <hr style="margin:20px 0; border:none; border-top:1px solid #eee;">
                      <p style="font-size:13px; color:#777; text-align:center;">
                        © ${new Date().getFullYear()} Bizconnect. Simplifying transactions, fostering connections.
                      </p>
                    </div>
                  `;


                    await sendEmail(user.email, "Verify your email", html);

                    throw new Error("We sent you a verification link. Please check your inbox and verify your email to continue.")
                }

                const isValid = await compare(credentials.password, user.password);
                if (!isValid) throw new Error("Invalid password");

                return {
                    id: user._id.toString(),
                    name: user.fullName,
                    email: user.email,
                    verified: user.verified,
                    role: user.userType,
                    userRole: user.role,
                    username: user.username,
                    logo: user.logo,
                    businessName: user.businessName,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/login",
        signOut: "/logout",
        newUser: "/auth/register",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.username = user.username;
                token.picture = user.logo ?? null;
                token.businessName = user.businessName;
                token.name = user.name;
                token.email = user.email;
                token.userRole = user.userRole;
                token.verified = user.verified;
                token.isBanned = (user as any).deleted ?? false;
            } else {
                await connectToDatabase();
                const dbUser = await User.findById(token.id);
                token.isBanned = dbUser?.deleted ?? false;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.username = token.username;
                session.user.logo = token.picture ?? null;
                session.user.businessName = token.businessName;
                session.user.verified = token.verified;
                session.user.name = token.name!;
                session.user.email = token.email!;
                session.user.userRole = token.userRole!;
            }
            return session;
        },
    },
};
