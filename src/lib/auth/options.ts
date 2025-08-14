// src/lib/auth/options.ts
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from '@/lib/mongo/initDB';
import User from '@/model/User';
import { compare } from "bcrypt";

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
