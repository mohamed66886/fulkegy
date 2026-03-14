'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  uploadImage,
} from '@/services/firebase';
import type { Project } from '@/types';
import { Plus, Pencil, Trash2, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
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

interface ProjectFormData {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  categoryAr: string;
  technologies: string;
  projectUrl: string;
  facebook: string;
  linkedin: string;
  instagram: string;
}

async function compressImage(
  file: File,
  options: { maxWidth: number; maxHeight: number; quality?: number }
): Promise<File> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to read image file'));
    img.src = URL.createObjectURL(file);
  });

  const ratio = Math.min(
    options.maxWidth / image.width,
    options.maxHeight / image.height,
    1
  );

  const width = Math.round(image.width * ratio);
  const height = Math.round(image.height * ratio);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    URL.revokeObjectURL(image.src);
    return file;
  }

  ctx.drawImage(image, 0, 0, width, height);

  const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const quality = mimeType === 'image/png' ? undefined : options.quality ?? 0.82;

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, mimeType, quality);
  });

  URL.revokeObjectURL(image.src);

  if (!blob) return file;

  const extension = mimeType === 'image/png' ? 'png' : 'jpg';
  const baseName = file.name.replace(/\.[^.]+$/, '');
  return new File([blob], `${baseName}.${extension}`, { type: mimeType });
}

// Loading skeleton for table
function TableSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-10 w-10 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/6 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/6 animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const [formVisible, setFormVisible] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
      if (logoPreview?.startsWith('blob:')) URL.revokeObjectURL(logoPreview);
    };
  }, [imagePreview, logoPreview]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>();

  // Fetch projects
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  // Add project mutation
  const addMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      let imageUrl = '';
      let logoUrl = '';

      setUploading(true);
      try {
        if (imageFile) {
          const optimizedImage = await compressImage(imageFile, {
            maxWidth: 1600,
            maxHeight: 1600,
            quality: 0.82,
          });
          imageUrl = await uploadImage(optimizedImage, 'projects');
        }
        if (logoFile) {
          const optimizedLogo = await compressImage(logoFile, {
            maxWidth: 600,
            maxHeight: 600,
            quality: 0.9,
          });
          logoUrl = await uploadImage(optimizedLogo, 'projects/logos');
        }
      } finally {
        setUploading(false);
      }

      return addProject({
        title: data.title,
        titleAr: data.titleAr,
        description: data.description,
        descriptionAr: data.descriptionAr,
        category: data.category,
        categoryAr: data.categoryAr,
        technologies: data.technologies.split(',').map((t) => t.trim()).filter(Boolean),
        projectUrl: data.projectUrl,
        image: imageUrl,
        logo: logoUrl,
        socialLinks: {
          website: data.projectUrl,
          facebook: data.facebook,
          linkedin: data.linkedin,
          instagram: data.instagram,
        },
      });
    },
    onSuccess: () => {
      setSaveError(null);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      closeForm();
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to save project.';
      if (message.toLowerCase().includes('permission')) {
        setSaveError('Missing or insufficient permissions. Please check Firebase Storage/Firestore rules for projects and projects/logos paths.');
        return;
      }
      setSaveError(message);
    },
  });

  // Update project mutation
  const updateMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      if (!editingProject) return;
      let imageUrl = editingProject.image;
      let logoUrl = editingProject.logo ?? '';

      setUploading(true);
      try {
        if (imageFile) {
          const optimizedImage = await compressImage(imageFile, {
            maxWidth: 1600,
            maxHeight: 1600,
            quality: 0.82,
          });
          imageUrl = await uploadImage(optimizedImage, 'projects');
        }
        if (logoFile) {
          const optimizedLogo = await compressImage(logoFile, {
            maxWidth: 600,
            maxHeight: 600,
            quality: 0.9,
          });
          logoUrl = await uploadImage(optimizedLogo, 'projects/logos');
        }
      } finally {
        setUploading(false);
      }

      return updateProject(editingProject.id, {
        title: data.title,
        titleAr: data.titleAr,
        description: data.description,
        descriptionAr: data.descriptionAr,
        category: data.category,
        categoryAr: data.categoryAr,
        technologies: data.technologies.split(',').map((t) => t.trim()).filter(Boolean),
        projectUrl: data.projectUrl,
        image: imageUrl,
        logo: logoUrl,
        socialLinks: {
          website: data.projectUrl,
          facebook: data.facebook,
          linkedin: data.linkedin,
          instagram: data.instagram,
        },
      });
    },
    onSuccess: () => {
      setSaveError(null);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      closeForm();
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to update project.';
      if (message.toLowerCase().includes('permission')) {
        setSaveError('Missing or insufficient permissions. Please check Firebase Storage/Firestore rules for projects and projects/logos paths.');
        return;
      }
      setSaveError(message);
    },
  });

  // Delete project mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setDeleteOpen(false);
      setDeletingProject(null);
    },
  });

  function openAddForm() {
    setEditingProject(null);
    reset({
      title: '',
      titleAr: '',
      description: '',
      descriptionAr: '',
      category: 'Web',
      categoryAr: '',
      technologies: '',
      projectUrl: '',
      facebook: '',
      linkedin: '',
      instagram: '',
    });
    setImageFile(null);
    setLogoFile(null);
    setImagePreview(null);
    setLogoPreview(null);
    setSaveError(null);
    setFormVisible(true);
  }

  function openEditForm(project: Project) {
    setEditingProject(project);
    reset({
      title: project.title,
      titleAr: project.titleAr,
      description: project.description,
      descriptionAr: project.descriptionAr,
      category: project.category,
      categoryAr: project.categoryAr,
      technologies: project.technologies.join(', '),
      projectUrl: project.projectUrl,
      facebook: project.socialLinks?.facebook ?? '',
      linkedin: project.socialLinks?.linkedin ?? '',
      instagram: project.socialLinks?.instagram ?? '',
    });
    setImageFile(null);
    setLogoFile(null);
    setImagePreview(project.image ?? null);
    setLogoPreview(project.logo ?? null);
    setSaveError(null);
    setFormVisible(true);
  }

  function closeForm() {
    setFormVisible(false);
    setEditingProject(null);
    setImageFile(null);
    setLogoFile(null);
    setImagePreview(null);
    setLogoPreview(null);
    setSaveError(null);
    reset();
  }

  function openDeleteDialog(project: Project) {
    setDeletingProject(project);
    setDeleteOpen(true);
  }

  function onSubmit(data: ProjectFormData) {
    setSaveError(null);
    if (editingProject) {
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
          <h1 className="text-3xl font-bold text-[#1F4B8F]">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your portfolio projects
          </p>
        </div>
        <Button onClick={openAddForm}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* Projects Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <TableSkeleton />
            </div>
          ) : !projects || projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FolderKanban className="mb-3 h-12 w-12" />
              <p className="text-lg font-medium">No projects yet</p>
              <p className="mt-1 text-sm">
                Click &quot;Add Project&quot; to create your first project.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Technologies</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      {project.image ? (
                        <div className="relative h-10 w-14 overflow-hidden rounded">
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-14 items-center justify-center rounded bg-[#E8EEF9]">
                          <FolderKanban className="h-5 w-5 text-[#1F4B8F]" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-[#E8EEF9] px-2.5 py-0.5 text-xs font-medium text-[#1F4B8F]">
                        {project.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies?.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies?.length > 3 && (
                          <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditForm(project)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => openDeleteDialog(project)}
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

      {/* Add/Edit Project Form */}
      {formVisible && (
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#1F4B8F]">
                {editingProject ? 'Edit Project' : 'Add Project'}
              </h2>
              <Button type="button" variant="outline" onClick={closeForm} disabled={isSaving}>
                Cancel
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Title
                </label>
                <Input
                  {...register('title', { required: 'Title is required' })}
                  placeholder="Project title"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Title (Arabic)
                </label>
                <Input
                  {...register('titleAr')}
                  placeholder="Arabic title"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <Textarea
                  {...register('description', { required: 'Description is required' })}
                  placeholder="Project description"
                  rows={3}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description (Arabic)
                </label>
                <Textarea
                  {...register('descriptionAr')}
                  placeholder="Arabic description"
                  dir="rtl"
                  rows={3}
                />
              </div>
            </div>

            {/* Category */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Category
                </label>
                <Select
                  {...register('category', { required: 'Category is required' })}
                >
                  <option value="Web">Web</option>
                  <option value="Mobile">Mobile</option>
                  <option value="ERP">ERP</option>
                  <option value="Design">Design</option>
                </Select>
                {errors.category && (
                  <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Category (Arabic)
                </label>
                <Input
                  {...register('categoryAr')}
                  placeholder="Arabic category"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Technologies */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Technologies
              </label>
              <Input
                {...register('technologies')}
                placeholder="React, Next.js, Tailwind CSS (comma separated)"
              />
              <p className="mt-1 text-xs text-gray-400">
                Separate technologies with commas
              </p>
            </div>

            {/* Project URL */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Project URL
              </label>
              <Input
                {...register('projectUrl')}
                placeholder="https://example.com"
                type="url"
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Project Logo
              </label>
              <label
                htmlFor="project-logo-upload"
                className="mt-1 flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-[#1F4B8F]/40 bg-[#F4F7FC] text-xs text-[#1F4B8F]"
              >
                {logoPreview ? (
                  <span className="relative h-full w-full">
                    <Image
                      src={logoPreview}
                      alt="Logo preview"
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </span>
                ) : (
                  'Click'
                )}
              </label>
              <Input
                id="project-logo-upload"
                className="hidden"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setLogoFile(file);
                  if (logoPreview?.startsWith('blob:')) {
                    URL.revokeObjectURL(logoPreview);
                  }
                  setLogoPreview(file ? URL.createObjectURL(file) : editingProject?.logo ?? null);
                }}
              />
              <p className="mt-1 text-xs text-gray-400">Click logo circle to upload</p>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Facebook URL
                </label>
                <Input
                  {...register('facebook')}
                  placeholder="https://facebook.com/your-page"
                  type="url"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  LinkedIn URL
                </label>
                <Input
                  {...register('linkedin')}
                  placeholder="https://linkedin.com/company/your-company"
                  type="url"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Instagram URL
              </label>
              <Input
                {...register('instagram')}
                placeholder="https://instagram.com/your-account"
                type="url"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Project Image
              </label>
              <label
                htmlFor="project-image-upload"
                className="mt-1 flex h-36 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-[#1F4B8F]/40 bg-[#F4F7FC] text-sm text-[#1F4B8F]"
              >
                {imagePreview ? (
                  <span className="relative h-full w-full">
                    <Image
                      src={imagePreview}
                      alt="Image preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                  </span>
                ) : (
                  'Click to choose project image'
                )}
              </label>
              <Input
                id="project-image-upload"
                className="hidden"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setImageFile(file);
                  if (imagePreview?.startsWith('blob:')) {
                    URL.revokeObjectURL(imagePreview);
                  }
                  setImagePreview(file ? URL.createObjectURL(file) : editingProject?.image ?? null);
                }}
              />
              <p className="mt-1 text-xs text-gray-400">Click image area to upload</p>
            </div>

              {saveError && (
                <p className="text-sm text-red-600">{saveError}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={closeForm} disabled={isSaving}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : editingProject ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-900">
              {deletingProject?.title}
            </span>
            ? This action cannot be undone.
          </p>
        </DialogContent>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setDeleteOpen(false);
              setDeletingProject(null);
            }}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (deletingProject) {
                deleteMutation.mutate(deletingProject.id);
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
