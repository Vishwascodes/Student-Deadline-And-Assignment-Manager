import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiCamera } from 'react-icons/fi';
import DashboardLayout from '../layouts/DashboardLayout';
import useAuth from '../hooks/useAuth';
import authService from '../services/authService';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const infoForm = useForm({ defaultValues: { name: user?.name, email: user?.email } });
  const passwordForm = useForm();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleInfoSubmit = async (data) => {
    setSavingInfo(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      if (selectedFile) formData.append('profilePicture', selectedFile);

      const res = await authService.updateProfile(formData);
      updateUser(res.data);
      toast.success('Profile updated successfully');
      setSelectedFile(null);
      setPreview(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingInfo(false);
    }
  };

  const handlePasswordSubmit = async (data) => {
    setSavingPassword(true);
    try {
      const formData = new FormData();
      formData.append('currentPassword', data.currentPassword);
      formData.append('newPassword', data.newPassword);

      await authService.updateProfile(formData);
      toast.success('Password changed successfully');
      passwordForm.reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  const avatarSrc = preview || (user?.profilePicture ? `${SERVER_URL}${user.profilePicture}` : null);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl animate-fadeIn">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your account information and security</p>
        </div>

        {/* Profile Info */}
        <div className="card mb-6 p-6">
          <h2 className="mb-5 text-base font-semibold text-gray-800">Personal Information</h2>

          <div className="mb-6 flex items-center gap-5">
            <div className="group relative">
              {avatarSrc ? (
                <img src={avatarSrc} alt="Profile" className="h-20 w-20 rounded-full object-cover ring-4 ring-primary-50" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-700 ring-4 ring-primary-50">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white shadow-md transition-transform hover:scale-105"
              >
                <FiCamera size={14} />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-400">Click the camera icon to change your photo</p>
            </div>
          </div>

          <form onSubmit={infoForm.handleSubmit(handleInfoSubmit)} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <FiUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="input-field pl-10"
                  {...infoForm.register('name', { required: 'Name is required' })}
                />
              </div>
              {infoForm.formState.errors.name && (
                <p className="error-text">{infoForm.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="label">Email</label>
              <div className="relative">
                <FiMail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  className="input-field pl-10"
                  {...infoForm.register('email', { required: 'Email is required' })}
                />
              </div>
              {infoForm.formState.errors.email && (
                <p className="error-text">{infoForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={savingInfo} className="btn-primary">
                {savingInfo ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="card p-6">
          <h2 className="mb-5 text-base font-semibold text-gray-800">Change Password</h2>
          <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
            <div>
              <label className="label">Current Password</label>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  className="input-field pl-10"
                  {...passwordForm.register('currentPassword', { required: 'Current password is required' })}
                />
              </div>
              {passwordForm.formState.errors.currentPassword && (
                <p className="error-text">{passwordForm.formState.errors.currentPassword.message}</p>
              )}
            </div>

            <div>
              <label className="label">New Password</label>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  className="input-field pl-10"
                  {...passwordForm.register('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                />
              </div>
              {passwordForm.formState.errors.newPassword && (
                <p className="error-text">{passwordForm.formState.errors.newPassword.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={savingPassword} className="btn-primary">
                {savingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
