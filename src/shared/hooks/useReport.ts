import { useMutation } from '@tanstack/react-query'
import createReport from '../lib/createReport'

export default function useReport() {
    const createReportMutation = useMutation({
        mutationFn: createReport,
    })

    return { createReportMutation }
}
