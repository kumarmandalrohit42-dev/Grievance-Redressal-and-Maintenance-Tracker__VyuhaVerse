import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Upload, 
  Navigation, 
  Star, 
  MapPin, 
  MessageSquare,
  Eye,
  Award,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/store';
import { Complaint, Attachment } from '../../types';
import { SLATimer } from '../common/SLATimer';
import { FileUpload } from '../common/FileUpload';
import { GamificationBadge } from '../common/GamificationBadge';

interface TechnicianDashboardProps {
  onOpenChat: (complaint: Complaint) => void;
  setActiveTab: (tab: string) => void;
}

export const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({
  onOpenChat,
  setActiveTab,
}) => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Complaint[]>([]);
  const [proofTarget, setProofTarget] = useState<Complaint | null>(null);
  const [proofAttachments, setProofAttachments] = useState<Attachment[]>([]);
  const [notes, setNotes] = useState('');
  const [declineTarget, setDeclineTarget] = useState<Complaint | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [compareTarget, setCompareTarget] = useState<Complaint | null>(null);

  useEffect(() => {
    const update = () => {
      const all = store.getComplaints();
      const techTasks = all.filter(c => c.technicianId === currentUser.id || c.departmentId === currentUser.departmentId);
      setTasks(techTasks);
    };
    update();
    return store.subscribe(update);
  }, [currentUser.id, currentUser.departmentId]);

  const handleAccept = (task: Complaint) => {
    store.updateComplaintStatus(task.id, 'accepted', currentUser.name, 'technician', 'Technician accepted job dispatch.');
  };

  const handleStartWork = (task: Complaint) => {
    store.updateComplaintStatus(task.id, 'in_progress', currentUser.name, 'technician', 'Technician arrived on site and started work.');
  };

  const handleCompleteWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofTarget) return;

    store.updateComplaintStatus(
      proofTarget.id, 
      'proof_uploaded', 
      currentUser.name, 
      'technician', 
      notes || 'Work completed. Verification proof uploaded.',
      proofAttachments
    );

    setProofTarget(null);
    setProofAttachments([]);
    setNotes('');
  };

  const handleDeclineWork = () => {
    if (!declineTarget) return;
    store.updateComplaintStatus(
      declineTarget.id, 
      'rejected', 
      currentUser.name, 
      'technician', 
      `Job declined: ${declineReason || 'Required parts out of stock'}`
    );
    setDeclineTarget(null);
    setDeclineReason('');
  };

  const activeJobs = tasks.filter(t => t.status === 'accepted' || t.status === 'in_progress' || t.status === 'tech_assigned');
  const completedJobs = tasks.filter(t => t.status === 'proof_uploaded' || t.status === 'verified' || t.status === 'closed');

  return (
    <div className="space-y-6">
      {/* Stats & Gamification Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 font-mono">TODAY'S DISPATCHES</p>
          <p className="text-2xl font-extrabold text-slate-100">{tasks.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-1">
          <p className="text-xs text-amber-400 font-mono">ACTIVE DISPATCHES</p>
          <p className="text-2xl font-extrabold text-amber-300">{activeJobs.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-1">
          <p className="text-xs text-emerald-400 font-mono">COMPLETED JOBS</p>
          <p className="text-2xl font-extrabold text-emerald-300">{completedJobs.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-indigo-400 font-mono">
            <span>MY SCORE</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-indigo-300">{currentUser.rating || 4.9}★</p>
          <div className="flex gap-1">
            <GamificationBadge name="Fast Resolver" />
            <GamificationBadge name="SLA Champion" />
          </div>
        </div>
      </div>

      {/* Task Queue */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-brand-400" />
          Technician Action Queue
        </h3>

        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-500 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500/40 mx-auto" />
              <p className="text-sm">All tasks cleared! No pending maintenance requests.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-brand-400">{task.trackingNumber}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-800 text-slate-300">
                      {task.category}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                      task.priority === 'P1_CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {task.priority}
                    </span>
                  </div>

                  <SLATimer
                    resolutionDeadline={task.resolutionDeadline}
                    priority={task.priority}
                    status={task.status}
                    compact
                  />
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-100">{task.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{task.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-3 font-mono">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <MapPin className="w-3.5 h-3.5" />
                      {task.buildingName} (Floor {task.floor || '3'}, Room {task.roomNumber || '304'})
                    </span>
                    <span>Student: <strong>{task.studentName}</strong></span>
                  </div>
                </div>

                {/* Task Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-850">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenChat(task)}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-brand-400" />
                      <span>Chat Student</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('map')}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Navigate Map</span>
                    </button>
                    {task.attachments.length > 0 && task.proofAttachments && task.proofAttachments.length > 0 && (
                      <button
                        onClick={() => setCompareTarget(task)}
                        className="px-3.5 py-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-brand-400" />
                        <span>Before / After Compare</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {task.status === 'tech_assigned' && (
                      <>
                        <button
                          onClick={() => setDeclineTarget(task)}
                          className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl border border-rose-500/20 transition"
                        >
                          Reject Job
                        </button>
                        <button
                          onClick={() => handleAccept(task)}
                          className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/20 transition"
                        >
                          Accept Work Dispatch
                        </button>
                      </>
                    )}

                    {task.status === 'accepted' && (
                      <button
                        onClick={() => handleStartWork(task)}
                        className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Start Work On Site</span>
                      </button>
                    )}

                    {task.status === 'in_progress' && (
                      <button
                        onClick={() => setProofTarget(task)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Proof & Mark Resolved</span>
                      </button>
                    )}

                    {(task.status === 'proof_uploaded' || task.status === 'verified' || task.status === 'closed') && (
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4" />
                        Work Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* PROOF MODAL */}
      {proofTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleCompleteWork} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-400" />
              Upload Work Completion Proof
            </h3>

            <FileUpload
              attachments={proofAttachments}
              onUpload={(atts) => setProofAttachments([...proofAttachments, ...atts])}
              onRemove={(id) => setProofAttachments(proofAttachments.filter(a => a.id !== id))}
              label="Technician Verification Photo / Doc"
            />

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Technician Resolution Notes *</label>
              <textarea
                required
                rows={3}
                placeholder="Describe parts replaced, tests conducted..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setProofTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-400 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20"
              >
                Submit Proof & Resolve
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BEFORE & AFTER SIDE-BY-SIDE MODAL */}
      {compareTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Eye className="w-5 h-5 text-brand-400" />
                Before & After Repair Comparison
              </h3>
              <button
                onClick={() => setCompareTarget(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs"
              >
                Close Comparison
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2 text-center">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">BEFORE (Reported Issue)</span>
                <img
                  src={compareTarget.attachments[0]?.url || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80'}
                  alt="Before Repair"
                  className="w-full h-48 object-cover rounded-xl border border-slate-800"
                />
              </div>

              <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2 text-center">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">AFTER (Technician Resolution)</span>
                <img
                  src={compareTarget.proofAttachments?.[0]?.url || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80'}
                  alt="After Repair"
                  className="w-full h-48 object-cover rounded-xl border border-slate-800"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
