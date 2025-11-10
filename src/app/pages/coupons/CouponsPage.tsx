import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { promotionsApi } from "@/app/api/promotions";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { Add, Edit, Trash } from "iconsax-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { CouponFormModal } from "./CouponFormModal";

export function CouponsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCouponId, setDeletingCouponId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: coupons, isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: () => promotionsApi.getAllCoupons(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => promotionsApi.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      setShowDeleteModal(false);
      setDeletingCouponId(null);
    },
  });

  const handleEdit = (coupon: any) => {
    setEditingCoupon(coupon);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setDeletingCouponId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingCouponId) {
      await deleteMutation.mutateAsync(deletingCouponId);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
  };

  if (isLoading) {
    return <TableSkeleton rows={10} columns={7} />;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-base">Gestion des Coupons</h1>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-[#14A800] text-white px-4 py-2 flex items-center gap-2"
        >
          <Add size={20} />
          Ajouter un coupon
        </Button>
      </div>

      {/* Coupons Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Code</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Valeur</TableHeader>
            <TableHeader>Utilisations</TableHeader>
            <TableHeader>Validité</TableHeader>
            <TableHeader>Statut</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {coupons?.map((coupon: any) => (
            <TableRow key={coupon._id}>
              <TableCell className="font-mono font-bold">{coupon.code}</TableCell>
              <TableCell>{coupon.description}</TableCell>
              <TableCell>
                {coupon.discountType === 'percentage' ? 'Pourcentage' : 'Montant fixe'}
              </TableCell>
              <TableCell>
                {coupon.discountType === 'percentage'
                  ? `${coupon.discountValue}%`
                  : `${coupon.discountValue} XOF`}
              </TableCell>
              <TableCell>
                {coupon.usageCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : ''}
              </TableCell>
              <TableCell>
                <div className="text-xs">
                  Du {new Date(coupon.validFrom).toLocaleDateString('fr-FR')}
                  {coupon.validUntil && (
                    <> au {new Date(coupon.validUntil).toLocaleDateString('fr-FR')}</>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={coupon.isActive ? 'success' : 'default'}>
                  {coupon.isActive ? 'Actif' : 'Inactif'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(coupon)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(coupon._id)}
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

      {/* Coupon Form Modal */}
      {showModal && (
        <CouponFormModal
          coupon={editingCoupon}
          onClose={handleCloseModal}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] });
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
        message="Êtes-vous sûr de vouloir supprimer ce coupon ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
