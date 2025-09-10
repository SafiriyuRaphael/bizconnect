import { IEscrow } from '../types/escrow';
import { SessionUser } from '../../../../../../types';

export default function canMarkDelivered(escrow: IEscrow, session: SessionUser | null) {
    return (
        escrow.status === "funded" && escrow.sellerId._id === session?.id
    );
}
