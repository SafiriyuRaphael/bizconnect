import { useMessageModalStore } from '@/store/useMessageModalStore';
import { useMutation, useQuery } from '@tanstack/react-query';

import { EscrowPaymentBody, IWallet } from '../../types';
import escrowPayments from '@/lib/payments/escrowPayments';
import getWallet from '@/lib/payments/getWallet';

export default function usePaymentsApi() {

    const makePayment = useMutation<EscrowPaymentBody, Error, EscrowPaymentBody>({
        mutationFn: escrowPayments,
        onSuccess: () => {
            useMessageModalStore.getState().onOpen({
                title: 'Success',
                message: 'Product added successfully',
                type: 'success',
                autoClose: true,
                autoCloseDelay: 3000,
                closable: true,
                showIcon: true,
                actions: null,
            });
        },
    });

    const { data: wallet, isLoading: walletLoading } = useQuery<{ wallet: IWallet }, Error>({
        queryKey: ['wallet'],
        queryFn: getWallet
    });

    return { makePayment, wallet, walletLoading }
}
