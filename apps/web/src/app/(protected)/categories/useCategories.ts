import { CreateCategoryDto, UpdateCategoryDto } from "@repo/types";
import { useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/api";
import { categoriesApi } from "@/lib/categories";
import { type Category } from "@repo/types";

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

    async function createCategory(values: Record<string, string>) {
        const dto: CreateCategoryDto = { name: values.name, description: values.description || undefined };
        await categoriesApi.create(dto);
        fetchCategories();
      }
    
      async function updateCategory(id: string, values: Record<string, string>) {
        const dto: UpdateCategoryDto = { name: values.name, description: values.description || undefined };
        await categoriesApi.update(id, dto);
        fetchCategories();
    }

    async function deleteCategory(id: string) {
        await categoriesApi.delete(id);
        fetchCategories();
    }

    return{categories, loading, error, createCategory, updateCategory, deleteCategory};
}

