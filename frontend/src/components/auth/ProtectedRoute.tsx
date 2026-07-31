import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldAlert } from 'lucide-react';

interface Props {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({ allowedRoles, children }) => {
  const { activeRole, switchRole } = useAuth();

  if (!allowedRoles.includes(activeRole)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">Access Restricted</h2>
        <p className="text-sm text-slate-400 max-w-md mb-6">
          This portal section requires <span className="font-mono text-brand-400 font-semibold">{allowedRoles.join(', ')}</span> permission levels. You are currently logged in as <span className="font-semibold text-slate-200">{activeRole}</span>.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => switchRole(allowedRoles[0])}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-brand-500/20"
          >
            Switch to {allowedRoles[0].replace('_', ' ').toUpperCase()} Role
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
