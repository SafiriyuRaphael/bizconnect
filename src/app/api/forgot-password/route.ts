import { sendEmail } from "@/lib/auth/sendEmail";
import User from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        // (1) Check if email exists in database
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { message: "No user found with this email." },
                { status: 404 }
            );
        }

        // (2) Generate token (pseudo)
        const token = crypto.randomUUID(); // or use JWT, nanoid, etc.

        // (3) Save token to DB or memory (and set expiration)
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 1000 * 60 * 30; // 15 minutes
        await user.save();

        // (4) Simulate email
        console.log(`👇 Send this link to user:\nhttp://localhost:3000/reset-password?token=${token}`);

        const link = `http://localhost:3000/auth/reset-password?token=${token}&email=${email}`;
        const html = `
          <p>Yo 👋,</p>
          <p>Click the link below to reset your password. It expires in 30 mins.</p>
          <a href="${link}">${link}</a>
        `;

        await sendEmail(email, "Reset your password", html);

        return NextResponse.json({ message: "Reset link sent!" }, { status: 200 });
    } catch (error) {
        console.error("Forgot-password error:", error);
        return NextResponse.json(
            { message: "Something went wrong. Try again later." },
            { status: 500 }
        );
    }
}
