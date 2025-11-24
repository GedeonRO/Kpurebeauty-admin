import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { heroSectionAPI, CreateHeroSectionDTO } from "@/app/api/heroSections";
import { uploadAPI } from "@/app/api/upload";
import { Button } from "@/components/ui/Button";
import { CloseCircle, Gallery } from "iconsax-react";

interface Props {
  section?: any;
  onClose: () => void;
}

export function HeroSectionFormModal({ section, onClose }: Props) {
  const queryClient = useQueryClient();
  const isEditing = !!section;

  const [formData, setFormData] = useState<CreateHeroSectionDTO>({
    title: section?.title || '',
    subtitle: section?.subtitle || '',
    description: section?.description || '',
    buttonText: section?.buttonText || '',
    buttonLink: section?.buttonLink || '',
    image: section?.image || '',
    mobileImage: section?.mobileImage || '',
    backgroundColor: section?.backgroundColor || '#ffffff',
    textColor: section?.textColor || '#000000',
    textPosition: section?.textPosition || 'center',
    overlay: section?.overlay ?? false,
    overlayOpacity: section?.overlayOpacity || 40,
    order: section?.order || 0,
    isActive: section?.isActive ?? true,
    displayLocation: section?.displayLocation || ['home'],
    startDate: section?.startDate ? section.startDate.split('T')[0] : '',
    endDate: section?.endDate ? section.endDate.split('T')[0] : '',
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: CreateHeroSectionDTO) => {
      if (isEditing) {
        return heroSectionAPI.update(section._id, data);
      }
      return heroSectionAPI.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroSections'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert dates to ISO format if provided
    const submitData: any = { ...formData };
    if (submitData.startDate) {
      submitData.startDate = new Date(submitData.startDate).toISOString();
    } else {
      delete submitData.startDate;
    }
    if (submitData.endDate) {
      submitData.endDate = new Date(submitData.endDate).toISOString();
    } else {
      delete submitData.endDate;
    }

    mutation.mutate(submitData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationToggle = (location: string) => {
    setFormData((prev) => {
      const current = prev.displayLocation;
      if (current.includes(location)) {
        return { ...prev, displayLocation: current.filter((l) => l !== location) };
      }
      return { ...prev, displayLocation: [...current, location] };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'mobileImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await uploadAPI.uploadImage(formData);
      handleChange(field, response.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">
            {isEditing ? 'Modifier la hero section' : 'Nouvelle hero section'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <CloseCircle size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-2 gap-4">
            {/* Title */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Titre *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Subtitle */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Sous-titre</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />
            </div>

            {/* Button Text */}
            <div>
              <label className="block text-sm font-medium mb-1">Texte du bouton</label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Button Link */}
            <div>
              <label className="block text-sm font-medium mb-1">Lien du bouton</label>
              <input
                type="text"
                value={formData.buttonLink}
                onChange={(e) => handleChange('buttonLink', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Main Image */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Image principale *</label>
              <div className="flex items-center gap-4">
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="w-32 h-20 object-cover rounded" />
                )}
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">
                  <Gallery size={20} />
                  {uploadingImage ? 'Upload en cours...' : 'Choisir une image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'image')}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>
              {!formData.image && (
                <input
                  type="url"
                  placeholder="Ou entrez une URL d'image"
                  value={formData.image}
                  onChange={(e) => handleChange('image', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg mt-2"
                />
              )}
            </div>

            {/* Mobile Image */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Image mobile (optionnel)</label>
              <div className="flex items-center gap-4">
                {formData.mobileImage && (
                  <img src={formData.mobileImage} alt="Preview" className="w-32 h-20 object-cover rounded" />
                )}
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-300">
                  <Gallery size={20} />
                  Choisir une image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'mobileImage')}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-sm font-medium mb-1">Couleur de fond</label>
              <input
                type="color"
                value={formData.backgroundColor}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                className="w-full h-10 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Couleur du texte</label>
              <input
                type="color"
                value={formData.textColor}
                onChange={(e) => handleChange('textColor', e.target.value)}
                className="w-full h-10 border rounded-lg"
              />
            </div>

            {/* Text Position */}
            <div>
              <label className="block text-sm font-medium mb-1">Position du texte</label>
              <select
                value={formData.textPosition}
                onChange={(e) => handleChange('textPosition', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="left">Gauche</option>
                <option value="center">Centre</option>
                <option value="right">Droite</option>
              </select>
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium mb-1">Ordre d'affichage</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => handleChange('order', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Overlay */}
            <div className="col-span-2">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={formData.overlay}
                  onChange={(e) => handleChange('overlay', e.target.checked)}
                  className="mr-2"
                />
                <label className="text-sm font-medium">Overlay sombre sur l'image</label>
              </div>
              {formData.overlay && (
                <div>
                  <label className="block text-sm font-medium mb-1">Opacité de l'overlay (%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.overlayOpacity}
                    onChange={(e) => handleChange('overlayOpacity', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{formData.overlayOpacity}%</span>
                </div>
              )}
            </div>

            {/* Active */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm font-medium">Hero section active</label>
            </div>

            {/* Display Locations */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Emplacements d'affichage *</label>
              <div className="flex flex-wrap gap-2">
                {['home', 'products', 'category', 'all'].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => handleLocationToggle(loc)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      formData.displayLocation.includes(loc)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium mb-1">Date de début (optionnel)</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date de fin (optionnel)</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </form>

        <div className="flex justify-end gap-3 p-6 border-t">
          <Button variant="outline" onClick={onClose} type="button">
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending || uploadingImage}>
            {mutation.isPending ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
