// /app/api/users/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongo/initDB';
import User from '@/model/User';
import { Verification } from '@/model/Verification';
import { VerificationLog } from '@/model/VerificationLog';
import Message from '@/model/Message';
export async function GET(req: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);

        const role = searchParams.get('role');
        const userType = searchParams.get('userType');
        const verified = searchParams.get('verified');
        const search = searchParams.get('search') || '';


        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;


        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;


        const query: any = { deleted: false };

        if (role) query.role = role;
        // const userType = searchParams.get('userType'); 
        if (userType && userType !== 'all') {
            query.userType = userType;
        }
        if (verified === 'true' || verified === 'false') {
            query.verified = verified === 'true';
        }


        if (search.trim()) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { businessName: { $regex: search, $options: 'i' } },
            ];
        }

        const [totalUsers, businessUsers, customerUsers] = await Promise.all([
            User.countDocuments(query),
            User.countDocuments({ ...query, userType: 'business' }),
            User.countDocuments({ ...query, userType: 'customer' }),
        ]);

        const users = await User.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .select('-password -resetToken -resetTokenExpiry');

        const enriched = await Promise.all(users.map(async (user) => {
            const plain = user.toObject();
            if (user.userType !== 'business') return plain;

            const contactAgg = await Message.aggregate([
                { $match: { $or: [{ sender: user._id }, { recipient: user._id }] } },
                {
                    $group: {
                        _id: null,
                        contacts: {
                            $addToSet: {
                                $cond: [
                                    { $ne: ["$sender", user._id] },
                                    "$sender",
                                    "$recipient"
                                ]
                            }
                        }
                    }
                },
                { $project: { count: { $size: "$contacts" } } }
            ]);

            const contactCount = contactAgg[0]?.count || 0;
            const verification = await Verification.findOne({ userId: user._id });
            const latestLog = verification
                ? await VerificationLog.findOne({ verificationId: verification._id }).sort({ createdAt: -1 }).lean()
                : null;

            return {
                ...plain,
                contactCount,
                verificationStatus: verification?.status ?? "unverified",
                verificationLog: latestLog ?? null,
                verificationData: verification ?? null,
            };
        }));



        return NextResponse.json({
            success: true,
            data: enriched,
            pagination: {
                total: totalUsers,
                business: businessUsers,
                customers: customerUsers,
                page,
                limit,
                totalPages: Math.ceil(totalUsers / limit),
            },
        });
    } catch (error: any) {
        console.error('Failed to fetch users:', error);
        return NextResponse.json(
            { success: false, message: 'Something went wrong' },
            { status: 500 }
        );
    }
}
