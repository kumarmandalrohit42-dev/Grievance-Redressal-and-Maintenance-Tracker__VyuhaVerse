import React, { useState, useEffect } from 'react';
import { Search, X, Ticket, Building, User, ArrowRight } from 'lucide-react';
import { store } from '../../services/store';
import { Complaint, CampusBuilding, User as UserType } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectComplaint: (complaint: Complaint) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectComplaint,
}) => {
  const [query, setQuery] = useState('');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [buildings, setBuildings] = useState<CampusBuilding[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    setComplaints(store.getComplaints());
    setBuildings(store.getBuildings());
    setUsers(store.getUsers());
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredComplaints = complaints.filter(
    c =>
      c.trackingNumber.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.buildingName.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
  );

  const filteredBuildings = buildings.filter(
    b => b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q)
  );

  const filteredUsers = users.filter(
    u => u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Input Header */}
        <div className="relative flex items-center px-4 border-b border-slate-200 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search tickets, buildings, students, technicians..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent py-4 px-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none font-medium"
          />
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl bg-slate-200/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto custom-scrollbar p-4 space-y-4 flex-1 bg-white">
          {q === '' ? (
            <div className="py-12 text-center text-slate-400 text-xs font-mono">
              Type <span className="font-bold text-brand-600">CC-2026</span> or building name to search instantly...
            </div>
          ) : (
            <>
              {/* Complaints */}
              {filteredComplaints.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-brand-600" />
                    Complaints ({filteredComplaints.length})
                  </h4>
                  <div className="space-y-1.5">
                    {filteredComplaints.slice(0, 5).map((cmp) => (
                      <div
                        key={cmp.id}
                        onClick={() => {
                          onSelectComplaint(cmp);
                          onClose();
                        }}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 transition cursor-pointer group shadow-sm"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs text-brand-600 font-bold">{cmp.trackingNumber}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-white text-slate-700 border border-slate-200">
                              {cmp.category}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-brand-100 text-brand-700">
                              {cmp.priority}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-900">{cmp.title}</p>
                          <p className="text-[11px] text-slate-500">{cmp.buildingName} • {cmp.studentName}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Buildings */}
              {filteredBuildings.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-emerald-600" />
                    Campus Buildings ({filteredBuildings.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {filteredBuildings.map((b) => (
                      <div
                        key={b.id}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs"
                      >
                        <p className="font-bold text-slate-900">{b.name}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{b.activeIssuesCount} Active Issues • {b.healthScore}% Health</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Users */}
              {filteredUsers.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-600" />
                    Users & Personnel ({filteredUsers.length})
                  </h4>
                  <div className="space-y-1.5">
                    {filteredUsers.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover shadow-sm" />
                          <div>
                            <p className="font-semibold text-slate-900">{u.name}</p>
                            <p className="text-[11px] text-slate-500">{u.email}</p>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-white text-brand-700 border border-slate-200 font-bold">
                          {u.role.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>CampusCare AI Global Search</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
