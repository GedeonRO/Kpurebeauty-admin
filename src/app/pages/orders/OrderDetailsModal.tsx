import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDateTime } from "@/lib/utils/formatters";
import { CloseCircle } from "iconsax-react";
import { Select } from "@/components/forms/Select";

interface OrderDetailsModalProps {
  order: any;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: string) => void;
}

const statusOptions = [
  { value: 'pending', label: 'En attente' },
  { value: 'processing', label: 'En traitement' },
  { value: 'shipped', label: 'Expédié' },
  { value: 'delivered', label: 'Livré' },
  { value: 'cancelled', label: 'Annulé' },
  { value: 'refunded', label: 'Remboursé' },
];

export function OrderDetailsModal({ order, onClose, onUpdateStatus }: OrderDetailsModalProps) {
  const [newStatus, setNewStatus] = useState(order.status);

  const handleUpdateStatus = () => {
    if (newStatus !== order.status) {
      onUpdateStatus(order._id, newStatus);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Détails de la commande #{order.orderNumber}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <CloseCircle size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Informations de la commande</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Date:</span> {formatDateTime(order.createdAt)}</p>
                <p><span className="text-gray-600">Client:</span> {order.userId?.name}</p>
                <p><span className="text-gray-600">Email:</span> {order.userId?.email}</p>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Statut:</span>
                  <Badge variant={order.status === 'delivered' ? 'success' : 'warning'}>
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Paiement:</span>
                  <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Adresse de livraison</h3>
              <div className="text-sm text-gray-700">
                <p>{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.address}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                <p>{order.shippingAddress?.country}</p>
                <p className="mt-2">Tél: {order.shippingAddress?.phoneNumber}</p>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold mb-3">Produits</h3>
            <div className="border border-gray-200 rounded">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3">Produit</th>
                    <th className="text-center p-3">Quantité</th>
                    <th className="text-right p-3">Prix unitaire</th>
                    <th className="text-right p-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item: any, index: number) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.productId?.mainImage || '/placeholder.jpg'}
                            alt={item.productId?.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <span>{item.productId?.name}</span>
                        </div>
                      </td>
                      <td className="text-center p-3">{item.quantity}</td>
                      <td className="text-right p-3">{formatCurrency(item.price)}</td>
                      <td className="text-right p-3">{formatCurrency(item.quantity * item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4">
            <div className="max-w-xs ml-auto space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Livraison:</span>
                <span>{formatCurrency(order.shippingCost || 0)}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">TVA:</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Réduction:</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                <span>Total:</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold mb-3">Modifier le statut</h3>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Select
                  label="Nouveau statut"
                  options={statusOptions}
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                />
              </div>
              <Button
                onClick={handleUpdateStatus}
                disabled={newStatus === order.status}
                className="bg-[#14A800] text-white px-6 py-2"
              >
                Mettre à jour
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <Button onClick={onClose} className="px-6 py-2 border border-gray-300">
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
}
