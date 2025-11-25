import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { productsApi } from "@/app/api/products";
import { categoriesApi } from "@/app/api/categories";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import { Select } from "@/components/forms/Select";
import { CloseCircle } from "iconsax-react";

interface ProductFormModalProps {
  product?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductFormModal({
  product,
  onClose,
  onSuccess,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    shortDescription: product?.shortDescription || "",
    price: product?.price || "",
    compareAtPrice: product?.compareAtPrice || "",
    sku: product?.sku || "",
    stock: product?.stock || "",
    lowStockThreshold: product?.lowStockThreshold || 10,
    categoryId: product?.categoryId?._id || product?.categoryId || "",
    subCategoryId: product?.subCategoryId?._id || product?.subCategoryId || "",
    mainImage: product?.mainImage || "",
    images: product?.images?.join(",") || "",
    volume: product?.volume,
    weight: product?.weight,
    ingredients: product?.ingredients,
    howTouse: product?.howTouse,
    tags: product?.tags?.join(",") || "",
    brand: product?.brand || "",
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured || false,
    isNew: product?.isNew || false,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
  });

  const mutation = useMutation({
    mutationFn: (data: any) =>
      product
        ? productsApi.update(product._id, data)
        : productsApi.create(data),
    onSuccess,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoryId) {
      alert("Veuillez sélectionner une catégorie");
      return;
    }

    const payload: any = {
      ...formData,
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice
        ? Number(formData.compareAtPrice)
        : undefined,
      stock: Number(formData.stock),
      lowStockThreshold: Number(formData.lowStockThreshold),
      images: formData.images
        .split(",")
        .map((img: string) => img.trim())
        .filter(Boolean),
      tags: formData.tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter(Boolean),
    };

    // Remove empty optional fields to avoid "Invalid ID format" errors
    if (!payload.subCategoryId) {
      delete payload.subCategoryId;
    }
    if (!payload.compareAtPrice) {
      delete payload.compareAtPrice;
    }

    await mutation.mutateAsync(payload);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Auto-generate slug from name if name changes and we're creating a new product
    if (name === "name" && !product) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/15 bg-opacity-50 flex items-center justify-center z-50"
      style={{ padding: "16px" }}
    >
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 shadow-lg">
        {/* Header */}
        <div
          className="sticky top-0 bg-white border-b border-gray-100"
          style={{
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2 className="text-xl font-semibold">
            {product ? "Modifier le produit" : "Ajouter un produit"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <CloseCircle size={24} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div className="grid grid-cols-2" style={{ gap: "16px" }}>
            <div className="col-span-2">
              <Input
                label="Nom du produit"
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
                placeholder="mon-produit-beaute"
              />
            </div>

            <Input
              label="SKU"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
            />

            <Select
              label="Catégorie"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              options={
                categories?.map((cat: any) => ({
                  value: cat._id,
                  label: cat.name,
                })) || []
              }
              placeholder="Sélectionnez une catégorie"
              required
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

            <Input
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              required
            />

            <Input
              label="Seuil stock bas"
              name="lowStockThreshold"
              type="number"
              value={formData.lowStockThreshold}
              onChange={handleChange}
            />

            <Input
              label="Volume"
              name="volume"
              value={formData.volume}
              onChange={handleChange}
              required
            />

            <Input
              label="Weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
            />

            <div className="col-span-2">
              <Input
                label="Marque"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
              />
            </div>

            <div className="col-span-2">
              <Input
                label="Description courte"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
              />
            </div>

            <div className="col-span-2">
              <Textarea
                label="Description complète"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="col-span-2">
              <Textarea
                label="Ingrédients"
                name="ingredients"
                value={formData.ingredients && formData.ingredients.join(",")}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>

            <div className="col-span-2">
              <Textarea
                label="Caractéristiques"
                name="howTouse"
                value={formData.howTouse}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>

            <div className="col-span-2">
              <Input
                label="Image principale (URL)"
                name="mainImage"
                value={formData.mainImage}
                onChange={handleChange}
                required
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

            <div className="col-span-2">
              <Input
                label="Tags (séparés par des virgules)"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center gap-6 col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>Produit actif</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>Produit en vedette</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isNew"
                  checked={formData.isNew}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>Nouveau produit</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div
            className="flex justify-end border-t border-gray-100"
            style={{ gap: "12px", paddingTop: "16px" }}
          >
            <Button type="button" onClick={onClose} variant="outline">
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              variant="primary"
            >
              {mutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
