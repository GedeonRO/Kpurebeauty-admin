import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productSectionAPI } from "@/app/api/productSections";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { Add, Edit, Trash, Eye } from "iconsax-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { ProductSectionFormModal } from "./ProductSectionFormModal";

export function ProductSectionsPage() {
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingSectionId, setDeletingSectionId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: sections, isLoading } = useQuery({
    queryKey: ['productSections'],
    queryFn: () => productSectionAPI.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productSectionAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productSections'] });
      setShowDeleteModal(false);
      setDeletingSectionId(null);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => productSectionAPI.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productSections'] });
    },
  });

  const handleEdit = (section: any) => {
    setEditingSection(section);
    setShowFormModal(true);
  };

  const handleDelete = (id: string) => {
    setDeletingSectionId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingSectionId) {
      await deleteMutation.mutateAsync(deletingSectionId);
    }
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
    setEditingSection(null);
  };

  const handleToggleStatus = (id: string) => {
    toggleStatusMutation.mutate(id);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sections de Produits</h1>
          <p className="text-gray-600 mt-1">Gérez les sections d'affichage de produits sur votre site</p>
        </div>
        <Button onClick={() => setShowFormModal(true)}>
          <Add size={20} />
          Nouvelle Section
        </Button>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Limite</TableHead>
                <TableHead>Ordre</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections && sections.length > 0 ? (
                sections.map((section) => (
                  <TableRow key={section._id}>
                    <TableCell className="font-medium">{section.title}</TableCell>
                    <TableCell>
                      <Badge variant={section.type === 'automatic' ? 'info' : 'default'}>
                        {section.type === 'automatic' ? 'Automatique' : 'Manuel'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {section.displayLocation.map((loc, idx) => (
                          <Badge key={idx} variant="default" className="text-xs">
                            {loc}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{section.limit} produits</TableCell>
                    <TableCell>{section.order}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleToggleStatus(section._id)}
                        disabled={toggleStatusMutation.isPending}
                      >
                        <Badge variant={section.isActive ? 'success' : 'default'}>
                          {section.isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(section)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(section._id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <td colSpan={7} className="text-center text-gray-500 px-6 py-4">
                    Aucune section de produits trouvée
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {showFormModal && (
        <ProductSectionFormModal
          section={editingSection}
          onClose={handleCloseModal}
        />
      )}

      {showDeleteModal && (
        <ConfirmModal
          title="Supprimer la section"
          message="Êtes-vous sûr de vouloir supprimer cette section ? Cette action est irréversible."
          confirmText="Supprimer"
          cancelText="Annuler"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
