import { useState } from "react";
import { getApiErrorMessage } from "@/lib/api";
import { CreateCategoryDto, UpdateCategoryDto, type Category } from "@repo/types";

export function useCategoryForms(
    onCreate: (dto: CreateCategoryDto)=>Promise<void>,
    onUpdate: (id: string, dto: UpdateCategoryDto)=> Promise<void>,
    onDelete: (id:string)=> Promise<void>,
){
    //Create
    const [showCreate, setShowCreate] =useState(false);
    const [createName, setCreateName] = useState('');
    const [createDescription, setCreateDescription] = useState('');
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState('');
    //Update
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription]= useState('');
    const [editLoading, setEditLoading] =useState(false);
    const [editError, setEditError] = useState('');
    //Delete
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState(``);

    async function handleCreate(e: React.SubmitEvent) {
        e.preventDefault();
        setCreateLoading(true);
        setCreateError('');
        try{
            await onCreate({name: createName, description: createDescription || undefined})
            setCreateName('');
            setCreateDescription('');
            setShowCreate(false);
        } catch (err) {
            setCreateError(getApiErrorMessage(err));
        } finally {
            setCreateLoading(false);
        }
    }

    function openEdit(category: Category) {
        setEditCategory(category);
        setEditName(category.name);
        setEditDescription(category.description ?? '');
        setEditError('');
      }
      
    async function handleEdit(e: React.SubmitEvent) {
        e.preventDefault();
        if (!editCategory) return;
        setEditLoading(true);
        setEditError('');

        try{
            await onUpdate(editCategory.id, {name: editName, description: editDescription || undefined})
            setEditCategory(null);
        }catch(err) {
            setEditError(getApiErrorMessage(err));
        }finally {
            setEditLoading(false);
        }
    }

    async function handleDelete() {
        if(!deleteId) return;
        setDeleteLoading(true);
        setDeleteError(``);

        try{
            await onDelete(deleteId);
            setDeleteId(null);
        }catch(err){
            setDeleteError(getApiErrorMessage(err));
        }finally{
            setDeleteLoading(false);
        }
    }

    return {
        // Create
        showCreate, setShowCreate, 
        createName, setCreateName, 
        createDescription, setCreateDescription,
        createLoading, createError, 
        handleCreate,
        // Edit
        editCategory, setEditCategory,
        editName, setEditName,
        editDescription, setEditDescription,
        editLoading, editError,
        openEdit, handleEdit,
        // Delete
        deleteId, setDeleteId,
        deleteLoading,
        deleteError,
        handleDelete,


    }
}