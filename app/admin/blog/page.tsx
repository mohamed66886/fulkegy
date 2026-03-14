'use client';

import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
  getBlogPosts,
  addBlogPost,
  updateBlogPost,
  deleteBlogPost,
  uploadImage,
} from '@/services/firebase';
import type { BlogPost } from '@/types';
import { Timestamp } from 'firebase/firestore';
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

interface BlogFormData {
  title: string;
  titleAr: string;
  slug: string;
  content: string;
  contentAr: string;
  tags: string;
  author: string;
  publishDate: string;
  published: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

function formatDate(
  timestamp: { seconds: number; nanoseconds: number } | undefined
) {
  if (!timestamp) return '-';
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-10 w-14 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/6 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/6 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/12 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/8 animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

export default function BlogPage() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogFormData>();

  const watchTitle = watch('title');

  // Fetch blog posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog_posts'],
    queryFn: getBlogPosts,
  });

  // Add blog post mutation
  const addMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      let coverUrl = '';
      if (coverFile) {
        setUploading(true);
        coverUrl = await uploadImage(coverFile, 'blog');
        setUploading(false);
      }
      return addBlogPost({
        title: data.title,
        titleAr: data.titleAr,
        slug: data.slug || slugify(data.title),
        content: data.content,
        contentAr: data.contentAr,
        tags: data.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        author: data.author,
        publishDate: data.publishDate
          ? Timestamp.fromDate(new Date(data.publishDate))
          : Timestamp.now(),
        published: data.published,
        coverImage: coverUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      closeForm();
    },
  });

  // Update blog post mutation
  const updateMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      if (!editingPost) return;
      let coverUrl = editingPost.coverImage;
      if (coverFile) {
        setUploading(true);
        coverUrl = await uploadImage(coverFile, 'blog');
        setUploading(false);
      }
      return updateBlogPost(editingPost.id, {
        title: data.title,
        titleAr: data.titleAr,
        slug: data.slug || slugify(data.title),
        content: data.content,
        contentAr: data.contentAr,
        tags: data.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        author: data.author,
        publishDate: data.publishDate
          ? Timestamp.fromDate(new Date(data.publishDate))
          : editingPost.publishDate,
        published: data.published,
        coverImage: coverUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      closeForm();
    },
  });

  // Delete blog post mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBlogPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      setDeleteOpen(false);
      setDeletingPost(null);
    },
  });

  // Toggle published mutation
  const togglePublishMutation = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      updateBlogPost(id, { published }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
    },
  });

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setCoverFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverPreview(null);
    }
  }

  function openAddForm() {
    setEditingPost(null);
    reset({
      title: '',
      titleAr: '',
      slug: '',
      content: '',
      contentAr: '',
      tags: '',
      author: '',
      publishDate: new Date().toISOString().split('T')[0],
      published: false,
    });
    setCoverFile(null);
    setCoverPreview(null);
    setFormOpen(true);
  }

  function openEditForm(post: BlogPost) {
    setEditingPost(post);
    const pubDate = post.publishDate
      ? new Date((post.publishDate as unknown as { seconds: number }).seconds * 1000)
          .toISOString()
          .split('T')[0]
      : '';
    reset({
      title: post.title,
      titleAr: post.titleAr,
      slug: post.slug,
      content: post.content,
      contentAr: post.contentAr,
      tags: post.tags?.join(', ') ?? '',
      author: post.author,
      publishDate: pubDate,
      published: post.published,
    });
    setCoverFile(null);
    setCoverPreview(post.coverImage || null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingPost(null);
    setCoverFile(null);
    setCoverPreview(null);
    reset();
  }

  function openDeleteDialog(post: BlogPost) {
    setDeletingPost(post);
    setDeleteOpen(true);
  }

  function onSubmit(data: BlogFormData) {
    if (editingPost) {
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
          <h1 className="text-3xl font-bold text-[#1F4B8F]">Blog Posts</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your blog content
          </p>
        </div>
        <Button onClick={openAddForm}>
          <Plus className="mr-2 h-4 w-4" />
          Add Post
        </Button>
      </div>

      {/* Blog Posts Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <TableSkeleton />
            </div>
          ) : !posts || posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FileText className="mb-3 h-12 w-12" />
              <p className="text-lg font-medium">No blog posts yet</p>
              <p className="mt-1 text-sm">
                Click &quot;Add Post&quot; to write your first blog post.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cover</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="h-10 w-14 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-14 items-center justify-center rounded bg-[#E8EEF9]">
                          <ImageIcon className="h-5 w-5 text-[#1F4B8F]" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px] font-medium">
                      <p className="truncate">{post.title}</p>
                    </TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {post.tags?.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags?.length > 2 && (
                          <Badge variant="outline">+{post.tags.length - 2}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() =>
                          togglePublishMutation.mutate({
                            id: post.id,
                            published: !post.published,
                          })
                        }
                        className="cursor-pointer"
                        disabled={togglePublishMutation.isPending}
                      >
                        {post.published ? (
                          <Badge className="bg-green-600 hover:bg-green-700">
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                            Draft
                          </Badge>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(
                        post.publishDate as unknown as {
                          seconds: number;
                          nanoseconds: number;
                        }
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditForm(post)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => openDeleteDialog(post)}
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

      {/* Add/Edit Blog Post Dialog */}
      <Dialog open={formOpen} onClose={closeForm}>
        <DialogHeader>
          <DialogTitle>
            {editingPost ? 'Edit Blog Post' : 'Add Blog Post'}
          </DialogTitle>
        </DialogHeader>
        <DialogContent>
          <form
            id="blog-form"
            onSubmit={handleSubmit(onSubmit)}
            className="max-h-[60vh] space-y-4 overflow-y-auto pr-1"
          >
            {/* Cover Image Upload */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Cover Image
              </label>
              <div
                className="relative cursor-pointer rounded-lg border-2 border-dashed border-[#E8EEF9] p-4 text-center transition-colors hover:border-[#2F6EDB]"
                onClick={() => fileInputRef.current?.click()}
              >
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="mx-auto h-32 rounded object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 py-4 text-gray-400">
                    <ImageIcon className="h-8 w-8" />
                    <p className="text-sm">Click to upload cover image</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverChange}
                />
              </div>
            </div>

            {/* Title */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Title
                </label>
                <Input
                  {...register('title', { required: 'Title is required' })}
                  placeholder="Post title"
                  onChange={(e) => {
                    register('title').onChange(e);
                    if (!editingPost) {
                      setValue('slug', slugify(e.target.value));
                    }
                  }}
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

            {/* Slug */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Slug
              </label>
              <Input
                {...register('slug')}
                placeholder="auto-generated-from-title"
              />
              <p className="mt-1 text-xs text-gray-400">
                URL-friendly identifier, auto-generated from title
              </p>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Content
                </label>
                <Textarea
                  {...register('content', { required: 'Content is required' })}
                  placeholder="Write your blog post content..."
                  rows={6}
                />
                {errors.content && (
                  <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Content (Arabic)
                </label>
                <Textarea
                  {...register('contentAr')}
                  placeholder="Arabic content"
                  dir="rtl"
                  rows={6}
                />
              </div>
            </div>

            {/* Tags & Author */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <Input
                  {...register('tags')}
                  placeholder="React, Next.js, Web Dev (comma separated)"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Separate tags with commas
                </p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Author
                </label>
                <Input
                  {...register('author', { required: 'Author is required' })}
                  placeholder="Author name"
                />
                {errors.author && (
                  <p className="mt-1 text-xs text-red-500">{errors.author.message}</p>
                )}
              </div>
            </div>

            {/* Publish Date & Published */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Publish Date
                </label>
                <Input {...register('publishDate')} type="date" />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 pb-2">
                  <input
                    type="checkbox"
                    {...register('published')}
                    className="h-4 w-4 rounded border-[#E8EEF9] text-[#1F4B8F] focus:ring-[#1F4B8F]"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Published
                  </span>
                </label>
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={closeForm} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" form="blog-form" disabled={isSaving}>
            {isSaving ? 'Saving...' : editingPost ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogHeader>
          <DialogTitle>Delete Blog Post</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-900">
              {deletingPost?.title}
            </span>
            ? This action cannot be undone.
          </p>
        </DialogContent>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setDeleteOpen(false);
              setDeletingPost(null);
            }}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (deletingPost) {
                deleteMutation.mutate(deletingPost.id);
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
