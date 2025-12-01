import { CloseCircle, Eye } from "iconsax-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

interface ProductViewModalProps {
  product: any;
  onClose: () => void;
}

export function ProductViewModal({ product, onClose }: ProductViewModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
          {/* Images supplémentaires */}
          {product.images && product.images.length > 0 && (
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-600 mb-2 block">
                Images supplémentaires ({product.images.length})
              </label>
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((imageUrl: string, index: number) => (
                  <div
                    key={index}
                    className="relative group cursor-pointer aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-blue-500 transition-all"
                    onClick={() => setSelectedImage(imageUrl)}
                  >
                    <img
                      src={imageUrl}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                      <Eye
                        size={24}
                        className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end border-t border-gray-200  pt-4 mt-6">
            <Button onClick={onClose} variant="outline">
              Fermer
            </Button>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
            >
              <CloseCircle size={32} />
            </button>
            <img
              src={selectedImage}
              alt="Image agrandie"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
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
