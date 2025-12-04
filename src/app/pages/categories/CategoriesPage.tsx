import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "@/app/api/categories";
import { subCategoriesApi } from "@/app/api/subcategories";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { Add, Edit, Trash } from "iconsax-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { CategoryFormModal } from "./CategoryFormModal";
import { SubCategoryFormModal } from "./SubCategoryFormModal";

type TabType = 'categories' | 'subcategories';

export function CategoriesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('categories');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<any>(null);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [showDeleteSubCategoryModal, setShowDeleteSubCategoryModal] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [deletingSubCategoryId, setDeletingSubCategoryId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const { data: subCategories, isLoading: subCategoriesLoading } = useQuery({
    queryKey: ['subcategories'],
    queryFn: () => subCategoriesApi.getAll(),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      setShowDeleteCategoryModal(false);
      setDeletingCategoryId(null);
    },
  });

  const deleteSubCategoryMutation = useMutation({
    mutationFn: (id: string) => subCategoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      setShowDeleteSubCategoryModal(false);
      setDeletingSubCategoryId(null);
    },
  });

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = (id: string) => {
    setDeletingCategoryId(id);
    setShowDeleteCategoryModal(true);
  };

  const handleConfirmDeleteCategory = async () => {
    if (deletingCategoryId) {
      await deleteCategoryMutation.mutateAsync(deletingCategoryId);
    }
  };

  const handleEditSubCategory = (subCategory: any) => {
    setEditingSubCategory(subCategory);
    setShowSubCategoryModal(true);
  };

  const handleDeleteSubCategory = (id: string) => {
    setDeletingSubCategoryId(id);
    setShowDeleteSubCategoryModal(true);
  };

  const handleConfirmDeleteSubCategory = async () => {
    if (deletingSubCategoryId) {
      await deleteSubCategoryMutation.mutateAsync(deletingSubCategoryId);
    }
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setEditingCategory(null);
  };

  const handleCloseSubCategoryModal = () => {
    setShowSubCategoryModal(false);
    setEditingSubCategory(null);
  };

  const getCategoryName = (categoryId: string | any): string => {
    if (typeof categoryId === 'object' && categoryId?.name) {
      return categoryId.name;
    }
    const category = categories?.find((cat: any) => cat._id === categoryId);
    return category?.name || 'N/A';
  };

  const isLoading = activeTab === 'categories' ? categoriesLoading : subCategoriesLoading;

  if (isLoading) {
    return <TableSkeleton rows={10} columns={6} />;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-base">Gestion des Catégories</h1>
        {activeTab === 'categories' ? (
          <Button
            onClick={() => setShowCategoryModal(true)}
            className="bg-[#14A800] text-white px-4 py-2 flex items-center gap-2"
          >
            <Add size={20} />
            Ajouter une catégorie
          </Button>
        ) : (
          <Button
            onClick={() => setShowSubCategoryModal(true)}
            className="bg-[#14A800] text-white px-4 py-2 flex items-center gap-2"
          >
            <Add size={20} />
            Ajouter une sous-catégorie
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'categories'
                ? 'border-[#14A800] text-[#14A800]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Catégories
            {categories && <span className="ml-2 text-gray-400">({categories.length})</span>}
          </button>
          <button
            onClick={() => setActiveTab('subcategories')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'subcategories'
                ? 'border-[#14A800] text-[#14A800]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Sous-catégories
            {subCategories && <span className="ml-2 text-gray-400">({subCategories.length})</span>}
          </button>
        </nav>
      </div>

      {/* Categories Table */}
      {activeTab === 'categories' && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Image</TableHeader>
              <TableHeader>Nom</TableHeader>
              <TableHeader>Slug</TableHeader>
              <TableHeader>Description</TableHeader>
              <TableHeader>Tags</TableHeader>
              <TableHeader>Ordre</TableHeader>
              <TableHeader>Statut</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories?.map((category: any) => (
              <TableRow key={category._id}>
                <TableCell>
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                      Aucune
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-gray-600">{category.slug}</TableCell>
                <TableCell>
                  {category.description ? (
                    <span className="text-sm">{category.description.substring(0, 50)}{category.description.length > 50 ? '...' : ''}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {category.tags && category.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {category.tags.slice(0, 3).map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {category.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{category.tags.length - 3}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>{category.order}</TableCell>
                <TableCell>
                  <Badge variant={category.isActive ? 'success' : 'default'}>
                    {category.isActive ? 'Actif' : 'Inactif'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* SubCategories Table */}
      {activeTab === 'subcategories' && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Image</TableHeader>
              <TableHeader>Nom</TableHeader>
              <TableHeader>Slug</TableHeader>
              <TableHeader>Catégorie</TableHeader>
              <TableHeader>Description</TableHeader>
              <TableHeader>Tags</TableHeader>
              <TableHeader>Ordre</TableHeader>
              <TableHeader>Statut</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {subCategories?.map((subCategory: any) => (
              <TableRow key={subCategory._id}>
                <TableCell>
                  {subCategory.image ? (
                    <img
                      src={subCategory.image}
                      alt={subCategory.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                      Aucune
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{subCategory.name}</TableCell>
                <TableCell className="text-gray-600">{subCategory.slug}</TableCell>
                <TableCell>
                  <Badge variant="default">{getCategoryName(subCategory.categoryId)}</Badge>
                </TableCell>
                <TableCell>
                  {subCategory.description ? (
                    <span className="text-sm">{subCategory.description.substring(0, 40)}{subCategory.description.length > 40 ? '...' : ''}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {subCategory.tags && subCategory.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {subCategory.tags.slice(0, 3).map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {subCategory.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{subCategory.tags.length - 3}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>{subCategory.order}</TableCell>
                <TableCell>
                  <Badge variant={subCategory.isActive ? 'success' : 'default'}>
                    {subCategory.isActive ? 'Actif' : 'Inactif'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSubCategory(subCategory)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteSubCategory(subCategory._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Category Form Modal */}
      {showCategoryModal && (
        <CategoryFormModal
          category={editingCategory}
          onClose={handleCloseCategoryModal}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            handleCloseCategoryModal();
          }}
        />
      )}

      {/* SubCategory Form Modal */}
      {showSubCategoryModal && (
        <SubCategoryFormModal
          subCategory={editingSubCategory}
          onClose={handleCloseSubCategoryModal}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['subcategories'] });
            handleCloseSubCategoryModal();
          }}
        />
      )}

      {/* Delete Category Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteCategoryModal}
        onClose={() => setShowDeleteCategoryModal(false)}
        onConfirm={handleConfirmDeleteCategory}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible et supprimera également toutes les sous-catégories associées."
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        isLoading={deleteCategoryMutation.isPending}
      />

      {/* Delete SubCategory Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteSubCategoryModal}
        onClose={() => setShowDeleteSubCategoryModal(false)}
        onConfirm={handleConfirmDeleteSubCategory}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cette sous-catégorie ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        isLoading={deleteSubCategoryMutation.isPending}
      />
    </div>
  );
}
