import { CloseCircle } from "iconsax-react";
import { Button } from "@/components/ui/Button";

interface ProductViewModalProps {
  product: any;
  onClose: () => void;
}

export function ProductViewModal({ product, onClose }: ProductViewModalProps) {
  if (!product) return null;

  const formatArray = (arr?: string[] | string) => {
    if (!arr) return "-";
    if (Array.isArray(arr)) return arr.join(", ");
    return arr;
  };

  const formatBoolean = (value?: boolean) => (value ? "Oui" : "Non");

  return (
    <div className="fixed inset-0 bg-black/15 flex items-center justify-center z-50 p-4">
      <div className="bg-white  rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200  shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white  border-b border-gray-200  flex justify-between items-center p-5">
          <h2 className="text-xl font-semibold">Détails du produit</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <CloseCircle size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Image principale */}
          {product.mainImage && (
            <div className="flex justify-center mb-4">
              <img
                src={product.mainImage}
                alt={product.name}
                className="max-h-48 rounded-lg object-contain border border-gray-100 "
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Field label="Nom du produit" value={product.name} />
            <Field label="Slug (URL)" value={product.slug} />
            <Field label="Marque" value={product.brand} />
            <Field
              label="Catégorie"
              value={product.categoryId?.name || product.categoryId}
            />
            <Field
              label="Sous-catégorie"
              value={
                product.subCategoryId?.name || product.subCategoryId || "-"
              }
            />
            <Field
              label="Prix (XOF)"
              value={product.price?.toLocaleString() + " XOF"}
            />
            <Field
              label="Prix comparé (XOF)"
              value={
                product.compareAtPrice ? product.compareAtPrice + " XOF" : "-"
              }
            />
            <Field label="SKU" value={product.sku} />
            <Field label="Stock" value={product.stock} />
            <Field label="Seuil stock bas" value={product.lowStockThreshold} />
            <Field label="Volume" value={product.volume || "-"} />
            <Field label="Poids" value={product.weight || "-"} />
            <Field
              label="Produit actif"
              value={formatBoolean(product.isActive)}
            />
            <Field
              label="Produit en vedette"
              value={formatBoolean(product.isFeatured)}
            />
            <Field
              label="Nouveau produit"
              value={formatBoolean(product.isNew)}
            />
          </div>

          <Field
            label="Description courte"
            value={product.shortDescription || "-"}
            fullWidth
          />
          <Field
            label="Description complète"
            value={product.description || "-"}
            fullWidth
            multiline
          />
          <Field
            label="Ingrédients"
            value={formatArray(product.ingredients)}
            fullWidth
            multiline
          />
          <Field
            label="Mode d’utilisation"
            value={product.howTouse || "-"}
            fullWidth
            multiline
          />
          <Field label="Tags" value={formatArray(product.tags)} fullWidth />
          <Field
            label="Images supplémentaires"
            value={formatArray(product.images)}
            fullWidth
            multiline
          />

          {/* Actions */}
          <div className="flex justify-end border-t border-gray-200  pt-4 mt-6">
            <Button onClick={onClose} variant="outline">
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🧱 Composant Field réutilisable
function Field({
  label,
  value,
  fullWidth,
  multiline,
}: {
  label: string;
  value: any;
  fullWidth?: boolean;
  multiline?: boolean;
}) {
  return (
    <div className={`flex flex-col ${fullWidth ? "col-span-2" : ""}`}>
      <label className="text-sm font-medium text-gray-600  mb-1">
        {label}
      </label>
      {multiline ? (
        <div className="p-3 border border-gray-200  rounded-lg bg-gray-50  text-gray-800  whitespace-pre-line">
          {value || "-"}
        </div>
      ) : (
        <div className="p-3 border border-gray-200  rounded-lg bg-gray-50  text-gray-800 ">
          {value || "-"}
        </div>
      )}
    </div>
  );
}
