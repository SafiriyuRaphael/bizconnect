import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo/initDB";
import User from "@/model/User";
import { Business } from "@/model/Business";
import { Customer } from "@/model/Customer";

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { userId, updates } = body;

        const fieldErrors: Record<string, string> = {};

        if (!userId) {
            fieldErrors.general = "user id is required";
        }

        if (!updates) {
            fieldErrors.updates = "Update data is required";
        }

        if (updates?.email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(updates.email)) {
            fieldErrors.email = "Invalid email format";
        }

        if (updates?.phone && !/^[\+]?[\d\s\-\(\)]{10,}$/.test(updates.phone)) {
            fieldErrors.phone = "Invalid phone number";
        }

        if (updates?.website && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(updates.website)) {
            fieldErrors.website = "Invalid website URL";
        }

        if (Object.keys(fieldErrors).length > 0) {
            return NextResponse.json({ errors: fieldErrors }, { status: 400 });
        }

        await connectToDatabase();

        const existingUser = await User.findOne({ _id: userId });
        if (!existingUser) {
            return NextResponse.json({ errors: { username: "User not found" } }, { status: 404 });
        }

        if (updates.email && updates.email !== existingUser.email) {
            const emailExists = await User.findOne({ email: updates.email, _id: { $ne: existingUser._id } });
            if (emailExists) {
                fieldErrors.email = "Email is already in use";
            }
        }

        if (updates.username && updates.username !== existingUser.username) {

            const usernameExists = await User.findOne({ username: updates.username, _id: { $ne: existingUser._id } });
            if (usernameExists) {
                fieldErrors.username = "Username is already taken";
            }
        }

        if (Object.keys(fieldErrors).length > 0) {
            return NextResponse.json({ errors: fieldErrors }, { status: 409 });
        }

        const allowedFields = [
            "fullName",
            "username",
            "email",
            "phone",
            "deliveryAddress",
            "gender",
            "dateOfBirth",
            "businessName",
            "businessCategory",
            "businessAddress",
            "businessDescription",
            "website",
            "priceRange",
            "logo"
        ];

        const ModelToUse = existingUser.__t === "Business" ? Business
            : existingUser.__t === "Customer" ? Customer
                : User;

        const sanitizedUpdates = Object.fromEntries(
            Object.entries(updates).filter(([key]) =>
                allowedFields.includes(key)
            )
        );

        const updatedUser = await ModelToUse.findOneAndUpdate(
            { _id: userId },
            { $set: sanitizedUpdates },
            { new: true }
        ).lean();

        // const { password, resetToken, resetTokenExpiry, ...safeUser } = updatedUser;

        return NextResponse.json({ user: updatedUser, status: "success" }, { status: 200 });
    } catch (err) {
        console.error("Update error:", err);
        return NextResponse.json(
            { errors: { general: "Internal server error" } },
            { status: 500 }
        );
    }
}
