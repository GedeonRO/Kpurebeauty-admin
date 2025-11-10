import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/app/api/orders";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { formatCurrency, formatDateTime } from "@/lib/utils/formatters";
import { SearchNormal, Eye } from "iconsax-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/forms/Select";
import { Input } from "@/components/forms/Input";
import { OrderDetailsModal } from "./OrderDetailsModal";

const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente' },
  { value: 'processing', label: 'En traitement' },
  { value: 'shipped', label: 'Expédié' },
  { value: 'delivered', label: 'Livré' },
  { value: 'cancelled', label: 'Annulé' },
];

export function OrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['orders', 'admin', page, status, search],
    queryFn: () => ordersApi.getAllAdmin({ page, limit: 20, status, search }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, newStatus }: { orderId: string; newStatus: string }) =>
      ordersApi.updateStatus(orderId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const getStatusBadge = (orderStatus: string) => {
    const variants: Record<string, any> = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'danger',
      refunded: 'secondary',
    };
    const labels: Record<string, string> = {
      pending: 'En attente',
      processing: 'En traitement',
      shipped: 'Expédié',
      delivered: 'Livré',
      cancelled: 'Annulé',
      refunded: 'Remboursé',
    };
    return <Badge variant={variants[orderStatus] || 'default'}>{labels[orderStatus] || orderStatus}</Badge>;
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const variants: Record<string, any> = {
      pending: 'warning',
      paid: 'success',
      failed: 'danger',
      refunded: 'secondary',
    };
    const labels: Record<string, string> = {
      pending: 'En attente',
      paid: 'Payé',
      failed: 'Échoué',
      refunded: 'Remboursé',
    };
    return <Badge variant={variants[paymentStatus] || 'default'}>{labels[paymentStatus] || paymentStatus}</Badge>;
  };

  if (isLoading) {
    return <TableSkeleton rows={20} columns={7} />;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-base">Gestion des Commandes</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Input
              placeholder="Rechercher par N° de commande..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-64"
            />
            <SearchNormal className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <Select
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-48"
          />
        </div>
      </div>

      {/* Orders Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>N° Commande</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Client</TableHeader>
            <TableHeader>Montant</TableHeader>
            <TableHeader>Statut</TableHeader>
            <TableHeader>Paiement</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.data?.map((order: any) => (
            <TableRow key={order._id}>
              <TableCell className="font-medium">{order.orderNumber}</TableCell>
              <TableCell>{formatDateTime(order.createdAt)}</TableCell>
              <TableCell>{order.userId?.name || 'N/A'}</TableCell>
              <TableCell>{formatCurrency(order.total)}</TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell>{getPaymentBadge(order.paymentStatus)}</TableCell>
              <TableCell>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Eye size={18} />
                  Voir
                </button>
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={(orderId, newStatus) => {
            updateStatusMutation.mutate({ orderId, newStatus });
          }}
        />
      )}
    </div>
  );
}
