import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { StudentDashboard } from './components/student/StudentDashboard';
import { TechnicianDashboard } from './components/technician/TechnicianDashboard';
import { DepartmentDashboard } from './components/department/DepartmentDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CampusMap } from './components/map/CampusMap';
import { LiveChatDrawer } from './components/chat/LiveChatDrawer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { LoginView } from './components/auth/LoginView';
import { Complaint } from './types';

const MainAppContent: React.FC = () => {
  const { activeRole } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeChatComplaint, setActiveChatComplaint] = useState<Complaint | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleOpenChat = (complaint: Complaint) => {
    setActiveChatComplaint(complaint);
  };

  if (!isLoggedIn) {
    return <LoginView onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  const tabTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    new_complaint: 'Raise Complaint',
    map: 'Campus Heatmap',
    insights: 'Campus Health',
    sla_monitor: 'SLA Watchdog',
    reports: 'Reports & Analytics',
    analytics: 'System Analytics',
    audit_logs: 'Security Audit Trail',
    manage_users: 'Manage Personnel'
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        activeTabTitle={tabTitles[activeTab] || 'Dashboard'}
      />

      {/* Body Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'map' ? (
            <CampusMap onSelectComplaint={handleOpenChat} />
          ) : (
            <>
              {activeRole === 'student' && (
                <StudentDashboard
                  onOpenChat={handleOpenChat}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              )}
              {activeRole === 'technician' && (
                <TechnicianDashboard
                  onOpenChat={handleOpenChat}
                  setActiveTab={setActiveTab}
                />
              )}
              {activeRole === 'dept_head' && (
                <DepartmentDashboard onOpenChat={handleOpenChat} />
              )}
              {activeRole === 'admin' && (
                <AdminDashboard />
              )}
            </>
          )}
        </main>
      </div>

      {/* Live Chat Drawer */}
      <LiveChatDrawer
        complaint={activeChatComplaint}
        isOpen={Boolean(activeChatComplaint)}
        onClose={() => setActiveChatComplaint(null)}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectComplaint={(cmp) => handleOpenChat(cmp)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
