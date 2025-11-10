import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { routinesApi } from "@/app/api/routines";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { Add, Edit, Trash } from "iconsax-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { RoutineFormModal } from "./RoutineFormModal";
import type { Routine } from "@/types";

export function RoutinesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingRoutineId, setDeletingRoutineId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: routines, isLoading } = useQuery({
    queryKey: ['routines'],
    queryFn: () => routinesApi.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => routinesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      setShowDeleteModal(false);
      setDeletingRoutineId(null);
    },
  });

  const handleEdit = (routine: Routine) => {
    setEditingRoutine(routine);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setDeletingRoutineId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingRoutineId) {
      await deleteMutation.mutateAsync(deletingRoutineId);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRoutine(null);
  };

  if (isLoading) {
    return <TableSkeleton rows={10} columns={8} />;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-base">Gestion des Routines</h1>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-[#14A800] text-white px-4 py-2 flex items-center gap-2"
        >
          <Add size={20} />
          Ajouter une routine
        </Button>
      </div>

      {/* Routines Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Image</TableHeader>
            <TableHeader>Nom</TableHeader>
            <TableHeader>Slug</TableHeader>
            <TableHeader>Objectif</TableHeader>
            <TableHeader>Produits</TableHeader>
            <TableHeader>Prix</TableHeader>
            <TableHeader>Statut</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {routines?.map((routine: Routine) => (
            <TableRow key={routine._id}>
              <TableCell>
                {routine.image ? (
                  <img
                    src={routine.image}
                    alt={routine.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                    Aucune
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{routine.name}</TableCell>
              <TableCell className="text-gray-600">{routine.slug}</TableCell>
              <TableCell>
                <span className="text-sm">{routine.goal}</span>
              </TableCell>
              <TableCell>
                <Badge variant="default">{routine.products.length} produit{routine.products.length > 1 ? 's' : ''}</Badge>
              </TableCell>
              <TableCell className="font-medium">{routine.price.toLocaleString()} XOF</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Badge variant={routine.isActive ? 'success' : 'default'}>
                    {routine.isActive ? 'Actif' : 'Inactif'}
                  </Badge>
                  {routine.isFeatured && (
                    <Badge variant="warning">Vedette</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(routine)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(routine._id)}
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

      {/* Routine Form Modal */}
      {showModal && (
        <RoutineFormModal
          routine={editingRoutine}
          onClose={handleCloseModal}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['routines'] });
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
        message="Êtes-vous sûr de vouloir supprimer cette routine ? Cette action est irréversible et supprimera tous les produits associés à cette routine."
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
