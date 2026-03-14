'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTheme } from 'next-themes';
import {
  Settings as SettingsIcon,
  Building2,
  Palette,
  Shield,
  AlertTriangle,
  Sun,
  Moon,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

interface GeneralSettingsForm {
  companyName: string;
  email: string;
  phone: string;
  address: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-[#1F4B8F] px-4 py-3 text-sm text-white shadow-lg animate-in slide-in-from-bottom-4">
      <Check className="h-4 w-4" />
      {message}
      <button onClick={onClose} className="ml-2 text-white/70 hover:text-white">
        &times;
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [toast, setToast] = useState<string | null>(null);

  // General Settings form
  const {
    register: registerGeneral,
    handleSubmit: handleGeneralSubmit,
    formState: { errors: generalErrors },
  } = useForm<GeneralSettingsForm>({
    defaultValues: {
      companyName: 'Fulk Technology',
      email: 'info@fulk.eg',
      phone: '+20 100 123 4567',
      address: 'Cairo, Egypt',
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordForm>();

  const newPasswordValue = watchPassword('newPassword');

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }

  function onGeneralSave(data: GeneralSettingsForm) {
    // In a real app, this would save to Firebase
    console.log('General settings:', data);
    showToast('General settings saved successfully');
  }

  function onPasswordSave(data: PasswordForm) {
    // In a real app, this would update the password
    console.log('Password change:', data);
    resetPassword();
    showToast('Password changed successfully');
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-[#1F4B8F]">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your application settings and preferences
        </p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">General Settings</CardTitle>
              <CardDescription>Basic company information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleGeneralSubmit(onGeneralSave)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <Input
                  {...registerGeneral('companyName', {
                    required: 'Company name is required',
                  })}
                  placeholder="Company name"
                />
                {generalErrors.companyName && (
                  <p className="mt-1 text-xs text-red-500">
                    {generalErrors.companyName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  {...registerGeneral('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address',
                    },
                  })}
                  placeholder="info@company.com"
                  type="email"
                />
                {generalErrors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {generalErrors.email.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <Input
                  {...registerGeneral('phone')}
                  placeholder="+20 100 123 4567"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Address
                </label>
                <Input
                  {...registerGeneral('address')}
                  placeholder="Company address"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <Palette className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Appearance</CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Dark Mode</p>
              <p className="text-sm text-gray-500">
                Toggle between light and dark themes
              </p>
            </div>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors ${
                theme === 'dark' ? 'bg-[#1F4B8F]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-flex h-8 w-8 transform items-center justify-center rounded-full bg-white shadow-sm transition-transform ${
                  theme === 'dark' ? 'translate-x-11' : 'translate-x-1'
                }`}
              >
                {theme === 'dark' ? (
                  <Moon className="h-4 w-4 text-[#1F4B8F]" />
                ) : (
                  <Sun className="h-4 w-4 text-yellow-500" />
                )}
              </span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Security</CardTitle>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handlePasswordSubmit(onPasswordSave)}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <Input
                {...registerPassword('currentPassword', {
                  required: 'Current password is required',
                })}
                type="password"
                placeholder="Enter current password"
              />
              {passwordErrors.currentPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {passwordErrors.currentPassword.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <Input
                  {...registerPassword('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  })}
                  type="password"
                  placeholder="Enter new password"
                />
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-xs text-red-500">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <Input
                  {...registerPassword('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === newPasswordValue || 'Passwords do not match',
                  })}
                  type="password"
                  placeholder="Confirm new password"
                />
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Change Password</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-red-200 bg-red-50/50 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">
                  Delete All Data
                </p>
                <p className="text-sm text-red-600">
                  Once you delete all data, there is no going back. Please be
                  certain.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() =>
                  showToast('This is a demo action. No data was deleted.')
                }
              >
                Delete All Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toast notification */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
