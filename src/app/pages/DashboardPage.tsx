import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analytics";
import { StatCard } from "@/components/ui/Stat Card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDateTime } from "@/lib/utils/formatters";
import { ShoppingCart, User, DollarCircle, Box } from "iconsax-react";
import { useState } from "react";
import { Select } from "@/components/forms/Select";

export function DashboardPage() {
  const [period, setPeriod] = useState<"day" | "week" | "month">("month");

  const { data: overview, isLoading } = useQuery({
    queryKey: ["analytics", "overview", period],
    queryFn: () => analyticsApi.getOverview(period),
  });

  const { data: recentOrders } = useQuery({
    queryKey: ["analytics", "recent-orders"],
    queryFn: () => analyticsApi.getRecentOrders(5),
  });

  const { data: lowStockProducts } = useQuery({
    queryKey: ["analytics", "low-stock"],
    queryFn: () => analyticsApi.getLowStockProducts(),
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: "warning",
      processing: "info",
      shipped: "primary",
      delivered: "success",
      cancelled: "danger",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-base">Vue d'ensemble</h1>
        <div className="">
          <Select
            options={[
              { value: "day", label: "Aujourd'hui" },
              { value: "week", label: "7 derniers jours" },
              { value: "month", label: "30 derniers jours" },
            ]}
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="w-48 "
            style={{ padding: 4 }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Revenus"
          value={formatCurrency(overview?.revenue.total || 0)}
          icon={<DollarCircle />}
          trend={{
            value: overview?.revenue.growth || 0,
            isPositive: (overview?.revenue.growth || 0) >= 0,
          }}
        />
        <StatCard
          title="Commandes"
          value={overview?.orders.total || 0}
          icon={<ShoppingCart />}
          trend={{
            value: overview?.orders.growth || 0,
            isPositive: (overview?.orders.growth || 0) >= 0,
          }}
        />
        <StatCard
          title="Clients"
          value={overview?.users.total || 0}
          icon={<User />}
        />
        <StatCard
          title="Valeur Moyenne"
          value={formatCurrency(overview?.revenue.averageOrderValue || 0)}
          icon={<Box />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Commandes Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders?.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {order.orderNumber}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(order.total)}
                    </p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle>
              Stock Faible
              <span className="ml-2 text-sm font-normal text-red-600">
                ({lowStockProducts?.length || 0} produits)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts?.slice(0, 5).map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        SKU: {product.sku}
                      </p>
                    </div>
                  </div>
                  <Badge variant={product.stock === 0 ? "danger" : "warning"}>
                    {product.stock === 0
                      ? "Rupture"
                      : `${product.stock} restant`}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
