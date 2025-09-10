import { AnyUser } from '../../../../types';
import { BASEURL } from '@/shared/constants/url';

export default async function handleShare(user: AnyUser) {
    if (navigator.share) {
        try {
            await navigator.share({
                title: `${user.businessName ?? user.fullName}'s Profile`,
                text: `Check out ${user.businessName ?? user.fullName}'s profile`,
                url: `${BASEURL}/${user.username}`,
            });
        } catch (err) {
            console.error("Error sharing:", err);
        }
    } else {
        alert("Sharing not supported in your browser 😢");
    }
}
