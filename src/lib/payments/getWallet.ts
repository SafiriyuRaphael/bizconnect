
import { BASEURL } from '@/shared/constants/url';
import apiService from '../service/apiService';
import { IWallet } from '../../../types';

export default async function getWallet() {
    const { response } = await apiService<{ wallet: IWallet }>({
        endpoint: `${BASEURL}/api/payments/wallet`,
        method: 'GET',
        requiresAuth: true,
    });
    return response.data;
}
