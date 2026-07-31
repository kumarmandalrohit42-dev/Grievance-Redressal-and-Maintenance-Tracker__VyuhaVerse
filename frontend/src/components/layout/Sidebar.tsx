import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Map, 
  Clock, 
  BarChart3, 
  ShieldCheck, 
  FileText, 
  Wrench, 
  Users, 
  Activity,
  AlertTriangle,
  HelpCircle,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  highlight?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, activeRole } = useAuth();

  const studentNav: NavItem[] = [
    { id: 'dashboard', label: 'My Complaints', icon: LayoutDashboard },
    { id: 'new_complaint', label: 'Raise Complaint', icon: PlusCircle, highlight: true },
    { id: 'map', label: 'Campus Heatmap', icon: Map },
    { id: 'insights', label: 'Campus Health', icon: Activity },
  ];

  const techNav: NavItem[] = [
    { id: 'dashboard', label: "Today's Tasks", icon: Wrench },
    { id: 'map', label: 'Navigation & Map', icon: Map },
    { id: 'performance', label: 'My Performance', icon: BarChart3 },
  ];

  const deptNav: NavItem[] = [
    { id: 'dashboard', label: 'Department Triage', icon: LayoutDashboard },
    { id: 'sla_monitor', label: 'SLA Watchdog', icon: Clock },
    { id: 'map', label: 'Campus Map', icon: Map },
    { id: 'reports', label: 'Department Reports', icon: FileText },
  ];

  const adminNav: NavItem[] = [
    { id: 'dashboard', label: 'Campus Overview', icon: LayoutDashboard },
    { id: 'map', label: 'Interactive Heatmap', icon: Map },
    { id: 'analytics', label: 'System Analytics', icon: BarChart3 },
    { id: 'insights', label: 'Predictive Care', icon: Activity },
    { id: 'audit_logs', label: 'Security Audit Logs', icon: ShieldCheck },
    { id: 'manage_users', label: 'Manage Users & Depts', icon: Users },
  ];

  const getNavItems = () => {
    switch (activeRole) {
      case 'student': return studentNav;
      case 'technician': return techNav;
      case 'dept_head': return deptNav;
      case 'admin': return adminNav;
      default: return studentNav;
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col justify-between bg-white border-r border-slate-200 p-4 min-h-[calc(100vh-4rem)] shadow-soft-xs">
      {/* Navigation Links */}
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
            {activeRole.replace('_', ' ').toUpperCase()} PORTAL
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                    : item.highlight
                    ? 'bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-brand-600 animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* SLA Health Widget */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
            <span className="flex items-center gap-1.5 text-amber-700">
              <AlertTriangle className="w-3.5 h-3.5" />
              Live SLA Health
            </span>
            <span className="font-mono text-emerald-600 font-extrabold">94.8%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-brand-600 to-emerald-500 h-full w-[94.8%]" />
          </div>
          <p className="text-[10px] text-slate-500 font-medium">
            Avg Response: <strong className="text-slate-800">18 mins</strong>
          </p>
        </div>
      </div>

      {/* User Profile Card at Bottom */}
      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-xl object-cover border border-slate-200" />
          <div className="truncate">
            <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
            <p className="text-[10px] text-slate-500 font-mono capitalize">{activeRole.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={() => alert('Settings & Preferences drawer')}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
