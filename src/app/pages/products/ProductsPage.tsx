import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/app/api/products";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { formatCurrency } from "@/lib/utils/formatters";
import { Add, Edit, Trash, SearchNormal, Eye } from "iconsax-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { ProductFormModal } from "./ProductFormModal";
import { ProductViewModal } from "./productView";
import { Input } from "@/components/forms/Input";

export function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showProduct, setShowProduct] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null
  );
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["products", page, search],
    queryFn: () => productsApi.getAll({ page, limit: 20, search }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowDeleteModal(false);
      setDeletingProductId(null);
    },
  });

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleShow = (product: any) => {
    setEditingProduct(product);
    setShowProduct(true);
  };

  const handleDelete = (id: string) => {
    setDeletingProductId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingProductId) {
      await deleteMutation.mutateAsync(deletingProductId);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowProduct(false);
    setEditingProduct(null);
  };

  if (isLoading) {
    return <TableSkeleton rows={20} columns={7} />;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-base">Gestion des Produits</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Input
              placeholder="Rechercher des produits..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className=" w-64"
              style={{ paddingLeft: 36 }}
            />
            <SearchNormal
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-[#14A800] text-white px-4 py-2 flex items-center gap-2"
          >
            <Add size={20} />
            Ajouter un produit
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Image</TableHeader>
            <TableHeader>Nom</TableHeader>
            <TableHeader>SKU</TableHeader>
            <TableHeader>Catégorie</TableHeader>
            <TableHeader>Prix</TableHeader>
            <TableHeader>Stock</TableHeader>
            <TableHeader>Statut</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.products?.map((product: any) => (
            <TableRow key={product._id}>
              <TableCell>
                <img
                  src={product.mainImage}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                />
              </TableCell>
              <TableCell className="font-medium max-w-[360px] truncate">
                {product.name}
              </TableCell>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{product.categoryId?.name || "-"}</TableCell>
              <TableCell>{formatCurrency(product.price)}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    product.stock === 0
                      ? "danger"
                      : product.stock < 10
                      ? "warning"
                      : "success"
                  }
                >
                  {product.stock} en stock
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={product.isActive ? "success" : "default"}>
                  {product.isActive ? "Actif" : "Inactif"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleShow(product)}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
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

      {/* Pagination */}
      {data?.pagination && (
        <Pagination
          currentPage={page}
          totalPages={data.pagination.pages}
          onPageChange={setPage}
        />
      )}

      {/* Product Form Modal */}
      {showModal && (
        <ProductFormModal
          product={editingProduct}
          onClose={handleCloseModal}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            handleCloseModal();
          }}
        />
      )}

      {showProduct && (
        <ProductViewModal product={editingProduct} onClose={handleCloseModal} />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible et supprimera toutes les données associées."
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
