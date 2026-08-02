import { useEffect, useState } from "react";
import { type Product } from "@repo/types";
import { getApiErrorMessage } from "@/lib/api";
import { productsApi } from "@/lib/products";

export function useProducts() {
    const [products, setProducts] = useState<Product[]> ([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => { fetchProducts(); }, [categoryFilter]);

    async function fetchProducts() {
        setLoading(true);
        setError('');
        try {
            setProducts(await productsApi.getAll(categoryFilter || undefined));
        } catch (err) {
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    async function createProduct(values: Record<string, string>) {
        await productsApi.create({
            name: values.name,
            sku: values.sku,
            description: values.description || undefined,
            price: parseFloat(values.price.replace(',','.')),
            categoryId: values.categoryId,
        });
        fetchProducts();
    }

    async function updateProduct(id: string, values: Record<string, string>) {
        await productsApi.update(id, {
            name: values.name,
            sku: values.sku,
            description: values.description || undefined,
            price: parseFloat(values.price.replace(',','.')),
            categoryId: values.categoryId,
        });
        fetchProducts();
    }

    async function deleteProduct(id: string) {
        await productsApi.delete(id);
        fetchProducts();
    }
    return { products, loading, error, categoryFilter, setCategoryFilter, createProduct, updateProduct, deleteProduct};
}