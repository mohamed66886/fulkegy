'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
  getClients,
  addClient,
  updateClient,
  deleteClient,
} from '@/services/firebase';
import type { Client } from '@/types';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface ClientFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  projects: string;
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-4 w-1/5 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/5 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/5 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/6 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/12 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/12 animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

export default function ClientsPage() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>();

  // Fetch clients
  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  // Add client mutation
  const addMutation = useMutation({
    mutationFn: async (data: ClientFormData) => {
      return addClient({
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone,
        projects: data.projects
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      closeForm();
    },
  });

  // Update client mutation
  const updateMutation = useMutation({
    mutationFn: async (data: ClientFormData) => {
      if (!editingClient) return;
      return updateClient(editingClient.id, {
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone,
        projects: data.projects
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      closeForm();
    },
  });

  // Delete client mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setDeleteOpen(false);
      setDeletingClient(null);
    },
  });

  function openAddForm() {
    setEditingClient(null);
    reset({
      name: '',
      company: '',
      email: '',
      phone: '',
      projects: '',
    });
    setFormOpen(true);
  }

  function openEditForm(client: Client) {
    setEditingClient(client);
    reset({
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone,
      projects: client.projects?.join(', ') ?? '',
    });
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingClient(null);
    reset();
  }

  function openDeleteDialog(client: Client) {
    setDeletingClient(client);
    setDeleteOpen(true);
  }

  function onSubmit(data: ClientFormData) {
    if (editingClient) {
      updateMutation.mutate(data);
    } else {
      addMutation.mutate(data);
    }
  }

  const isSaving = addMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-8">
      {/* Page Title and Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1F4B8F]">Clients</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your client relationships
          </p>
        </div>
        <Button onClick={openAddForm}>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Clients Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <TableSkeleton />
            </div>
          ) : !clients || clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Users className="mb-3 h-12 w-12" />
              <p className="text-lg font-medium">No clients yet</p>
              <p className="mt-1 text-sm">
                Click &quot;Add Client&quot; to create your first client.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.company}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {client.projects?.length ?? 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditForm(client)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => openDeleteDialog(client)}
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

      {/* Add/Edit Client Dialog */}
      <Dialog open={formOpen} onClose={closeForm}>
        <DialogHeader>
          <DialogTitle>
            {editingClient ? 'Edit Client' : 'Add Client'}
          </DialogTitle>
        </DialogHeader>
        <DialogContent>
          <form
            id="client-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Name
              </label>
              <Input
                {...register('name', { required: 'Name is required' })}
                placeholder="Client name"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Company
              </label>
              <Input
                {...register('company', { required: 'Company is required' })}
                placeholder="Company name"
              />
              {errors.company && (
                <p className="mt-1 text-xs text-red-500">{errors.company.message}</p>
              )}
            </div>

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
                  placeholder="client@example.com"
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

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Projects
              </label>
              <Input
                {...register('projects')}
                placeholder="Project A, Project B (comma separated)"
              />
              <p className="mt-1 text-xs text-gray-400">
                Separate project names with commas
              </p>
            </div>
          </form>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={closeForm} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" form="client-form" disabled={isSaving}>
            {isSaving ? 'Saving...' : editingClient ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogHeader>
          <DialogTitle>Delete Client</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-900">
              {deletingClient?.name}
            </span>
            ? This action cannot be undone.
          </p>
        </DialogContent>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setDeleteOpen(false);
              setDeletingClient(null);
            }}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (deletingClient) {
                deleteMutation.mutate(deletingClient.id);
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
