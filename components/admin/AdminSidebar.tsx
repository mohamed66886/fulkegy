'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { logoutAdmin } from '@/services/firebase';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  UserCog,
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { label: 'Projects', icon: FolderKanban, href: '/admin/projects' },
  { label: 'Clients', icon: Users, href: '/admin/clients' },
  { label: 'Employees', icon: UserCog, href: '/admin/employees' },
  { label: 'Messages', icon: MessageSquare, href: '/admin/messages' },
  { label: 'Blog', icon: FileText, href: '/admin/blog' },
  { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white tracking-wide">
          Fulk | فُلك
        </h1>
        <p className="text-sm text-white/50 mt-1">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                transition-all duration-200
                ${
                  active
                    ? 'bg-white/15 text-white border-l-4 border-[#2F6EDB] pl-3'
                    : 'text-white/70 hover:bg-white/10 hover:text-white border-l-4 border-transparent pl-3'
                }
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User info & Logout */}
      <div className="px-4 py-4 border-t border-white/10">
        {user?.email && (
          <div className="px-3 py-2 mb-3">
            <p className="text-xs text-white/40 uppercase tracking-wider">Signed in as</p>
            <p className="text-sm text-white/80 truncate mt-0.5">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium
            text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#1F4B8F] text-white shadow-lg lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu size={24} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-[280px] bg-[#1F4B8F]
          transform transition-transform duration-300 ease-in-out lg:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1 text-white/70 hover:text-white"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 h-full w-[280px] bg-[#1F4B8F] shadow-xl z-30">
        {sidebarContent}
      </aside>
    </>
  );
}
