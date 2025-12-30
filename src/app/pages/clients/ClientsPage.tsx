import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/app/api/users";

import { Badge } from "@/components/ui/Badge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Card, CardContent } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/Stat Card";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { formatDateTime } from "@/lib/utils/formatters";
import { SearchNormal,  Trash, User, UserTick, UserRemove } from "iconsax-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/forms/Select";
import { Input } from "@/components/forms/Input";

const roleOptions = [
  { value: '', label: 'Tous les rôles' },
  { value: 'customer', label: 'Client' },
  { value: 'admin', label: 'Admin' },
];

const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'true', label: 'Actifs' },
  { value: 'false', label: 'Inactifs' },
];

export function ClientsPage() {
  const [page, setPage] = useState(1);
  const [role, setRole] = useState('');
  const [isActive, setIsActive] = useState('');
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, role, isActive, search],
    queryFn: () => usersApi.getAll({
      page,
      limit: 20,
      role: role as any,
      isActive: isActive === '' ? undefined : isActive === 'true',
      search
    }),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => usersApi.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowDeleteModal(false);
      setDeletingUserId(null);
    },
  });

  const handleToggleStatus = async (id: string) => {
    await toggleStatusMutation.mutateAsync(id);
  };

  const handleDelete = (id: string) => {
    setDeletingUserId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingUserId) {
      await deleteMutation.mutateAsync(deletingUserId);
    }
  };

  // Calculate statistics from current data
  const totalClients = data?.pagination?.total || 0;
  const activeClients = data?.users?.filter(u => u.isActive).length || 0;
  const customers = data?.users?.filter(u => u.role === 'customer').length || 0;
  const admins = data?.users?.filter(u => u.role === 'admin').length || 0;

  if (isLoading) {
    return <TableSkeleton rows={20} columns={7} />;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-base">Gestion des Clients</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Clients" value={totalClients} icon={<User />} />
        <StatCard
          title="Clients Actifs"
          value={activeClients}
          icon={<UserTick />}
        />
        <StatCard title="Clients" value={customers} icon={<User />} />
        <StatCard
          title="Administrateurs"
          value={admins}
          icon={<UserRemove />}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent style={{ padding: "16px" }}>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Input
                placeholder="Rechercher par nom ou email..."
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
            <Select
              options={roleOptions}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-48"
            />
            <Select
              options={statusOptions}
              value={isActive}
              onChange={(e) => setIsActive(e.target.value)}
              className="w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Avatar</TableHeader>
            <TableHeader>Nom</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Téléphone</TableHeader>
            <TableHeader>Rôle</TableHeader>
            <TableHeader>Statut</TableHeader>
            <TableHeader>Date d'inscription</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.users?.map((user: any) => (
            <TableRow key={user._id}>
              <TableCell>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={20} className="text-gray-500" />
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone || "-"}</TableCell>
              <TableCell>
                <Badge
                  variant={user.role === "admin" ? "primary" : "default"}
                >
                  {user.role === "admin" ? "Admin" : "Client"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.isActive ? "success" : "danger"}>
                  {user.isActive ? "Actif" : "Inactif"}
                </Badge>
              </TableCell>
              <TableCell>{formatDateTime(user.createdAt)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(user._id)}
                    className={
                      user.isActive
                        ? "text-orange-600 hover:text-orange-800"
                        : "text-green-600 hover:text-green-800"
                    }
                    title={user.isActive ? "Désactiver" : "Activer"}
                  >
                    {user.isActive ? (
                      <UserRemove size={18} />
                    ) : (
                      <UserTick size={18} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible et supprimera toutes les données associées (commandes, avis, etc.)."
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
