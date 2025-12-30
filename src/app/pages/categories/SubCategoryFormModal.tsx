import {  Key, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { subCategoriesApi } from "@/app/api/subcategories";
import { categoriesApi } from "@/app/api/categories";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import { Select } from "@/components/forms/Select";
import { ImageUpload } from "@/components/forms/ImageUpload";
import { CloseCircle,  CloseSquare } from "iconsax-react";

interface SubCategoryFormModalProps {
  subCategory?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function SubCategoryFormModal({ subCategory, onClose, onSuccess }: SubCategoryFormModalProps) {
  const [formData, setFormData] = useState({
    name: subCategory?.name || '',
    slug: subCategory?.slug || '',
    description: subCategory?.description || '',
    image: subCategory?.image || '',
    tags: subCategory?.tags || [],
    categoryId: subCategory?.categoryId?._id || subCategory?.categoryId || '',
    order: subCategory?.order || 0,
    isActive: subCategory?.isActive ?? true,
  });
  const [tagInput, setTagInput] = useState('');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const mutation = useMutation({
    mutationFn: (data: any) =>
      subCategory ? subCategoriesApi.update(subCategory._id, data) : subCategoriesApi.create(data),
    onSuccess,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoryId) {
      alert('Veuillez sélectionner une catégorie parente');
      return;
    }

    const payload = {
      ...formData,
      order: Number(formData.order),
    };

    await mutation.mutateAsync(payload);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Auto-generate slug from name if name changes and we're creating a new subcategory
    if (name === 'name' && !subCategory) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({
        ...prev,
        name: value,
        slug
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((tag: string) => tag !== tagToRemove)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ padding: '16px' }}>
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className="text-xl font-semibold">
            {subCategory ? 'Modifier la sous-catégorie' : 'Ajouter une sous-catégorie'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <CloseCircle size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Select
            label="Catégorie parente"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            options={categories?.map((cat: any) => ({
              value: cat._id,
              label: cat.name,
            })) || []}
            placeholder="Sélectionnez une catégorie"
            required
          />

          <Input
            label="Nom de la sous-catégorie"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Slug (URL)"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            placeholder="exemple-sous-categorie"
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (pour la recherche)
            </label>
            <div className="space-y-2">
              <Input
                placeholder="Ajoutez un tag et appuyez sur Entrée"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag: string , index: Key | null | undefined) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-green-900"
                      >
                        <CloseSquare size={16} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <ImageUpload
            label="Image de la sous-catégorie"
            value={formData.image}
            onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
            folder="kpure/subcategories"
          />

          <Input
            label="Ordre d'affichage"
            name="order"
            type="number"
            value={formData.order}
            onChange={handleChange}
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>Sous-catégorie active</span>
          </label>

          {/* Actions */}
          <div className="flex justify-end border-t border-gray-100" style={{ gap: '12px', paddingTop: '16px' }}>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              variant="primary"
            >
              {mutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
