import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Bell, 
  ShieldCheck, 
  Wrench, 
  GraduationCap, 
  Building2, 
  Check, 
  ChevronDown,
  LogOut,
  Moon,
  Sun,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, Notification } from '../../types';
import { store } from '../../services/store';

interface NavbarProps {
  onOpenSearch: () => void;
  activeTabTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, activeTabTitle = 'Dashboard' }) => {
  const { currentUser, activeRole, switchRole, logout } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const update = () => {
      setNotifications(store.getNotifications(currentUser.id));
    };
    update();
    return store.subscribe(update);
  }, [currentUser.id]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const roleOptions: { role: UserRole; label: string; icon: any; color: string }[] = [
    { role: 'student', label: 'Student Portal', icon: GraduationCap, color: 'text-emerald-600' },
    { role: 'technician', label: 'Technician Desk', icon: Wrench, color: 'text-amber-600' },
    { role: 'dept_head', label: 'Department Head', icon: Building2, color: 'text-brand-600' },
    { role: 'admin', label: 'Admin Senate', icon: ShieldCheck, color: 'text-indigo-600' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-soft-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 p-0.5 shadow-md shadow-brand-500/20">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-600 animate-pulse" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1">
                CampusCare <span className="text-brand-600">AI</span>
              </span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                <span>Campus</span>
                <ChevronRight className="w-3 h-3 text-slate-300" />
                <span className="text-slate-600 font-semibold">{activeTabTitle}</span>
              </div>
            </div>
          </div>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 transition shadow-soft-xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Role: <strong className="font-bold capitalize text-brand-600">{activeRole.replace('_', ' ')}</strong></span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute left-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in">
                <div className="px-2 py-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                  Select Demo Access Mode
                </div>
                {roleOptions.map((opt) => {
                  const IconComponent = opt.icon;
                  const isSelected = activeRole === opt.role;
                  return (
                    <button
                      key={opt.role}
                      onClick={() => {
                        switchRole(opt.role);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        isSelected ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComponent className={`w-4 h-4 ${opt.color}`} />
                        <span>{opt.label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-brand-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs text-slate-400 transition group shadow-soft-xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition" />
              <span>Search complaints, buildings, technicians...</span>
            </div>
            <kbd className="px-2 py-0.5 bg-white text-[10px] font-mono rounded-lg text-slate-500 border border-slate-200 shadow-xs">
              Cmd+K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setShowNotifPopover(!showNotifPopover)}
              className="relative p-2.5 text-slate-600 hover:text-slate-900 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition shadow-soft-xs"
              title="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-bounce shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifPopover && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <h4 className="text-xs font-bold text-slate-900">Notifications</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 font-mono font-bold">
                    {unreadCount} New
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">No notifications yet</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => store.markNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                          n.isRead ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-brand-50/50 border-brand-200 text-slate-900 font-semibold'
                        }`}
                      >
                        <p className="font-bold text-slate-900 mb-0.5">{n.title}</p>
                        <p className="text-[11px] text-slate-600 leading-tight">{n.message}</p>
                        <span className="text-[10px] text-slate-400 font-mono block mt-1">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={() => {
              setIsDarkMode(!isDarkMode);
              document.documentElement.classList.toggle('dark');
            }}
            className="p-2.5 text-slate-600 hover:text-slate-900 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition shadow-soft-xs"
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4.5 h-4.5 text-amber-500" /> : <Moon className="w-4.5 h-4.5 text-indigo-600" />}
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition shadow-soft-xs"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover"
              />
              <span className="text-xs font-bold text-slate-800 hidden sm:inline max-w-[100px] truncate">
                {currentUser.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50">
                <div className="border-b border-slate-100 pb-2 mb-2">
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 font-bold border border-brand-200">
                    {activeRole.toUpperCase()}
                  </span>
                </div>

                <button
                  onClick={() => {
                    logout();
                    setShowUserDropdown(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 font-semibold transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
