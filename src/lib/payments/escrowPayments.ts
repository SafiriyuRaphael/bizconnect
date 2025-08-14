
import apiService from '../service/apiService';
import { EscrowPaymentBody } from '../../../types';

export default async function escrowPayments(product: EscrowPaymentBody) {
    const { response } = await apiService<EscrowPaymentBody>({
        endpoint: `/api/payments/escrow-payment`,
        method: 'POST',
        body: product,
        requiresAuth: true,
    });
    return response.data;

}
