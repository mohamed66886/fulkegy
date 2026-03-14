'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMessages,
  markMessageRead,
  replyToMessage,
  archiveMessage,
  deleteMessage,
} from '@/services/firebase';
import type { Message } from '@/types';
import {
  Eye,
  Reply,
  Archive,
  Trash2,
  MessageSquare,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

type FilterTab = 'all' | 'unread' | 'archived';

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
          <div className="h-4 w-1/6 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/5 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/12 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/8 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/8 animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

export default function MessagesPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [replyOpen, setReplyOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [deletingMessage, setDeletingMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');

  // Fetch messages
  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: getMessages,
  });

  // Mark as read mutation
  const markReadMutation = useMutation({
    mutationFn: (id: string) => markMessageRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  // Reply mutation
  const replyMutation = useMutation({
    mutationFn: ({ id, reply }: { id: string; reply: string }) =>
      replyToMessage(id, reply),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setReplyOpen(false);
      setSelectedMessage(null);
      setReplyText('');
    },
  });

  // Archive mutation
  const archiveMutation = useMutation({
    mutationFn: (id: string) => archiveMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setDeleteOpen(false);
      setDeletingMessage(null);
    },
  });

  function openReplyDialog(message: Message) {
    setSelectedMessage(message);
    setReplyText(message.reply ?? '');
    setReplyOpen(true);
  }

  function openDeleteDialog(message: Message) {
    setDeletingMessage(message);
    setDeleteOpen(true);
  }

  function handleReply() {
    if (selectedMessage && replyText.trim()) {
      replyMutation.mutate({ id: selectedMessage.id, reply: replyText });
    }
  }

  // Filter messages based on active tab
  const filteredMessages = messages?.filter((msg) => {
    if (activeTab === 'unread') return !msg.read;
    if (activeTab === 'archived') return msg.archived;
    return true;
  });

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: messages?.length ?? 0 },
    {
      key: 'unread',
      label: 'Unread',
      count: messages?.filter((m) => !m.read).length ?? 0,
    },
    {
      key: 'archived',
      label: 'Archived',
      count: messages?.filter((m) => m.archived).length ?? 0,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-[#1F4B8F]">Messages</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage contact form messages
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-[#1F4B8F] text-white'
                : 'bg-white text-gray-600 hover:bg-[#E8EEF9] hover:text-[#1F4B8F]'
            }`}
          >
            {tab.label}
            <span
              className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-semibold ${
                activeTab === tab.key
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Messages Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <TableSkeleton />
            </div>
          ) : !filteredMessages || filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <MessageSquare className="mb-3 h-12 w-12" />
              <p className="text-lg font-medium">No messages</p>
              <p className="mt-1 text-sm">
                {activeTab === 'unread'
                  ? 'All messages have been read.'
                  : activeTab === 'archived'
                    ? 'No archived messages yet.'
                    : 'No messages received yet.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((msg) => (
                  <TableRow
                    key={msg.id}
                    className={!msg.read ? 'bg-[#F5F7FB]' : ''}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {!msg.read && (
                          <div className="h-2 w-2 rounded-full bg-[#2F6EDB]" />
                        )}
                        {msg.name}
                      </div>
                    </TableCell>
                    <TableCell>{msg.email}</TableCell>
                    <TableCell className="max-w-[250px] truncate">
                      {msg.message}
                    </TableCell>
                    <TableCell>
                      {msg.archived ? (
                        <Badge variant="outline">Archived</Badge>
                      ) : msg.read ? (
                        <Badge variant="secondary">Read</Badge>
                      ) : (
                        <Badge>Unread</Badge>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(
                        msg.createdAt as unknown as {
                          seconds: number;
                          nanoseconds: number;
                        }
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {!msg.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Mark as Read"
                            onClick={() => markReadMutation.mutate(msg.id)}
                            disabled={markReadMutation.isPending}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Reply"
                          onClick={() => openReplyDialog(msg)}
                        >
                          <Reply className="h-4 w-4" />
                        </Button>
                        {!msg.archived && (
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Archive"
                            onClick={() => archiveMutation.mutate(msg.id)}
                            disabled={archiveMutation.isPending}
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          title="Delete"
                          onClick={() => openDeleteDialog(msg)}
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

      {/* Reply Dialog */}
      <Dialog
        open={replyOpen}
        onClose={() => {
          setReplyOpen(false);
          setSelectedMessage(null);
          setReplyText('');
        }}
      >
        <DialogHeader>
          <DialogTitle>Reply to Message</DialogTitle>
        </DialogHeader>
        <DialogContent>
          {selectedMessage && (
            <div className="space-y-4">
              {/* Original message */}
              <div className="rounded-lg bg-[#F5F7FB] p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#1F4B8F]" />
                  <span className="text-sm font-medium text-[#1F4B8F]">
                    {selectedMessage.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({selectedMessage.email})
                  </span>
                </div>
                <p className="text-sm text-gray-700">{selectedMessage.message}</p>
              </div>

              {/* Reply textarea */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Your Reply
                </label>
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  rows={4}
                />
              </div>
            </div>
          )}
        </DialogContent>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setReplyOpen(false);
              setSelectedMessage(null);
              setReplyText('');
            }}
            disabled={replyMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReply}
            disabled={!replyText.trim() || replyMutation.isPending}
          >
            {replyMutation.isPending ? 'Sending...' : 'Send Reply'}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogHeader>
          <DialogTitle>Delete Message</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete the message from{' '}
            <span className="font-semibold text-gray-900">
              {deletingMessage?.name}
            </span>
            ? This action cannot be undone.
          </p>
        </DialogContent>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setDeleteOpen(false);
              setDeletingMessage(null);
            }}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (deletingMessage) {
                deleteMutation.mutate(deletingMessage.id);
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
