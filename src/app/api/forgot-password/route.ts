import { BASEURL } from "@/shared/constants/url";
import { sendEmail } from "@/lib/auth/sendEmail";
import User from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "No user found with this email." },
        { status: 404 }
      );
    }

    // (2) Generate token (pseudo)
    const token = crypto.randomUUID();

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 1000 * 60 * 30; // 15 minutes
    await user.save();

    const link = `${BASEURL}/auth/reset-password?token=${token}&email=${email}`;
    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2c3e50;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset the password for your account. If you made this request, click the button below to set a new password:</p>
          <p>
            <a href="${link}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">
              Reset Password
            </a>
          </p>
          <p><strong>Note:</strong> This link will expire in 30 minutes.</p>
          <p>If you did not request a password reset, you can safely ignore this email—your password will remain unchanged.</p>
          <br/>
          <p>Thanks,</p>
          <p><strong>Bizconnect Team</strong></p>
        </div>
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
