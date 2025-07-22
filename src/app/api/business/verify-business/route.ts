import { connectToDatabase } from "@/lib/mongo/initDB";
import { Verification } from "@/model/Verification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { NextResponse } from "next/server";
import { VerificationLog } from "@/model/VerificationLog";

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = session.user;

        const {
            fullName,
            documentUrl,
            selfieUrl,
            businessName,
            businessAddress,
            businessPhone, idDocument,
            businessLogo
        } = await req.json();

        if (!fullName || !idDocument || !businessName || !businessAddress || !businessPhone) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const existing = await Verification.findOne({ userId: user.id });

        if (existing) {
            if (existing.status === "pending") {
                return NextResponse.json({ message: "Your verification is still under review" }, { status: 400 });
            }



            await VerificationLog.create({
                verificationId: existing._id,
                userId: existing.userId,
                fullName: existing.fullName,
                businessName: existing.businessName,
                businessAddress: existing.businessAddress,
                businessPhone: existing.businessPhone,
                documentUrl: existing.documentUrl,
                selfieUrl: existing.selfieUrl,
                idDocument: existing.idDocument,
                businessLogo: existing.businessLogo,
                status: existing.status,
                reason: existing.reason,
                submittedAt: existing.submittedAt,
                verifiedAt: existing.verifiedAt,
            });

            // Update only the provided fields
            if (fullName) existing.fullName = fullName;
            if (documentUrl) existing.documentUrl = documentUrl;
            if (idDocument) existing.idDocument = idDocument;
            if (selfieUrl) existing.selfieUrl = selfieUrl;
            if (businessName) existing.businessName = businessName;
            if (businessAddress) existing.businessAddress = businessAddress;
            if (businessPhone) existing.businessPhone = businessPhone;
            if (businessLogo) existing.businessLogo = businessLogo;

            existing.status = "pending";
            existing.submittedAt = new Date();
            existing.verifiedAt = null;

            await existing.save();

            return NextResponse.json({ message: "Verification updated and resubmitted" }, { status: 200 });
        }

        await Verification.create({
            userId: user.id,
            fullName,
            businessName,
            businessAddress,
            businessPhone,
            documentUrl,
            selfieUrl,
            idDocument,
            businessLogo,
            status: "pending",
        });

        return NextResponse.json({ message: "Verification submitted" }, { status: 201 });
    }
    catch (err) {
        console.error("Verification error:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
