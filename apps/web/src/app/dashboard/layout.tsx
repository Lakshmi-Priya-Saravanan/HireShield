"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, LayoutDashboard, Scan, History, MessageSquare, BookOpen, LogOut, User, Bell, Activity } from 'lucide-react';
import { api, getAuthUser, clearAuthSession } from '@/lib/api';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const activeUser = getAuthUser();
    if (!activeUser) {
      router.push('/login');
    } else {
      setUser(activeUser);
      fetchNotifications();
    }
  }, [router]);

  const fetchNotifications = async () => {
    try {
      const notifs = await api.getNotifications();
      setNotifications(notifs);
    } catch (e) {
      console.warn("Failed to load notifications:", e);
    }
  };

  const markRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      fetchNotifications();
    } catch (e) {
      console.warn(e);
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        <div className="flex items-center gap-2"><Activity className="w-5 h-5 animate-spin" /> Verifying profile credentials...</div>
      </div>
    );
  }

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Verify Scanner', path: '/dashboard/scanner', icon: Scan },
    { name: 'Audit History', path: '/dashboard/history', icon: History },
    { name: 'HireShield AI', path: '/dashboard/assistant', icon: MessageSquare },
    { name: 'Knowledge Center', path: '/dashboard/knowledge', icon: BookOpen }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-900 bg-slate-950 flex flex-col justify-between hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <ShieldCheck className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">HireShield</span>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}>
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-slate-900">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
              <User className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">{user.name}</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{user.role}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-500/5 rounded-lg border border-transparent hover:border-red-500/15 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="h-16 border-b border-slate-900 bg-slate-950/80 backdrop-blur flex justify-between items-center px-8 sticky top-0 z-40">
          <div>
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 md:hidden flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-500" /> HireShield
            </Link>
            <h2 className="text-sm font-semibold text-slate-300">Workspace Dashboard</h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Badge */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-850 text-slate-400 hover:text-slate-200 relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 z-50 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-white">System Alerts</span>
                    {unreadCount > 0 && <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-bold">{unreadCount} New</span>}
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2.5">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">No recent notification logs.</p>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className={`p-2.5 rounded-lg text-xs border ${
                          notif.read ? 'bg-slate-950/20 border-slate-900 text-slate-500' : 'bg-blue-500/5 border-blue-500/10 text-slate-200'
                        }`}>
                          <div className="font-semibold">{notif.title}</div>
                          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{notif.message}</p>
                          {!notif.read && (
                            <button 
                              onClick={() => markRead(notif.id)}
                              className="mt-2 text-[10px] text-blue-400 font-semibold hover:underline"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Mobile Layout Logout */}
            <button 
              onClick={handleLogout}
              className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-850 text-red-400 md:hidden"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dashboard Pages */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
