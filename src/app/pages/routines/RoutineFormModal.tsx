import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { routinesApi } from "@/app/api/routines";
import { productsApi } from "@/app/api/products";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import { Select } from "@/components/forms/Select";
import { ImageUpload } from "@/components/forms/ImageUpload";
import { CloseCircle, Add, Trash } from "iconsax-react";
import type { Routine, RoutineProduct, Product } from "@/types";

interface RoutineFormModalProps {
  routine?: Routine | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function RoutineFormModal({ routine, onClose, onSuccess }: RoutineFormModalProps) {
  const [formData, setFormData] = useState({
    name: routine?.name || '',
    slug: routine?.slug || '',
    description: routine?.description || '',
    goal: routine?.goal || '',
    duration: routine?.duration || '',
    price: routine?.price || '',
    compareAtPrice: routine?.compareAtPrice || '',
    image: routine?.image || '',
    images: routine?.images?.join(',') || '',
    skinType: routine?.skinType || [],
    concerns: routine?.concerns?.join(',') || '',
    isActive: routine?.isActive ?? true,
    isFeatured: routine?.isFeatured || false,
    order: routine?.order || 0,
  });

  const [routineProducts, setRoutineProducts] = useState<RoutineProduct[]>(
    routine?.products || []
  );

  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getAll({ limit: 1000 }),
  });

  const products = productsData?.products || [];

  const mutation = useMutation({
    mutationFn: (data: any) =>
      routine ? routinesApi.update(routine._id, data) : routinesApi.create(data),
    onSuccess,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (routineProducts.length === 0) {
      alert('Veuillez ajouter au moins un produit à la routine');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
      order: Number(formData.order),
      images: formData.images.split(',').map((img: string) => img.trim()).filter(Boolean),
      concerns: formData.concerns.split(',').map((c: string) => c.trim()).filter(Boolean),
      products: routineProducts.map(p => ({
        productId: typeof p.productId === 'object' ? (p.productId as Product)._id : p.productId,
        order: p.order,
        note: p.note || undefined,
      })),
    };

    await mutation.mutateAsync(payload);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Auto-generate slug from name if name changes and we're creating a new routine
    if (name === 'name' && !routine) {
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

  const handleSkinTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData(prev => ({ ...prev, skinType: selected }));
  };

  const addProduct = () => {
    setRoutineProducts([...routineProducts, { productId: '', order: routineProducts.length + 1, note: '' }]);
  };

  const removeProduct = (index: number) => {
    setRoutineProducts(routineProducts.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, field: keyof RoutineProduct, value: any) => {
    const updated = [...routineProducts];
    updated[index] = { ...updated[index], [field]: value };
    setRoutineProducts(updated);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ padding: '16px' }}>
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className="text-xl font-semibold">
            {routine ? 'Modifier la routine' : 'Ajouter une routine'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <CloseCircle size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Basic Info */}
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <div className="col-span-2">
              <Input
                label="Nom de la routine"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-span-2">
              <Input
                label="Slug (URL)"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                placeholder="ma-routine-beaute"
              />
            </div>

            <div className="col-span-2">
              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <Input
              label="Objectif"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              required
              placeholder="Ex: Hydratation intense"
            />

            <Input
              label="Durée"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Ex: 4 semaines"
            />

            <Input
              label="Prix (XOF)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />

            <Input
              label="Prix comparé (XOF)"
              name="compareAtPrice"
              type="number"
              value={formData.compareAtPrice}
              onChange={handleChange}
            />
          </div>

          {/* Images */}
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <div className="col-span-2">
              <ImageUpload
                label="Image principale"
                value={formData.image}
                onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                folder="kpure/routines"
              />
            </div>

            <div className="col-span-2">
              <Input
                label="Images supplémentaires (URLs séparées par des virgules)"
                name="images"
                value={formData.images}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Products Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Produits de la routine *
              </label>
              <Button
                type="button"
                onClick={addProduct}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Add size={18} />
                Ajouter un produit
              </Button>
            </div>

            <div className="space-y-3">
              {routineProducts.map((rp, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-12 gap-3 items-start">
                    <div className="col-span-5">
                      <Select
                        label="Produit"
                        name={`product-${index}`}
                        value={typeof rp.productId === 'object' ? (rp.productId as Product)._id : rp.productId}
                        onChange={(e) => updateProduct(index, 'productId', e.target.value)}
                        options={products?.map((p: Product) => ({
                          value: p._id,
                          label: p.name,
                        })) || []}
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <Input
                        label="Ordre"
                        name={`order-${index}`}
                        type="number"
                        value={rp.order}
                        onChange={(e) => updateProduct(index, 'order', Number(e.target.value))}
                        required
                      />
                    </div>

                    <div className="col-span-4">
                      <Input
                        label="Note (optionnel)"
                        name={`note-${index}`}
                        value={rp.note || ''}
                        onChange={(e) => updateProduct(index, 'note', e.target.value)}
                        placeholder="Ex: Appliquer le matin"
                      />
                    </div>

                    <div className="col-span-1 flex items-end">
                      <button
                        type="button"
                        onClick={() => removeProduct(index)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <Trash size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {routineProducts.length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  Aucun produit ajouté. Cliquez sur "Ajouter un produit" pour commencer.
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de peau
              </label>
              <select
                multiple
                value={formData.skinType}
                onChange={handleSkinTypeChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                style={{ height: '120px' }}
              >
                <option value="dry">Sèche</option>
                <option value="oily">Grasse</option>
                <option value="combination">Mixte</option>
                <option value="sensitive">Sensible</option>
                <option value="normal">Normale</option>
                <option value="all">Tous types</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Maintenez Ctrl (ou Cmd) pour sélectionner plusieurs options</p>
            </div>

            <div className="col-span-2">
              <Input
                label="Préoccupations (séparées par des virgules)"
                name="concerns"
                value={formData.concerns}
                onChange={handleChange}
                placeholder="rides, hydratation, éclat"
              />
            </div>

            <Input
              label="Ordre d'affichage"
              name="order"
              type="number"
              value={formData.order}
              onChange={handleChange}
            />

            <div className="flex items-center gap-6 col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>Routine active</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>Routine en vedette</span>
              </label>
            </div>
          </div>

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
