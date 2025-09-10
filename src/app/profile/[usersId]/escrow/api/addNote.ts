import apiService from '@/lib/service/apiService'
import { AddNotePayloadProps, IEscrow } from '../types/escrow';



export default async function addNote({ escrowId, note }: AddNotePayloadProps) {
    const { response } = await apiService<{ message: string; escrow: IEscrow }, AddNotePayloadProps>({
        endpoint: "/api/escrow/notes",
        method: "PATCH",
        body: { escrowId, note },
        requiresAuth: true,
    })

    return response.data
}
