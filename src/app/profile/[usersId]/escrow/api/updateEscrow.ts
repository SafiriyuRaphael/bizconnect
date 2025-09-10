import apiService from '@/lib/service/apiService'
import { PayloadProps, UpdateResponse } from '../types/escrow'

export default async function updateEscrow({ escrowId, action, deliveryProof }: PayloadProps) {
    const { response } = await apiService<UpdateResponse, PayloadProps>({
        endpoint: "/api/escrow/update",
        method: "POST",
        body: { escrowId, action, deliveryProof }
    })

    return response.data
}
