import React from 'react'
import { IEscrow } from '../types/escrow';
import { SessionUser } from '../../../../../../types';

export default function canReleaseFunds(escrow: IEscrow, session: SessionUser | null) {
    return (
        escrow.status === "delivered" &&
        !escrow.isDisputed &&
        session?.id === escrow.buyerId._id
    );
}
