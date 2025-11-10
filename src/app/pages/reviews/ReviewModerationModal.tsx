import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/forms/Textarea";
import { CloseCircle, Star1 } from "iconsax-react";

interface ReviewModerationModalProps {
  review: any;
  action: 'approve' | 'reject';
  onClose: () => void;
  onSubmit: (action: 'approve' | 'reject', note?: string) => Promise<void>;
}

export function ReviewModerationModal({ review, action, onClose, onSubmit }: ReviewModerationModalProps) {
  const [moderatorNote, setModeratorNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(action, moderatorNote || undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star1
            key={star}
            size={20}
            className={star <= rating ? "text-yellow-500" : "text-gray-300"}
            variant={star <= rating ? "Bold" : "Outline"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ padding: '16px' }}>
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className="text-xl font-semibold">
            {action === 'approve' ? 'Approuver l\'avis' : 'Rejeter l\'avis'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <CloseCircle size={24} />
          </button>
        </div>

        {/* Review Details */}
        <div style={{ padding: '24px' }}>
          <div className="space-y-4">
            {/* User Info */}
            <div>
              <p className="text-sm text-gray-500">Utilisateur</p>
              <p className="font-medium">{review.userId?.name}</p>
              <p className="text-sm text-gray-600">{review.userId?.email}</p>
            </div>

            {/* Product/Routine Info */}
            <div>
              <p className="text-sm text-gray-500">
                {review.type === 'product' ? 'Produit' : 'Routine'}
              </p>
              <p className="font-medium">
                {review.productId?.name || review.routineId?.name}
              </p>
            </div>

            {/* Rating */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Note</p>
              {renderStars(review.rating)}
            </div>

            {/* Title & Comment */}
            <div>
              {review.title && (
                <>
                  <p className="text-sm text-gray-500">Titre</p>
                  <p className="font-medium mb-2">{review.title}</p>
                </>
              )}
              <p className="text-sm text-gray-500">Commentaire</p>
              <p className="text-gray-700">{review.comment}</p>
            </div>

            {/* Images */}
            {review.images && review.images.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Images</p>
                <div className="flex gap-2 flex-wrap">
                  {review.images.map((img: string, idx: number) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Review ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Moderation Form */}
          <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
            <Textarea
              label="Note du modérateur (optionnelle)"
              name="moderatorNote"
              value={moderatorNote}
              onChange={(e) => setModeratorNote(e.target.value)}
              rows={3}
              placeholder={
                action === 'approve'
                  ? "Ajoutez une note interne pour approuver cet avis..."
                  : "Expliquez pourquoi cet avis est rejeté..."
              }
            />

            {/* Actions */}
            <div className="flex justify-end border-t border-gray-100" style={{ gap: '12px', paddingTop: '16px', marginTop: '16px' }}>
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant={action === 'approve' ? 'primary' : 'outline'}
                className={action === 'reject' ? 'bg-orange-600 text-white hover:bg-orange-700' : ''}
              >
                {isSubmitting
                  ? 'Traitement...'
                  : action === 'approve'
                  ? 'Approuver'
                  : 'Rejeter'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
