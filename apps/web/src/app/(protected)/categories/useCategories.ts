import { CreateCategoryDto, UpdateCategoryDto } from "@repo/types";
import { useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/api";
import { categoriesApi, Category } from "@/lib/categories";

export function useCategories(){
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(()=>{
        fetchCategories();
    },[]);
    
    async function fetchCategories() {
        setLoading(true);
        setError('');
        try {
            const data = await categoriesApi.getAll();
            setCategories(data);
        } catch (err) {
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    async function createCategory(dto:CreateCategoryDto) {
        await categoriesApi.create(dto);
        fetchCategories();
    }

    async function updateCategory(id: string, dto: UpdateCategoryDto) {
        await categoriesApi.update(id, dto);
        fetchCategories();
    }

    async function deleteCategory(id: string) {
        await categoriesApi.delete(id);
        fetchCategories();
    }

    return{categories, loading, error, createCategory, updateCategory, deleteCategory};
}

