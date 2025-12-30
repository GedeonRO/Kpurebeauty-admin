import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/app/api/auth";
import { useAuth } from "@/app/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/forms/Input";
import { User } from "iconsax-react";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";

export function ProfilePage() {
  const { user, isLoading } = useAuth();
  

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
  });

  // Initialize profile data when user loads
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const updateProfileMutation = useMutation({
    mutationFn: (data: { name?: string; phone?: string; avatar?: string }) =>
      authApi.updateProfile(data),
    onSuccess: (updatedUser) => {
      // Update localStorage with new user data
      localStorage.setItem('adminUser', JSON.stringify(updatedUser));
      setProfileSuccess('Profil mis à jour avec succès!');
      setTimeout(() => setProfileSuccess(''), 3000);
      // Force refresh of auth state
      window.location.reload();
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      setPasswordSuccess('Mot de passe changé avec succès!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordError('');
      setTimeout(() => setPasswordSuccess(''), 3000);
    },
    onError: (error: any) => {
      setPasswordError(error.response?.data?.error || 'Erreur lors du changement de mot de passe');
    },
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess('');

    await updateProfileMutation.mutateAsync({
      name: profileData.name,
      phone: profileData.phone || undefined,
      avatar: profileData.avatar || undefined,
    });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    await changePasswordMutation.mutateAsync({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-base">Mon Profil</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile Picture */}
        <Card>
          <CardContent style={{ padding: '24px' }}>
            <div className="flex flex-col items-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <User size={48} className="text-gray-400" />
                </div>
              )}
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <div className="mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Administrateur
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information & Password Change */}
        <div className="lg:col-span-2 space-y-5">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations Personnelles</CardTitle>
            </CardHeader>
            <CardContent>
              {profileSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
                  {profileSuccess}
                </div>
              )}
              <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Input
                  label="Nom complet"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  required
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  disabled
                  className="bg-gray-50"
                />

                <Input
                  label="Téléphone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  placeholder="Optionnel"
                />

                <Input
                  label="Avatar (URL)"
                  name="avatar"
                  value={profileData.avatar}
                  onChange={handleProfileChange}
                  placeholder="https://exemple.com/avatar.jpg"
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    variant="primary"
                  >
                    {updateProfileMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Changer le mot de passe</CardTitle>
            </CardHeader>
            <CardContent>
              {passwordError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
                  {passwordSuccess}
                </div>
              )}
              <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Input
                  label="Mot de passe actuel"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />

                <Input
                  label="Nouveau mot de passe"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Au moins 6 caractères"
                />

                <Input
                  label="Confirmer le nouveau mot de passe"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                    variant="primary"
                  >
                    {changePasswordMutation.isPending ? 'Changement...' : 'Changer le mot de passe'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
