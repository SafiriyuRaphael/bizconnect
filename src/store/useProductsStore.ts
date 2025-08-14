import { create } from 'zustand';
import { BusinessDisplayPicsProps, ProductsItem, ProductsItemsPageProps } from '../../types';

interface ProductForm {
    title: string;
    description: string;
    tags: string[];
    type: 'product' | 'service';
    price: string;
    deliveryTime: string;
    useEscrow: boolean;
    media: BusinessDisplayPicsProps[];
}

type ImageProps = {
    id: number;
    preview: string;
    file: File
}


interface ProductState {
    image: ImageProps[]
    userId: string
    quantity: number
    selectedPaymentMethod: "paystack" | "flutterwave"
    editImage: BusinessDisplayPicsProps[]
    showAddProduct: boolean;
    showViewProduct: boolean;
    showEditProduct: boolean;
    showDeleteProduct: boolean;
    selectedProduct: ProductsItem | null;
    products: ProductsItem[];
    loading: boolean;
    newProduct: ProductForm;
    showPaymentModal: boolean;
    editProduct: ProductForm;
    tagInput: string;
    editTagInput: string;
    setSelectedPaymentMethod: (method: "paystack" | "flutterwave") => void;
    setQuantity: (quantity: number) => void;
    setShowAddProduct: (show: boolean) => void;
    setShowPaymentModal: (show: boolean) => void;
    setUserId: (id: string) => void;
    setShowViewProduct: (show: boolean) => void;
    setShowEditProduct: (show: boolean) => void;
    setShowDeleteProduct: (show: boolean) => void;
    setSelectedProduct: (product: ProductsItem | null) => void;
    setProducts: (products: ProductsItem[]) => void;
    setLoading: (loading: boolean) => void;
    setNewProduct: (newProduct: Partial<ProductForm>) => void;
    setEditProduct: (editProduct: Partial<ProductForm>) => void;
    setImage: (images: ImageProps[]) => void;
    setEditImage: (images: BusinessDisplayPicsProps[]) => void;
    appendEditImages: (images: BusinessDisplayPicsProps[]) => void;
    appendImages: (images: ImageProps[]) => void;
    setTagInput: (tagInput: string) => void;
    setEditTagInput: (editTagInput: string) => void;
    handleViewProduct: (product: ProductsItem) => void;
    toggleProductAvailability: (productId: string) => void;
    addTag: () => void;
    removeTag: (tagToRemove: string) => void;
    addEditTag: () => void;
    removeEditTag: (tagToRemove: string) => void;
    handleKeyPress: (e: React.KeyboardEvent) => void;
    handleEditKeyPress: (e: React.KeyboardEvent) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
    showAddProduct: false,
    showViewProduct: false,
    showEditProduct: false,
    showPaymentModal: false,
    userId: "",
    showDeleteProduct: false,
    selectedProduct: null,
    products: [],
    quantity: 1,
    selectedPaymentMethod: "paystack",
    image: [],
    editImage: [],
    loading: false,
    newProduct: {
        title: '',
        description: '',
        tags: [],
        type: 'service',
        price: '',
        deliveryTime: '',
        useEscrow: true,
        media: [],
    },
    editProduct: {
        title: '',
        description: '',
        tags: [],
        type: 'service',
        price: '',
        deliveryTime: '',
        useEscrow: true,
        media: [],
    },
    tagInput: '',
    editTagInput: '',
    setSelectedPaymentMethod: (method) => set({ selectedPaymentMethod: method }),
    setQuantity: (quantity) => set({ quantity: quantity }),
    setShowAddProduct: (show) => set({ showAddProduct: show }),
    setShowPaymentModal: (show) => set({ showPaymentModal: show }),
    setShowViewProduct: (show) => set({ showViewProduct: show }),
    setShowEditProduct: (show) => set({ showEditProduct: show }),
    setShowDeleteProduct: (show) => set({ showDeleteProduct: show }),
    setSelectedProduct: (product) => set({ selectedProduct: product }),
    setProducts: (products) => set({ products }),
    setUserId: (userId) => set({ userId }),
    setLoading: (loading) => set({ loading }),
    setImage: (images) => set({ image: images }),
    setEditImage: (images) => set({ editImage: images }),
    appendEditImages: (images) => set((state) => ({
        editImage: [...state.editImage, ...images],
    })),
    appendImages: (images) => set((state) => ({
        image: [...state.image, ...images],
    })),
    setNewProduct: (newProduct) => set((state) => ({
        newProduct: { ...state.newProduct, ...newProduct },
    })),
    setEditProduct: (editProduct) => set((state) => ({
        editProduct: { ...state.editProduct, ...editProduct },
    })),
    setTagInput: (tagInput) => set({ tagInput }),
    setEditTagInput: (editTagInput) => set({ editTagInput }),
    handleViewProduct: (product) =>
        set({ selectedProduct: product, showViewProduct: true }),
    toggleProductAvailability: (productId) =>
        set((state) => ({
            products: state.products.map((p) =>
                p._id === productId ? { ...p, isAvailable: !p.isAvailable } : p
            ),
        })),
    addTag: () => {
        const { tagInput, newProduct } = get();
        if (tagInput.trim() && !newProduct.tags.includes(tagInput.trim())) {
            set({
                newProduct: {
                    ...newProduct,
                    tags: [...newProduct.tags, tagInput.trim()],
                },
                tagInput: '',
            });
        }
    },
    removeTag: (tagToRemove) =>
        set((state) => ({
            newProduct: {
                ...state.newProduct,
                tags: state.newProduct.tags.filter((tag) => tag !== tagToRemove),
            },
        })),
    addEditTag: () => {
        const { editTagInput, editProduct } = get();
        if (editTagInput.trim() && !editProduct.tags.includes(editTagInput.trim())) {
            set({
                editProduct: {
                    ...editProduct,
                    tags: [...editProduct.tags, editTagInput.trim()],
                },
                editTagInput: '',
            });
        }
    },
    removeEditTag: (tagToRemove) =>
        set((state) => ({
            editProduct: {
                ...state.editProduct,
                tags: state.editProduct.tags.filter((tag) => tag !== tagToRemove),
            },
        })),
    handleKeyPress: (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            get().addTag();
        }
    },
    handleEditKeyPress: (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            get().addEditTag();
        }
    },
}));