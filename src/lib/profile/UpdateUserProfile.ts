export const updateUserProfile = async (
    username: string,
    updates: Record<string, any>
) => {
    const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, updates }),
    });

    return res;
};
