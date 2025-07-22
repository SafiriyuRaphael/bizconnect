import { VerificationStatusProps } from '../../../types';

export default async function getVerificationStatus(userId: string) {
    try {
        const res = await fetch(`/api/business/verification-status?userId=${userId}`);
        if (res.ok) {
            const data: VerificationStatusProps = await res.json();
            return data;
        }
        throw new Error("verification status failed");
    } catch (err) {
        return "unable to get Verification status";
    }

}
