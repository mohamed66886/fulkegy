'use client';

import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  uploadImage,
} from '@/services/firebase';
import type { Employee } from '@/types';
import { Plus, Pencil, Trash2, UserCog, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

interface EmployeeFormData {
  name: string;
  nameAr: string;
  position: string;
  positionAr: string;
  email: string;
  phone: string;
  role: 'admin' | 'developer' | 'designer' | 'manager';
}

const roleColors: Record<string, string> = {
  admin: 'bg-red-100 text-red-700 border-red-200',
  developer: 'bg-blue-100 text-blue-700 border-blue-200',
  designer: 'bg-purple-100 text-purple-700 border-purple-200',
  manager: 'bg-green-100 text-green-700 border-green-200',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-[#1F4B8F]',
    'bg-[#2F6EDB]',
    'bg-emerald-600',
    'bg-orange-500',
    'bg-purple-600',
    'bg-pink-600',
    'bg-teal-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
          <div className="h-4 w-1/5 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/5 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/5 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/12 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/12 animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

export default function EmployeesPage() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormData>();

  // Fetch employees
  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees,
  });

  // Add employee mutation
  const addMutation = useMutation({
    mutationFn: async (data: EmployeeFormData) => {
      let avatarUrl = '';
      if (avatarFile) {
        setUploading(true);
        avatarUrl = await uploadImage(avatarFile, 'employees');
        setUploading(false);
      }
      return addEmployee({
        name: data.name,
        nameAr: data.nameAr,
        position: data.position,
        positionAr: data.positionAr,
        email: data.email,
        phone: data.phone,
        role: data.role,
        avatar: avatarUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      closeForm();
    },
  });

  // Update employee mutation
  const updateMutation = useMutation({
    mutationFn: async (data: EmployeeFormData) => {
      if (!editingEmployee) return;
      let avatarUrl = editingEmployee.avatar;
      if (avatarFile) {
        setUploading(true);
        avatarUrl = await uploadImage(avatarFile, 'employees');
        setUploading(false);
      }
      return updateEmployee(editingEmployee.id, {
        name: data.name,
        nameAr: data.nameAr,
        position: data.position,
        positionAr: data.positionAr,
        email: data.email,
        phone: data.phone,
        role: data.role,
        avatar: avatarUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      closeForm();
    },
  });

  // Delete employee mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setDeleteOpen(false);
      setDeletingEmployee(null);
    },
  });

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  }

  function openAddForm() {
    setEditingEmployee(null);
    reset({
      name: '',
      nameAr: '',
      position: '',
      positionAr: '',
      email: '',
      phone: '',
      role: 'developer',
    });
    setAvatarFile(null);
    setAvatarPreview(null);
    setFormOpen(true);
  }

  function openEditForm(employee: Employee) {
    setEditingEmployee(employee);
    reset({
      name: employee.name,
      nameAr: employee.nameAr,
      position: employee.position,
      positionAr: employee.positionAr,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
    });
    setAvatarFile(null);
    setAvatarPreview(employee.avatar || null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingEmployee(null);
    setAvatarFile(null);
    setAvatarPreview(null);
    reset();
  }

  function openDeleteDialog(employee: Employee) {
    setDeletingEmployee(employee);
    setDeleteOpen(true);
  }

  function onSubmit(data: EmployeeFormData) {
    if (editingEmployee) {
      updateMutation.mutate(data);
    } else {
      addMutation.mutate(data);
    }
  }

  const isSaving = addMutation.isPending || updateMutation.isPending || uploading;

  return (
    <div className="space-y-8">
      {/* Page Title and Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1F4B8F]">Employees</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your team members
          </p>
        </div>
        <Button onClick={openAddForm}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* Employees Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <TableSkeleton />
            </div>
          ) : !employees || employees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <UserCog className="mb-3 h-12 w-12" />
              <p className="text-lg font-medium">No employees yet</p>
              <p className="mt-1 text-sm">
                Click &quot;Add Employee&quot; to add your first team member.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      {employee.avatar ? (
                        <img
                          src={employee.avatar}
                          alt={employee.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${getAvatarColor(employee.name)}`}
                        >
                          {getInitials(employee.name)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${roleColors[employee.role] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}
                      >
                        {employee.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditForm(employee)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => openDeleteDialog(employee)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Employee Dialog */}
      <Dialog open={formOpen} onClose={closeForm}>
        <DialogHeader>
          <DialogTitle>
            {editingEmployee ? 'Edit Employee' : 'Add Employee'}
          </DialogTitle>
        </DialogHeader>
        <DialogContent>
          <form
            id="employee-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Avatar Upload */}
            <div className="flex items-center gap-4">
              <div
                className="relative cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E8EEF9] text-[#1F4B8F]">
                    <Upload className="h-6 w-6" />
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div className="text-sm text-gray-500">
                <p className="font-medium text-gray-700">Upload Avatar</p>
                <p>Click to upload a profile photo</p>
              </div>
            </div>

            {/* Name */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name
                </label>
                <Input
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Full name"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name (Arabic)
                </label>
                <Input
                  {...register('nameAr')}
                  placeholder="Arabic name"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Position */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Position
                </label>
                <Input
                  {...register('position', { required: 'Position is required' })}
                  placeholder="e.g. Senior Developer"
                />
                {errors.position && (
                  <p className="mt-1 text-xs text-red-500">{errors.position.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Position (Arabic)
                </label>
                <Input
                  {...register('positionAr')}
                  placeholder="Arabic position"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address',
                    },
                  })}
                  placeholder="email@example.com"
                  type="email"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <Input
                  {...register('phone')}
                  placeholder="+20 123 456 7890"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Role
              </label>
              <Select {...register('role', { required: 'Role is required' })}>
                <option value="admin">Admin</option>
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
                <option value="manager">Manager</option>
              </Select>
              {errors.role && (
                <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>
              )}
            </div>
          </form>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={closeForm} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" form="employee-form" disabled={isSaving}>
            {isSaving ? 'Saving...' : editingEmployee ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogHeader>
          <DialogTitle>Delete Employee</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-900">
              {deletingEmployee?.name}
            </span>
            ? This action cannot be undone.
          </p>
        </DialogContent>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setDeleteOpen(false);
              setDeletingEmployee(null);
            }}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (deletingEmployee) {
                deleteMutation.mutate(deletingEmployee.id);
              }
            }}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
