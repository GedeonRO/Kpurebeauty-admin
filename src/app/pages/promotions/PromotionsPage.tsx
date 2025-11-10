import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { promotionsApi } from "@/app/api/promotions";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { Add, Edit, Trash, ToggleOn, ToggleOff } from "iconsax-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { PromotionFormModal } from "./PromotionFormModal";

const typeLabels: Record<string, string> = {
  percentage: 'Pourcentage',
  fixed: 'Montant fixe',
  buy_x_get_y: 'Achetez X obtenez Y',
  free_shipping: 'Livraison gratuite',
};

export function PromotionsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPromotionId, setDeletingPromotionId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: promotions, isLoading } = useQuery({
    queryKey: ['promotions'],
    queryFn: () => promotionsApi.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => promotionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      setShowDeleteModal(false);
      setDeletingPromotionId(null);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => promotionsApi.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
  });

  const handleEdit = (promotion: any) => {
    setEditingPromotion(promotion);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setDeletingPromotionId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingPromotionId) {
      await deleteMutation.mutateAsync(deletingPromotionId);
    }
  };

  const handleToggleStatus = async (id: string) => {
    await toggleStatusMutation.mutateAsync(id);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPromotion(null);
  };

  const getDiscountDisplay = (promotion: any) => {
    if (promotion.type === 'percentage') {
      return `${promotion.discountValue}%`;
    } else if (promotion.type === 'fixed') {
      return formatCurrency(promotion.discountValue);
    } else if (promotion.type === 'buy_x_get_y') {
      return `${promotion.buyQuantity} + ${promotion.getQuantity}`;
    } else {
      return 'Gratuit';
    }
  };

  const isPromotionActive = (promotion: any) => {
    if (!promotion.isActive) return false;
    const now = new Date();
    const validFrom = new Date(promotion.validFrom);
    const validUntil = promotion.validUntil ? new Date(promotion.validUntil) : null;

    if (validFrom > now) return false;
    if (validUntil && validUntil < now) return false;

    return true;
  };

  if (isLoading) {
    return <TableSkeleton rows={10} columns={8} />;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-base">Gestion des Promotions</h1>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-[#14A800] text-white px-4 py-2 flex items-center gap-2"
        >
          <Add size={20} />
          Ajouter une promotion
        </Button>
      </div>

      {/* Promotions Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Nom</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Réduction</TableHeader>
            <TableHeader>Valide du</TableHeader>
            <TableHeader>Valide jusqu'au</TableHeader>
            <TableHeader>Priorité</TableHeader>
            <TableHeader>Statut</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {promotions?.map((promotion: any) => (
            <TableRow key={promotion._id}>
              <TableCell>
                <div>
                  <p className="font-medium">{promotion.name}</p>
                  {promotion.description && (
                    <p className="text-sm text-gray-600 truncate max-w-xs">
                      {promotion.description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="info">{typeLabels[promotion.type]}</Badge>
              </TableCell>
              <TableCell className="font-medium">
                {getDiscountDisplay(promotion)}
              </TableCell>
              <TableCell className="text-sm">
                {formatDate(promotion.validFrom)}
              </TableCell>
              <TableCell className="text-sm">
                {promotion.validUntil ? formatDate(promotion.validUntil) : 'Indéfini'}
              </TableCell>
              <TableCell>
                <Badge variant={promotion.priority > 0 ? 'primary' : 'default'}>
                  {promotion.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <Badge variant={promotion.isActive ? 'success' : 'default'}>
                    {promotion.isActive ? 'Actif' : 'Inactif'}
                  </Badge>
                  {isPromotionActive(promotion) && (
                    <Badge variant="success" className="text-xs">
                      En cours
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(promotion._id)}
                    className={promotion.isActive ? "text-orange-600 hover:text-orange-800" : "text-green-600 hover:text-green-800"}
                    title={promotion.isActive ? "Désactiver" : "Activer"}
                  >
                    {promotion.isActive ? <ToggleOff size={18} /> : <ToggleOn size={18} />}
                  </button>
                  <button
                    onClick={() => handleEdit(promotion)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(promotion._id)}
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

      {/* Promotion Form Modal */}
      {showModal && (
        <PromotionFormModal
          promotion={editingPromotion}
          onClose={handleCloseModal}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['promotions'] });
            handleCloseModal();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cette promotion ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
