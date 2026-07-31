import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  UserCheck, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Wrench,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/store';
import { rankTechniciansForComplaint } from '../../services/ai';
import { Complaint, User } from '../../types';
import { SLATimer } from '../common/SLATimer';

interface DepartmentDashboardProps {
  onOpenChat: (complaint: Complaint) => void;
}

export const DepartmentDashboard: React.FC<DepartmentDashboardProps> = ({ onOpenChat }) => {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [techs, setTechs] = useState<User[]>([]);
  const [selectedTask, setSelectedTask] = useState<Complaint | null>(null);
  const [escalateReason, setEscalateReason] = useState('');
  const [showEscalateModal, setShowEscalateModal] = useState<Complaint | null>(null);

  useEffect(() => {
    const update = () => {
      const all = store.getComplaints();
      setComplaints(all.filter(c => c.departmentId === currentUser.departmentId || currentUser.role === 'admin'));
      setTechs(store.getUsers().filter(u => u.role === 'technician'));
    };
    update();
    return store.subscribe(update);
  }, [currentUser.departmentId, currentUser.role]);

  const openTickets = complaints.filter(c => c.status !== 'closed' && c.status !== 'verified');
  const criticalTickets = complaints.filter(c => c.priority === 'P1_CRITICAL' && c.status !== 'closed');
  const unassignedTickets = complaints.filter(c => !c.technicianId && c.status !== 'closed');

  const handleEscalate = () => {
    if (!showEscalateModal) return;
    store.escalateComplaint(
      showEscalateModal.id, 
      escalateReason || 'Department Head Priority Override', 
      currentUser.name, 
      'dept_head'
    );
    setShowEscalateModal(null);
    setEscalateReason('');
  };

  return (
    <div className="space-y-6">
      {/* Department Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs text-slate-500 font-mono font-bold">DEPT TICKET QUEUE</p>
          <p className="text-3xl font-extrabold text-slate-900">{openTickets.length}</p>
        </div>
        <div className="p-5 rounded-3xl bg-red-50/50 border border-red-200 shadow-sm space-y-1">
          <p className="text-xs text-red-700 font-mono font-bold">P1 EMERGENCY TICKETS</p>
          <p className="text-3xl font-extrabold text-red-700">{criticalTickets.length}</p>
        </div>
        <div className="p-5 rounded-3xl bg-amber-50/50 border border-amber-200 shadow-sm space-y-1">
          <p className="text-xs text-amber-700 font-mono font-bold">UNASSIGNED TICKETS</p>
          <p className="text-3xl font-extrabold text-amber-600">{unassignedTickets.length}</p>
        </div>
        <div className="p-5 rounded-3xl bg-emerald-50/50 border border-emerald-200 shadow-sm space-y-1">
          <p className="text-xs text-emerald-700 font-mono font-bold">SLA COMPLIANCE RATE</p>
          <p className="text-3xl font-extrabold text-emerald-600">94.5%</p>
        </div>
      </div>

      {/* Triage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-600" />
              Department Complaint Triage Queue
            </span>
            <span className="text-xs text-slate-500 font-mono font-semibold">{complaints.length} Total</span>
          </h3>

          <div className="space-y-3">
            {complaints.map((cmp) => {
              const isSelected = selectedTask?.id === cmp.id;
              return (
                <div
                  key={cmp.id}
                  onClick={() => setSelectedTask(cmp)}
                  className={`p-5 rounded-3xl border transition cursor-pointer space-y-3 shadow-sm ${
                    isSelected 
                      ? 'bg-brand-50/60 border-brand-300 ring-2 ring-brand-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-brand-600">{cmp.trackingNumber}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {cmp.category}
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                        cmp.priority === 'P1_CRITICAL' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {cmp.priority}
                      </span>
                    </div>

                    <SLATimer
                      resolutionDeadline={cmp.resolutionDeadline}
                      priority={cmp.priority}
                      status={cmp.status}
                      compact
                    />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{cmp.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 font-mono font-semibold">
                      Location: {cmp.buildingName} • Room {cmp.roomNumber || '304'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 font-medium">
                    <span>
                      Technician: <strong className="text-slate-800 font-bold">{cmp.technicianName || 'Unassigned'}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowEscalateModal(cmp);
                      }}
                      className="text-red-600 hover:underline font-mono text-[11px] font-bold flex items-center gap-1"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Escalate Priority
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Matchmaker Panel */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            AI Technician Matchmaker Matrix
          </h3>

          {selectedTask ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1 font-medium">
                <span className="font-mono text-brand-600 font-extrabold">{selectedTask.trackingNumber}</span>
                <p className="font-bold text-slate-900">{selectedTask.title}</p>
                <p className="text-[11px] text-slate-500">Category: {selectedTask.category} • Building: {selectedTask.buildingName}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Ranked Available Technicians
                </h4>

                {rankTechniciansForComplaint(selectedTask, techs).map(({ technician, score, reason }) => (
                  <div
                    key={technician.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-300 space-y-2 transition shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={technician.avatar} alt={technician.name} className="w-8 h-8 rounded-full object-cover shadow-xs" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{technician.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono font-semibold">{technician.rating}★ ({technician.completedJobs} Jobs)</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-700 px-2 py-0.5 rounded bg-emerald-100 border border-emerald-200">
                        {score}% Match
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 font-mono leading-tight">{reason}</p>

                    <button
                      onClick={() => {
                        store.assignTechnician(selectedTask.id, technician.id, currentUser.name);
                        setSelectedTask(null);
                      }}
                      className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/20"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Dispatch {technician.name.split(' ')[0]}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <Wrench className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-semibold">Select any ticket from the triage queue to evaluate AI recommended technicians and dispatch jobs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
