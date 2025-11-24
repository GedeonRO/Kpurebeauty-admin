import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { heroSectionAPI } from "@/app/api/heroSections";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { Add, Edit, Trash } from "iconsax-react";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/Table";
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

  if (isLoading) {
    return <TableSkeleton rows={10} columns={8} />;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-base">Hero Sections</h1>
        <Button
          onClick={() => setShowFormModal(true)}
          className="bg-[#14A800] text-white px-4 py-2 flex items-center gap-2"
        >
          <Add size={20} />
          Nouvelle Hero Section
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Image</TableHeader>
              <TableHeader>Titre</TableHeader>
              <TableHeader>Position</TableHeader>
              <TableHeader>Localisation</TableHeader>
              <TableHeader>Période</TableHeader>
              <TableHeader>Ordre</TableHeader>
              <TableHeader>Statut</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
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
                <TableCell className="text-center text-gray-500" style={{ gridColumn: 'span 8' }}>
                  Aucune hero section trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showFormModal && (
        <HeroSectionFormModal
          section={editingSection}
          onClose={handleCloseModal}
        />
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Supprimer la hero section"
        message="Êtes-vous sûr de vouloir supprimer cette hero section ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
