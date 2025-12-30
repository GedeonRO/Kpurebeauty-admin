import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "@/app/api/reviews";
import { Badge } from "@/components/ui/Badge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Card, CardContent } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/Stat Card";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { formatDateTime } from "@/lib/utils/formatters";
import { SearchNormal, Star1, TickCircle, CloseCircle, Trash, MessageText } from "iconsax-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/forms/Select";
import { Input } from "@/components/forms/Input";
import { ReviewModerationModal } from "./ReviewModerationModal";

const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente' },
  { value: 'approved', label: 'Approuvés' },
  { value: 'rejected', label: 'Rejetés' },
];

const ratingOptions = [
  { value: '', label: 'Toutes les notes' },
  { value: '5', label: '5 étoiles' },
  { value: '4', label: '4 étoiles' },
  { value: '3', label: '3 étoiles' },
  { value: '2', label: '2 étoiles' },
  { value: '1', label: '1 étoile' },
];

export function ReviewsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [rating, setRating] = useState('');
  const [search, setSearch] = useState('');
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['reviews', 'admin', page, status, rating, search],
    queryFn: () => reviewsApi.getAll({
      page,
      limit: 20,
      status,
      rating: rating ? Number(rating) : undefined,
      search
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reviewsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setShowDeleteModal(false);
      setDeletingReviewId(null);
    },
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => reviewsApi.approve(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => reviewsApi.reject(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });

  const handleApprove = async (review: any) => {
    setSelectedReview({ ...review, action: 'approve' });
  };

  const handleReject = async (review: any) => {
    setSelectedReview({ ...review, action: 'reject' });
  };

  const handleDelete = (id: string) => {
    setDeletingReviewId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingReviewId) {
      await deleteMutation.mutateAsync(deletingReviewId);
    }
  };

  const handleModerationSubmit = async (action: 'approve' | 'reject', note?: string) => {
    if (action === 'approve') {
      await approveMutation.mutateAsync({ id: selectedReview._id, note });
    } else {
      await rejectMutation.mutateAsync({ id: selectedReview._id, note });
    }
    setSelectedReview(null);
  };

  // Calculate statistics from current data
  const totalReviews = data?.pagination?.total || 0;
  const pendingReviews = data?.reviews?.filter(r => !r.isApproved).length || 0;
  const approvedReviews = data?.reviews?.filter(r => r.isApproved).length || 0;
  const avgRating = data?.reviews && data?.reviews?.length > 0
    ? (data.reviews.reduce((sum, r) => sum + r.rating, 0) / data.reviews.length).toFixed(1)
    : '0';

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star1
            key={star}
            size={16}
            className={star <= rating ? "text-yellow-500" : "text-gray-300"}
            variant={star <= rating ? "Bold" : "Outline"}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return <TableSkeleton rows={20} columns={8} />;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-base">Modération des Avis</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Avis"
          value={totalReviews}
          icon={<MessageText />}
        />
        <StatCard
          title="En attente"
          value={pendingReviews}
          icon={<MessageText />}
        />
        <StatCard
          title="Approuvés"
          value={approvedReviews}
          icon={<TickCircle />}
        />
        <StatCard title="Note Moyenne" value={avgRating} icon={<Star1 />} />
      </div>

      {/* Filters */}
      <Card>
        <CardContent style={{ padding: "16px" }}>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Input
                placeholder="Rechercher par produit ou utilisateur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64"
                style={{ paddingLeft: 36 }}
              />
              <SearchNormal
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
            <Select
              options={statusOptions}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-48"
            />
            <Select
              options={ratingOptions}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Utilisateur</TableHeader>
            <TableHeader>Produit/Routine</TableHeader>
            <TableHeader>Note</TableHeader>
            <TableHeader>Commentaire</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Statut</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.reviews?.map((review: any) => (
            <TableRow key={review._id}>
              <TableCell>
                <div>
                  <p className="font-medium text-sm">
                    {review.userId?.name || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {review.userId?.email}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-sm">
                    {review.productId?.name || review.routineId?.name || "N/A"}
                  </p>
                  {review.isVerifiedPurchase && (
                    <Badge variant="success" className="mt-1 text-xs">
                      Achat vérifié
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{renderStars(review.rating)}</TableCell>
              <TableCell>
                <div className="max-w-xs">
                  {review.title && (
                    <p className="font-medium text-sm">{review.title}</p>
                  )}
                  <p className="text-sm text-gray-600 truncate">
                    {review.comment}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={review.type === "product" ? "primary" : "info"}>
                  {review.type === "product" ? "Produit" : "Routine"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={review.isApproved ? "success" : "warning"}>
                  {review.isApproved ? "Approuvé" : "En attente"}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">
                {formatDateTime(review.createdAt)}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {!review.isApproved && (
                    <button
                      onClick={() => handleApprove(review)}
                      className="text-green-600 hover:text-green-800"
                      title="Approuver"
                    >
                      <TickCircle size={18} />
                    </button>
                  )}
                  {!review.isApproved && (
                    <button
                      onClick={() => handleReject(review)}
                      className="text-orange-600 hover:text-orange-800"
                      title="Rejeter"
                    >
                      <CloseCircle size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review._id)}
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

      {/* Review Moderation Modal */}
      {selectedReview && (
        <ReviewModerationModal
          review={selectedReview}
          action={selectedReview.action}
          onClose={() => setSelectedReview(null)}
          onSubmit={handleModerationSubmit}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cet avis ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
