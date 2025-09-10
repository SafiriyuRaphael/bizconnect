import apiService from '@/lib/service/apiService';
import { useProductStore } from '@/shared/store/useProductsStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductItemsResponse, ProductsItem } from '../../../../../../types';
import { useMessageModalStore } from '@/shared/store/useMessageModalStore';
import { useEditProfileStore } from '@/shared/store/useEditProfileStore';
import { uploadMultipleCloudinary } from '@/lib/cloudinary/uploadMultipleCloudinary';
import getProducts from '@/lib/products/getProducts';
import editProductsApi from '@/lib/products/editProducts';
import deleteProductApi from '@/lib/products/deleteProductApi';
import getItems from '@/app/[businessprofile]/api/getItem';
// import getProductIds from '@/lib/products/getIds';
// import getProductsById from '@/lib/products/getProductsById';

export default function useProductsApi() {
    const queryClient = useQueryClient();
    const { newProduct, setShowAddProduct, setNewProduct, setEditTagInput, setEditProduct, selectedProduct, setTagInput, setShowEditProduct, setSelectedProduct, setShowDeleteProduct, editProduct, image, setLoading, editImage, userId, userItemsQuery } = useProductStore()
    const { profile } = useEditProfileStore()

    const { data: fetchedProducts, isLoading: queryLoading } = useQuery<ProductItemsResponse, Error>({
        queryKey: ['products'],
        queryFn: getProducts
    });

    const { data: fetchedItems, isLoading: isFetchingItems } = useQuery<ProductItemsResponse, Error>({
        queryKey: ['get-items', userId, userItemsQuery],
        queryFn: () => getItems({ id: userId, params: userItemsQuery }),
        enabled: !!userId
    });

    // const { data: productIds, isLoading: isFecthingProductIds } = useQuery<{ ids: string[] }, Error>({
    //     queryKey: ['items-ids'],
    //     queryFn: getProductIds,
    // });

    // const { data: productItem, isLoading: isFecthingProductItem } = useQuery<ProductItemsResponse, Error>({
    //     queryKey: ['product-item', userId],
    //     queryFn: () => getProductsById({ id: userId }),
    //     enabled: !!userId
    // });

    // Add product mutation
    const addMutation = useMutation<ProductsItem, Error, ProductsItem>({
        mutationFn: async (product) => {
            const { response } = await apiService<ProductsItem>({
                endpoint: '/api/product/add-items',
                method: 'POST',
                body: {
                    ...product,
                    userId: profile._id,
                    price: parseFloat(product.price as unknown as string),
                    deliveryTime: product.deliveryTime ? parseInt(product.deliveryTime as unknown as string) : null,
                    useEscrow: profile.verifiedBusiness ? product.useEscrow : false,
                },
                requiresAuth: true,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
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
            setShowAddProduct(false);
            setNewProduct({
                title: '',
                description: '',
                tags: [],
                type: 'service',
                price: '',
                deliveryTime: '',
                useEscrow: true,
                media: [],
            });
            setTagInput('');
        },
    });

    // Edit product mutation
    const editMutation = useMutation<ProductsItem, Error, ProductsItem>({
        mutationFn: editProductsApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            useMessageModalStore.getState().onOpen({
                title: 'Success',
                message: 'Product updated successfully',
                type: 'success',
                autoClose: true,
                autoCloseDelay: 3000,
                closable: true,
                showIcon: true,
                actions: null,
            });
            setShowEditProduct(false);
            setSelectedProduct(editMutation.data ?? null);
            setEditTagInput('');
        },
    });

    // Delete product mutation
    const deleteMutation = useMutation<
        { success: boolean; message: string },
        Error,
        string
    >({
        mutationFn: deleteProductApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            useMessageModalStore.getState().onOpen({
                title: 'Success',
                message: 'Product deleted successfully',
                type: 'success',
                autoClose: true,
                autoCloseDelay: 3000,
                closable: true,
                showIcon: true,
                actions: null,
            });
            setShowDeleteProduct(false);
            setSelectedProduct(null);
        },
    });


    const handleAddProduct = async () => {
        setLoading(true)
        if (!newProduct.title || !newProduct.price) {
            useMessageModalStore.getState().onOpen({
                title: 'Error',
                message: 'Please fill in all required fields',
                type: 'error',
                autoClose: true,
                autoCloseDelay: 5000,
                closable: true,
                showIcon: true,
                actions: null,
            });
            setLoading(false)
            return;
        }
        const imageFiles = image.map((img) => img.file);

        const uploadedUrls = await uploadMultipleCloudinary(imageFiles);

        const media = uploadedUrls.map((pic, index) => {
            const file = imageFiles[index];
            return {
                url: pic?.imageUrl,
                public_id: pic?.public_id,
                name: file.name,
            };
        });
        addMutation.mutate({ ...newProduct, isAvailable: true, media });
        setLoading(false)
    };

    const handleEditProduct = (product: ProductsItem) => {
        setSelectedProduct(product);
        setEditProduct({
            title: product.title,
            description: product.description,
            tags: product.tags || [],
            type: product.type,
            price: product.price.toString(),
            deliveryTime: product.deliveryTime?.toString() || '',
            useEscrow: product.useEscrow,
            media: product.media || [],
        });
        setShowEditProduct(true);
    };

    const saveEditProduct = async () => {
        setLoading(true)

        if (!editProduct.title || !editProduct.price) {
            useMessageModalStore.getState().onOpen({
                title: 'Error',
                message: 'Please fill in all required fields',
                type: 'error',
                autoClose: true,
                autoCloseDelay: 5000,
                closable: true,
                showIcon: true,
                actions: null,
            });
            setLoading(false)
            return;
        }
        const filesToUpload = editImage.filter((img) => img.file);

        const imageFiles: File[] = filesToUpload
            .map((img) => img.file)
            .filter((file): file is File => !!file);

        const uploadedUrls = await uploadMultipleCloudinary(imageFiles);

        const finalMedia = editImage.map((img) => {
            if (img.file) {
                const index = filesToUpload.findIndex((f) => f.public_id === img.public_id);
                const uploaded = uploadedUrls[index];

                return {
                    url: uploaded?.imageUrl,
                    public_id: uploaded?.public_id,
                    name: img.file.name,
                };
            }

            return img;
        });
        editMutation.mutate({ ...editProduct, _id: selectedProduct?._id, isAvailable: selectedProduct?.isAvailable, media: finalMedia, useEscrow: profile.verifiedBusiness ? editProduct?.useEscrow : false, });
        setLoading(false)
    };

    const handleToggleAvailable = async () => {
        setLoading(true)
        if (!selectedProduct?.title || !selectedProduct.price) {
            console.error('Missing required fields');
            setLoading(false);
            return;
        }
        editMutation.mutate({ ...selectedProduct, _id: selectedProduct?._id, isAvailable: !selectedProduct?.isAvailable, useEscrow: profile.verifiedBusiness ? selectedProduct?.useEscrow : false, });
        setLoading(false)
    };

    const confirmDelete = () => {
        setLoading(true)
        if (selectedProduct?._id) {
            deleteMutation.mutate(selectedProduct._id);
        }
        setLoading(false)
    };

    const handleDeleteProduct = (product: ProductsItem) => {
        setSelectedProduct(product);
        setShowDeleteProduct(true);
    };

    return { confirmDelete, saveEditProduct, handleEditProduct, handleAddProduct, queryLoading, handleDeleteProduct, addMutation, fetchedProducts, editMutation, deleteMutation, handleToggleAvailable, fetchedItems, isFetchingItems }
}
