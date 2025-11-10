import { useState, useRef } from 'react';
import { GalleryAdd, Trash } from 'iconsax-react';
import { apiClient } from '@/app/api/client';

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
}

export function ImageUpload({
  label,
  value,
  onChange,
  folder = 'kpure',
  className = ''
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image valide');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Get signature from backend
      const signatureResponse = await apiClient.post('/upload/signature', {
        folder,
        upload_preset: 'kpure_signed'
      });

      console.log('Signature response:', signatureResponse.data);

      if (!signatureResponse.data.success) {
        throw new Error(signatureResponse.data.error || 'Échec de génération de signature');
      }

      const { signature, timestamp, api_key, cloud_name, upload_preset } = signatureResponse.data.data;

      // Validate that we have all required data
      if (!signature || !cloud_name || !api_key) {
        console.error('Missing required data:', { signature: !!signature, cloud_name: !!cloud_name, api_key: !!api_key });
        throw new Error('Configuration Cloudinary incomplète. Vérifiez les variables d\'environnement du backend.');
      }

      // Upload to Cloudinary with signature
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp.toString());
      formData.append('api_key', api_key);
      formData.append('upload_preset', upload_preset);
      formData.append('folder', folder);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        console.error('Cloudinary error:', errorData);
        throw new Error(errorData.error?.message || 'Échec du téléchargement de l\'image');
      }

      const data = await uploadResponse.json();
      onChange(data.secure_url);
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Erreur lors du téléchargement de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
          >
            <Trash size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#14A800] transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#14A800]"></div>
              <p className="text-sm text-gray-600">Téléchargement en cours...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <GalleryAdd size={40} className="text-gray-400" />
              <p className="text-sm text-gray-600">
                Cliquez pour sélectionner une image
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG ou WEBP (max. 5MB)
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
