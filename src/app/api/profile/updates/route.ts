import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo/initDB";
import User from "@/model/User";
import { Business } from "@/model/Business";
import { Customer } from "@/model/Customer";
import { hash } from 'bcrypt'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export async function PUT(req: Request) {


    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { errors: { general: "Unauthorized: No session found" } },
                { status: 401 }
            );
        }
        const isAdmin = session?.user.userRole === "admin"
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

        if (updates?.password && !isAdmin) {
            fieldErrors.password = "Only admins can update passwords";
        }

        if (updates?.password && isAdmin && updates.password.length < 8) {
            fieldErrors.password = "Password must be at least 8 characters long";
        }

        if (Object.keys(fieldErrors).length > 0) {
            return NextResponse.json({ errors: fieldErrors }, { status: 400 });
        }

        await connectToDatabase();

        const existingUser = await User.findOne({ _id: userId });
        if (!existingUser) {
            return NextResponse.json({ errors: { username: "User not found" } }, { status: 404 });
        }

        if (!isAdmin && userId !== session.user.id) {
            return NextResponse.json(
                { errors: { general: "Unauthorized: You can only update your own data" } },
                { status: 403 }
            );
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
            "deliveryTime",
            "priceRange",
            "logo",
            ...(isAdmin ? ["password"] : [])
        ];


        const sanitizedUpdates = Object.fromEntries(
            Object.entries(updates).filter(([key]) =>
                allowedFields.includes(key)
            )
        );
        if (isAdmin && sanitizedUpdates.password) {
            if (typeof sanitizedUpdates.password !== "string") {
                return NextResponse.json(
                    { errors: { password: "Password must be a string" } },
                    { status: 400 }
                );
            }
            sanitizedUpdates.password = await hash(sanitizedUpdates.password, 10);
        }

        const ModelToUse = existingUser.__t === "Business" ? Business
            : existingUser.__t === "Customer" ? Customer
                : User;
        const updatedUser = await ModelToUse.findOneAndUpdate(
            { _id: userId },
            { $set: sanitizedUpdates },
            { new: true }
        ).lean() as any;

        const { password, resetToken, resetTokenExpiry, ...safeUser } = updatedUser;

        return NextResponse.json({ user: safeUser, status: "success" }, { status: 200 });
    } catch (err) {
        console.error("Update error:", err);
        return NextResponse.json(
            { errors: { general: "Internal server error" } },
            { status: 500 }
        );
    }
}
