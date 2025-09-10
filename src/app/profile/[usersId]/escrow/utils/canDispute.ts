import { IEscrow } from '../types/escrow';

export default function canDispute(escrow: IEscrow) {
    return ["delivered", "funded"].includes(escrow.status);
}
