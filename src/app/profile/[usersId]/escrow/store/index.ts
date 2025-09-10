import { create } from 'zustand'
import { EscrowQueryParams, IEscrow, UploadedFile } from '../types/escrow'

//   const [newNote, setNewNote] = useState("");

interface EscrowStore {
    selectedEscrow: IEscrow | null
    setSelectedEscrow: (escrow: IEscrow | null) => void
    selectedDispute: IEscrow | null
    setSelectedDispute: (dispute: IEscrow | null) => void
    showDetailsModal: boolean
    setShowDetailsModal: (show: boolean) => void
    disputeEvidence: string
    setDisputeEvidence: (evidence: string) => void
    viewMode: "grid" | "list"
    activeTab: "overview" | "timeline" | "communications"
    setActiveTab: (tab: "overview" | "timeline" | "communications") => void
    setViewMode: (mode: "grid" | "list") => void
    deliveryProof: string[]
    setDeliveryProof: (proof: string[]) => void
    showDeliveryModal: boolean
    setShowDeliveryModal: (show: boolean) => void
    escrowParams: EscrowQueryParams
    setEscrowParams: (params: Partial<EscrowQueryParams> | ((prev: EscrowQueryParams) => EscrowQueryParams)) => void;
    deliveryFiles: File[]
    setDeliveryFiles: (files: File[]) => void
    proofType: "url" | "file"
    setProofType: (type: "url" | "file") => void
    removeFile: (index: number) => void
    resetModal: () => void
    loading: boolean
    setLoading: (loading: boolean) => void
    newNote: string
    setNewNote: (note: string) => void
    disputeReason: string;
    setDisputeReason: (reason: string) => void;
    uploadedFiles: UploadedFile[];
    setUploadedFiles: (
        files: UploadedFile[] | ((prev: UploadedFile[]) => UploadedFile[])
    ) => void;
    uploadError: string;
    setUploadError: (error: string) => void;
    isUploading: boolean;
    setIsUploading: (uploading: boolean) => void;
    isDropdownOpen: boolean;
    setIsDropdownOpen: (dropdown: boolean) => void;
    handleClose: () => void;
}

export const useEscrowStore = create<EscrowStore>((set) => ({
    selectedEscrow: null,
    setSelectedEscrow: (escrow) => set({ selectedEscrow: escrow }),
    selectedDispute: null,
    setSelectedDispute: (dispute) => set({ selectedDispute: dispute }),
    showDetailsModal: false,
    setShowDetailsModal: (show) => set({ showDetailsModal: show }),
    disputeEvidence: "",
    setDisputeEvidence: (evidence) => set({ disputeEvidence: evidence }),
    viewMode: "grid",
    setViewMode: (mode) => set({ viewMode: mode }),
    activeTab: "overview",
    setActiveTab: (tab) => set({ activeTab: tab }),
    deliveryProof: [],
    setDeliveryProof: (proof) => set({ deliveryProof: proof }),
    showDeliveryModal: false,
    setShowDeliveryModal: (show) => set({ showDeliveryModal: show }),
    escrowParams: {},
    setEscrowParams: (params) =>
        set((state) => ({
            escrowParams: typeof params === "function"
                ? params(state.escrowParams)
                : { ...state.escrowParams, ...params },
        })),
    deliveryFiles: [],
    setDeliveryFiles: (files) => set({ deliveryFiles: files }),
    proofType: "url",
    setProofType: (type) => set({ proofType: type }),
    removeFile: (index: number) => set((state) => ({ deliveryFiles: state.deliveryFiles.filter((_, i) => i !== index) })),
    resetModal: () => set({
        showDeliveryModal: false,
        selectedEscrow: null,
        deliveryProof: [],
        deliveryFiles: [],
        proofType: "url",
    }),
    loading: false,
    setLoading: (loading) => set({ loading }),
    newNote: "",
    setNewNote: (note) => set({ newNote: note }),
    disputeReason: "",
    setDisputeReason: (reason) => set({ disputeReason: reason }),
    uploadedFiles: [],
    setUploadedFiles: (updater) =>
        set((state) => ({
            uploadedFiles:
                typeof updater === "function"
                    ? updater(state.uploadedFiles)
                    : updater,
        })),
    uploadError: "",
    setUploadError: (error) => set({ uploadError: error }),
    isUploading: false,
    setIsUploading: (bool) => set({ isUploading: bool }),
    isDropdownOpen: false,
    setIsDropdownOpen: (dropdown) => set({ isDropdownOpen: dropdown }),
    handleClose: () =>
        set({
            selectedDispute: null,
            disputeEvidence: "",
            disputeReason: "",
            uploadedFiles: [],
            uploadError: "",
            isDropdownOpen: false,
            isUploading: false,
        }),
}))
