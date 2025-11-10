import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { categoriesApi } from "@/app/api/categories";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import { ImageUpload } from "@/components/forms/ImageUpload";
import { CloseCircle } from "iconsax-react";

interface CategoryFormModalProps {
  category?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function CategoryFormModal({ category, onClose, onSuccess }: CategoryFormModalProps) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    image: category?.image || '',
    order: category?.order || 0,
    isActive: category?.isActive ?? true,
  });

  const mutation = useMutation({
    mutationFn: (data: any) =>
      category ? categoriesApi.update(category._id, data) : categoriesApi.create(data),
    onSuccess,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      order: Number(formData.order),
    };

    await mutation.mutateAsync(payload);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    // Auto-generate slug from name if name changes and we're creating a new category
    if (name === 'name' && !category) {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ padding: '16px' }}>
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className="text-xl font-semibold">
            {category ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <CloseCircle size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Nom de la catégorie"
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
            placeholder="exemple-categorie"
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />

          <ImageUpload
            label="Image de la catégorie"
            value={formData.image}
            onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
            folder="kpure/categories"
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
            <span>Catégorie active</span>
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
