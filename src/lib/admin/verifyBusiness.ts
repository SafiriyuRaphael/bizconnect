export default async function verifyBusiness({ verificationId, action, reason }: { verificationId: string; action: "reject" | "approve"; reason?: string }) {
    try {
        const res = await fetch('/api/admin/verify', {
            method: 'PATCH',
            body: JSON.stringify({
                verificationId,
                action,
                reason
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error("Failed verify business, Server Error");
        }

        const response: { message: string; } = await res.json();
        return response
    } catch (err) {
        console.error("💥 Frontend error:", err);
        throw err;
    }
}
