import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Wallet } from "@/model/Wallet";
import { Business } from "@/model/Business";
import { connectToDatabase } from "@/lib/mongo/initDB";
import { AllBusinessProps } from "../../../../../types";

export async function GET() {
    await connectToDatabase();

    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;


    const business = await Business.findById(userId).lean<AllBusinessProps>();
    if (!business) {
        return NextResponse.json({ error: "Only business accounts can have wallets" }, { status: 403 });
    }


    if (!business.verifiedBusiness) {
        return NextResponse.json({ error: "Business must be verified" }, { status: 403 });
    }


    const wallet = await Wallet.findOne({ userId }).lean();
    if (!wallet) {
        return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    return NextResponse.json({ wallet });
}
