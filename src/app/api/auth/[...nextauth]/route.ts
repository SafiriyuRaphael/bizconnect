import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectToDatabase } from '@/lib/mongo/initDB'
import User from '@/model/User'
import { compare } from "bcrypt"
import GoogleProvider from "next-auth/providers/google";


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
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        try {

          if (!credentials?.emailOrUsername || !credentials?.password) {
            throw new Error(JSON.stringify({
              code: "MISSING_CREDENTIALS",
              message: "Email/username and password are required"
            }));
          }

          const { emailOrUsername, password } = credentials

          await connectToDatabase();
          const user = await User.findOne({
            $or: [
              { email: emailOrUsername },
              { username: emailOrUsername }
            ]
          }).select("+password");


          if (!user) throw new Error("No user found")

          const isValid = await compare(password, user.password)
          if (!isValid) throw new Error("Invalid password")

          return {
            id: user._id.toString(),
            name: user.fullName,
            email: user.email,
            role: user.userType,
            username: user.username
          }
        }
        catch (error) {
          throw error
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/logout',
    newUser: '/auth/register'
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role
      }
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
