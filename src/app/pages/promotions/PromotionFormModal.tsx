import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { promotionsApi } from "@/app/api/promotions";
import { productsApi } from "@/app/api/products";
import { categoriesApi } from "@/app/api/categories";
import { routinesApi } from "@/app/api/routines";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import { Select } from "@/components/forms/Select";
import { MultiSelect } from "@/components/forms/MultiSelect";
import { CloseCircle } from "iconsax-react";

interface PromotionFormModalProps {
  promotion?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const typeOptions = [
  { value: 'percentage', label: 'Pourcentage' },
  { value: 'fixed', label: 'Montant fixe' },
  { value: 'buy_x_get_y', label: 'Achetez X obtenez Y' },
  { value: 'free_shipping', label: 'Livraison gratuite' },
];

export function PromotionFormModal({ promotion, onClose, onSuccess }: PromotionFormModalProps) {
  const [formData, setFormData] = useState({
    name: promotion?.name || '',
    description: promotion?.description || '',
    type: promotion?.type || 'percentage',
    discountValue: promotion?.discountValue || '',
    buyQuantity: promotion?.buyQuantity || '',
    getQuantity: promotion?.getQuantity || '',
    applicableProducts: promotion?.applicableProducts || [],
    applicableCategories: promotion?.applicableCategories || [],
    applicableRoutines: promotion?.applicableRoutines || [],
    excludeProducts: promotion?.excludeProducts || [],
    minPurchaseAmount: promotion?.minPurchaseAmount || '',
    maxDiscountAmount: promotion?.maxDiscountAmount || '',
    priority: promotion?.priority || 0,
    validFrom: promotion?.validFrom ? new Date(promotion.validFrom).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    validUntil: promotion?.validUntil ? new Date(promotion.validUntil).toISOString().split('T')[0] : '',
    isActive: promotion?.isActive ?? true,
    canCombineWithCoupons: promotion?.canCombineWithCoupons ?? true,
  });

  // Load data for selects
  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getAll({ limit: 1000 }),
  });
  const products = productsData?.products || [];

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const { data: routines } = useQuery({
    queryKey: ['routines'],
    queryFn: () => routinesApi.getAll({ limit: 1000 }),
  });

  const mutation = useMutation({
    mutationFn: (data: any) =>
      promotion ? promotionsApi.update(promotion._id, data) : promotionsApi.create(data),
    onSuccess,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      name: formData.name,
      description: formData.description || undefined,
      type: formData.type,
      priority: Number(formData.priority),
      validFrom: new Date(formData.validFrom),
      validUntil: formData.validUntil ? new Date(formData.validUntil) : undefined,
      isActive: formData.isActive,
      canCombineWithCoupons: formData.canCombineWithCoupons,
      applicableProducts: formData.applicableProducts.length > 0 ? formData.applicableProducts : undefined,
      applicableCategories: formData.applicableCategories.length > 0 ? formData.applicableCategories : undefined,
      applicableRoutines: formData.applicableRoutines.length > 0 ? formData.applicableRoutines : undefined,
      excludeProducts: formData.excludeProducts.length > 0 ? formData.excludeProducts : undefined,
    };

    // Add type-specific fields
    if (formData.type === 'percentage' || formData.type === 'fixed') {
      payload.discountValue = Number(formData.discountValue);
    }

    if (formData.type === 'buy_x_get_y') {
      payload.buyQuantity = Number(formData.buyQuantity);
      payload.getQuantity = Number(formData.getQuantity);
    }

    // Add optional fields
    if (formData.minPurchaseAmount) {
      payload.minPurchaseAmount = Number(formData.minPurchaseAmount);
    }
    if (formData.maxDiscountAmount) {
      payload.maxDiscountAmount = Number(formData.maxDiscountAmount);
    }

    await mutation.mutateAsync(payload);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ padding: '16px' }}>
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className="text-xl font-semibold">
            {promotion ? 'Modifier la promotion' : 'Ajouter une promotion'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <CloseCircle size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <div className="col-span-2">
              <Input
                label="Nom de la promotion"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-span-2">
              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
              />
            </div>

            <Select
              label="Type de promotion"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={typeOptions}
              required
            />

            <Input
              label="Priorité"
              name="priority"
              type="number"
              value={formData.priority}
              onChange={handleChange}
            />

            {/* Conditional fields based on type */}
            {(formData.type === 'percentage' || formData.type === 'fixed') && (
              <Input
                label={formData.type === 'percentage' ? 'Pourcentage de réduction' : 'Montant de réduction (XOF)'}
                name="discountValue"
                type="number"
                value={formData.discountValue}
                onChange={handleChange}
                required
                placeholder={formData.type === 'percentage' ? '10' : '5000'}
              />
            )}

            {formData.type === 'buy_x_get_y' && (
              <>
                <Input
                  label="Quantité é acheter"
                  name="buyQuantity"
                  type="number"
                  value={formData.buyQuantity}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Quantité gratuite"
                  name="getQuantity"
                  type="number"
                  value={formData.getQuantity}
                  onChange={handleChange}
                  required
                />
              </>
            )}

            <Input
              label="Montant minimum d'achat (XOF)"
              name="minPurchaseAmount"
              type="number"
              value={formData.minPurchaseAmount}
              onChange={handleChange}
              placeholder="Optionnel"
            />

            <Input
              label="Montant maximum de réduction (XOF)"
              name="maxDiscountAmount"
              type="number"
              value={formData.maxDiscountAmount}
              onChange={handleChange}
              placeholder="Optionnel"
            />

            {/* Applicable items */}
            <div className="col-span-2">
              <MultiSelect
                label="Produits applicables (laissez vide pour tous)"
                value={formData.applicableProducts}
                onChange={(value) => setFormData(prev => ({ ...prev, applicableProducts: value }))}
                options={products?.map((p: any) => ({
                  value: p._id,
                  label: p.name,
                })) || []}
                placeholder="Tous les produits"
              />
            </div>

            <div className="col-span-2">
              <MultiSelect
                label="Catégories applicables (laissez vide pour toutes)"
                value={formData.applicableCategories}
                onChange={(value) => setFormData(prev => ({ ...prev, applicableCategories: value }))}
                options={categories?.map((c: any) => ({
                  value: c._id,
                  label: c.name,
                })) || []}
                placeholder="Toutes les catégories"
              />
            </div>

            <div className="col-span-2">
              <MultiSelect
                label="Routines applicables (laissez vide pour toutes)"
                value={formData.applicableRoutines}
                onChange={(value) => setFormData(prev => ({ ...prev, applicableRoutines: value }))}
                options={routines?.map((r: any) => ({
                  value: r._id,
                  label: r.name,
                })) || []}
                placeholder="Toutes les routines"
              />
            </div>

            <div className="col-span-2">
              <MultiSelect
                label="Produits exclus"
                value={formData.excludeProducts}
                onChange={(value) => setFormData(prev => ({ ...prev, excludeProducts: value }))}
                options={products?.map((p: any) => ({
                  value: p._id,
                  label: p.name,
                })) || []}
                placeholder="Aucun produit exclu"
              />
            </div>

            <Input
              label="Valide à partir du"
              name="validFrom"
              type="date"
              value={formData.validFrom}
              onChange={handleChange}
              required
            />

            <Input
              label="Valide jusqu'au"
              name="validUntil"
              type="date"
              value={formData.validUntil}
              onChange={handleChange}
              placeholder="Optionnel"
            />

            <div className="col-span-2 flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>Promotion active</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="canCombineWithCoupons"
                  checked={formData.canCombineWithCoupons}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>Combinable avec les coupons</span>
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
