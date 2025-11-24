import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { productSectionAPI, CreateProductSectionDTO } from "@/app/api/productSections";
import { productsApi } from "@/app/api/products";
import { categoriesApi } from "@/app/api/categories";
import { Button } from "@/components/ui/Button";
import { CloseCircle, SearchNormal } from "iconsax-react";

interface Props {
  section?: any;
  onClose: () => void;
}

export function ProductSectionFormModal({ section, onClose }: Props) {
  const queryClient = useQueryClient();
  const isEditing = !!section;
  const [productSearch, setProductSearch] = useState('');

  const [formData, setFormData] = useState<CreateProductSectionDTO>({
    title: section?.title || '',
    slug: section?.slug || '',
    description: section?.description || '',
    type: section?.type || 'manual',
    products: section?.products?.map((p: any) => p._id || p) || [],
    criteria: section?.criteria || {},
    limit: section?.limit || 8,
    displayLocation: section?.displayLocation || ['home'],
    order: section?.order || 0,
    isActive: section?.isActive ?? true,
    style: section?.style || {
      layout: 'grid',
      columns: 4,
      showPrice: true,
      showRating: true,
      showQuickView: false,
    },
  });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getAll({}),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const mutation = useMutation({
    mutationFn: (data: CreateProductSectionDTO) => {
      if (isEditing) {
        return productSectionAPI.update(section._id, data);
      }
      return productSectionAPI.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productSections'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStyleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      style: { ...prev.style, [field]: value },
    }));
  };

  const handleCriteriaChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      criteria: { ...prev.criteria, [field]: value },
    }));
  };

  const handleLocationToggle = (location: string) => {
    setFormData((prev) => {
      const current = prev.displayLocation;
      if (current.includes(location)) {
        return { ...prev, displayLocation: current.filter((l) => l !== location) };
      }
      return { ...prev, displayLocation: [...current, location] };
    });
  };

  const handleProductToggle = (productId: string) => {
    setFormData((prev) => {
      const current = prev.products || [];
      if (current.includes(productId)) {
        return { ...prev, products: current.filter((p) => p !== productId) };
      }
      return { ...prev, products: [...current, productId] };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">
            {isEditing ? 'Modifier la section' : 'Nouvelle section de produits'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <CloseCircle size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-2 gap-4">
            {/* Title */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Titre *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Slug */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value as 'manual' | 'automatic')}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="manual">Manuel</option>
                <option value="automatic">Automatique</option>
              </select>
            </div>

            {/* Limit */}
            <div>
              <label className="block text-sm font-medium mb-1">Limite de produits *</label>
              <input
                type="number"
                value={formData.limit}
                onChange={(e) => handleChange('limit', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
                min={1}
                max={50}
                required
              />
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium mb-1">Ordre d'affichage</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => handleChange('order', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Active */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm font-medium">Section active</label>
            </div>

            {/* Display Locations */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Emplacements d'affichage *</label>
              <div className="flex flex-wrap gap-2">
                {['home', 'products', 'category', 'all'].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => handleLocationToggle(loc)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      formData.displayLocation.includes(loc)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Products Selection */}
            {formData.type === 'manual' && (
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Sélectionner les produits</label>

                {/* Search Bar */}
                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full px-3 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <SearchNormal
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>

                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                  {products && products.products.length > 0 ? (
                    products.products
                      .filter((product: any) =>
                        product.name.toLowerCase().includes(productSearch.toLowerCase())
                      )
                      .map((product: any) => (
                        <div key={product._id} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            checked={formData.products?.includes(product._id)}
                            onChange={() => handleProductToggle(product._id)}
                            className="mr-2"
                          />
                          <label className="text-sm">{product.name}</label>
                        </div>
                      ))
                  ) : (
                    <p className="text-sm text-gray-500">Aucun produit disponible</p>
                  )}
                  {products && products.products.length > 0 &&
                   products.products.filter((product: any) =>
                     product.name.toLowerCase().includes(productSearch.toLowerCase())
                   ).length === 0 && (
                    <p className="text-sm text-gray-500">Aucun produit trouvé</p>
                  )}
                </div>
              </div>
            )}

            {/* Automatic Criteria */}
            {formData.type === 'automatic' && (
              <div className="col-span-2 border rounded-lg p-4">
                <h3 className="font-medium mb-3">Critères de sélection automatique</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.criteria?.isFeatured}
                      onChange={(e) => handleCriteriaChange('isFeatured', e.target.checked)}
                      className="mr-2"
                    />
                    <label className="text-sm">Produits en vedette</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.criteria?.isNew}
                      onChange={(e) => handleCriteriaChange('isNew', e.target.checked)}
                      className="mr-2"
                    />
                    <label className="text-sm">Nouveaux produits</label>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Catégorie</label>
                    <select
                      value={formData.criteria?.categoryId || ''}
                      onChange={(e) => handleCriteriaChange('categoryId', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">Toutes les catégories</option>
                      {categories?.map((cat: any) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Trier par</label>
                    <select
                      value={formData.criteria?.sortBy || 'createdAt'}
                      onChange={(e) => handleCriteriaChange('sortBy', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="createdAt">Date de création</option>
                      <option value="rating">Note</option>
                      <option value="ordersCount">Popularité</option>
                      <option value="price">Prix croissant</option>
                      <option value="-price">Prix décroissant</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Style Options */}
            <div className="col-span-2 border rounded-lg p-4">
              <h3 className="font-medium mb-3">Options de style</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Layout</label>
                  <select
                    value={formData.style?.layout}
                    onChange={(e) => handleStyleChange('layout', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="grid">Grille</option>
                    <option value="carousel">Carrousel</option>
                    <option value="list">Liste</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Colonnes</label>
                  <input
                    type="number"
                    value={formData.style?.columns}
                    onChange={(e) => handleStyleChange('columns', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                    min={2}
                    max={6}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.style?.showPrice}
                    onChange={(e) => handleStyleChange('showPrice', e.target.checked)}
                    className="mr-2"
                  />
                  <label className="text-sm">Afficher le prix</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.style?.showRating}
                    onChange={(e) => handleStyleChange('showRating', e.target.checked)}
                    className="mr-2"
                  />
                  <label className="text-sm">Afficher la note</label>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="flex justify-end gap-3 p-6 border-t">
          <Button variant="outline" onClick={onClose} type="button">
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
