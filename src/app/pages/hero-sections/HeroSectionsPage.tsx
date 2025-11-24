import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { heroSectionAPI } from "@/app/api/heroSections";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { Add, Edit, Trash, Eye } from "iconsax-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { HeroSectionFormModal } from "./HeroSectionFormModal";

export function HeroSectionsPage() {
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingSectionId, setDeletingSectionId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: sections, isLoading } = useQuery({
    queryKey: ['heroSections'],
    queryFn: () => heroSectionAPI.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => heroSectionAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroSections'] });
      setShowDeleteModal(false);
      setDeletingSectionId(null);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => heroSectionAPI.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroSections'] });
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hero Sections</h1>
          <p className="text-gray-600 mt-1">Gérez les bannières hero de votre site</p>
        </div>
        <Button onClick={() => setShowFormModal(true)}>
          <Add size={20} />
          Nouvelle Hero Section
        </Button>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Ordre</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections && sections.length > 0 ? (
                sections.map((section) => (
                  <TableRow key={section._id}>
                    <TableCell>
                      <img
                        src={section.image}
                        alt={section.title}
                        className="w-20 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{section.title}</TableCell>
                    <TableCell>
                      <Badge variant="default">
                        {section.textPosition === 'left' ? 'Gauche' :
                         section.textPosition === 'right' ? 'Droite' : 'Centre'}
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
                    <TableCell className="text-sm">
                      {section.startDate || section.endDate ? (
                        <div>
                          <div>Du: {formatDate(section.startDate)}</div>
                          <div>Au: {formatDate(section.endDate)}</div>
                        </div>
                      ) : (
                        'Permanent'
                      )}
                    </TableCell>
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
                  <td colSpan={8} className="text-center text-gray-500">
                    Aucune hero section trouvée
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {showFormModal && (
        <HeroSectionFormModal
          section={editingSection}
          onClose={handleCloseModal}
        />
      )}

      {showDeleteModal && (
        <ConfirmModal
          title="Supprimer la hero section"
          message="Êtes-vous sûr de vouloir supprimer cette hero section ? Cette action est irréversible."
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
