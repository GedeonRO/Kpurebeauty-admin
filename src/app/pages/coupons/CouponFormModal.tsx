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

interface CouponFormModalProps {
  coupon?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const discountTypeOptions = [
  { value: 'percentage', label: 'Pourcentage' },
  { value: 'fixed', label: 'Montant fixe' },
];

export function CouponFormModal({ coupon, onClose, onSuccess }: CouponFormModalProps) {
  const [formData, setFormData] = useState({
    code: coupon?.code || '',
    description: coupon?.description || '',
    discountType: coupon?.discountType || 'percentage',
    discountValue: coupon?.discountValue || '',
    minPurchaseAmount: coupon?.minPurchaseAmount || '',
    maxDiscountAmount: coupon?.maxDiscountAmount || '',
    validFrom: coupon?.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    validUntil: coupon?.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : '',
    usageLimit: coupon?.usageLimit || '',
    perUserLimit: coupon?.perUserLimit || '',
    applicableProducts: coupon?.applicableProducts || [],
    applicableCategories: coupon?.applicableCategories || [],
    applicableRoutines: coupon?.applicableRoutines || [],
    excludeProducts: coupon?.excludeProducts || [],
    excludeCategories: coupon?.excludeCategories || [],
    isActive: coupon?.isActive ?? true,
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
      coupon ? promotionsApi.updateCoupon(coupon._id, data) : promotionsApi.createCoupon(data),
    onSuccess,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      code: formData.code.toUpperCase(),
      description: formData.description,
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      validFrom: new Date(formData.validFrom),
      validUntil: formData.validUntil ? new Date(formData.validUntil) : undefined,
      isActive: formData.isActive,
      applicableProducts: formData.applicableProducts.length > 0 ? formData.applicableProducts : undefined,
      applicableCategories: formData.applicableCategories.length > 0 ? formData.applicableCategories : undefined,
      applicableRoutines: formData.applicableRoutines.length > 0 ? formData.applicableRoutines : undefined,
      excludeProducts: formData.excludeProducts.length > 0 ? formData.excludeProducts : undefined,
      excludeCategories: formData.excludeCategories.length > 0 ? formData.excludeCategories : undefined,
    };

    // Add optional fields
    if (formData.minPurchaseAmount) {
      payload.minPurchaseAmount = Number(formData.minPurchaseAmount);
    }
    if (formData.maxDiscountAmount) {
      payload.maxDiscountAmount = Number(formData.maxDiscountAmount);
    }
    if (formData.usageLimit) {
      payload.usageLimit = Number(formData.usageLimit);
    }
    if (formData.perUserLimit) {
      payload.perUserLimit = Number(formData.perUserLimit);
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
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className="text-xl font-semibold">
            {coupon ? 'Modifier le coupon' : 'Ajouter un coupon'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <CloseCircle size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <Input
              label="Code du coupon"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              placeholder="BIENVENUE2024"
              className="uppercase"
            />

            <Select
              label="Type de réduction"
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              options={discountTypeOptions}
              required
            />

            <div className="col-span-2">
              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                required
                placeholder="Description du coupon pour les clients"
              />
            </div>

            <Input
              label={formData.discountType === 'percentage' ? 'Pourcentage de réduction' : 'Montant de réduction (XOF)'}
              name="discountValue"
              type="number"
              value={formData.discountValue}
              onChange={handleChange}
              required
              placeholder={formData.discountType === 'percentage' ? '10' : '5000'}
            />

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

            <Input
              label="Limite d'utilisation totale"
              name="usageLimit"
              type="number"
              value={formData.usageLimit}
              onChange={handleChange}
              placeholder="Illimité"
            />

            <Input
              label="Limite par utilisateur"
              name="perUserLimit"
              type="number"
              value={formData.perUserLimit}
              onChange={handleChange}
              placeholder="Illimité"
            />

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

            <div className="col-span-2">
              <MultiSelect
                label="Catégories exclues"
                value={formData.excludeCategories}
                onChange={(value) => setFormData(prev => ({ ...prev, excludeCategories: value }))}
                options={categories?.map((c: any) => ({
                  value: c._id,
                  label: c.name,
                })) || []}
                placeholder="Aucune catégorie exclue"
              />
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>Coupon actif</span>
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
