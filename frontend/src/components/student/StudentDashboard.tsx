import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Star, 
  MessageSquare, 
  FileText,
  MapPin,
  Send,
  ThumbsUp,
  QrCode,
  Mic,
  RotateCcw,
  Smile,
  Meh,
  Frown,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { store, generateTrackingNumber, generateId } from '../../services/store';
import { analyzeComplaintAI, AIAnalysisResult } from '../../services/ai';
import { Complaint, ComplaintCategory, Attachment, PriorityLevel, QRCodeLocation } from '../../types';
import { SLATimer } from '../common/SLATimer';
import { FileUpload } from '../common/FileUpload';
import { VoiceRecorder } from '../common/VoiceRecorder';
import { QRCodeModal } from '../common/QRCodeModal';
import { GamificationBadge } from '../common/GamificationBadge';

interface StudentDashboardProps {
  onOpenChat: (complaint: Complaint) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onOpenChat,
  activeTab,
  setActiveTab,
}) => {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [allComplaints, setAllComplaints] = useState<Complaint[]>([]);
  const [buildings, setBuildings] = useState(store.getBuildings());

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [buildingId, setBuildingId] = useState(buildings[0]?.id || 'bldg-hostel-a');
  const [floor, setFloor] = useState('3rd Floor');
  const [roomNumber, setRoomNumber] = useState('304');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // Rating & Rejection Modal
  const [ratingTarget, setRatingTarget] = useState<Complaint | null>(null);
  const [stars, setStars] = useState(5);
  const [emojiChoice, setEmojiChoice] = useState<'happy' | 'neutral' | 'unhappy'>('happy');
  const [feedback, setFeedback] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    const update = () => {
      const all = store.getComplaints();
      setAllComplaints(all);
      setComplaints(all.filter(c => c.studentId === currentUser.id));
      setBuildings(store.getBuildings());
    };
    update();
    return store.subscribe(update);
  }, [currentUser.id]);

  useEffect(() => {
    if (!title || title.length < 4) {
      setAiResult(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsAnalyzing(true);
      const selectedBldgObj = buildings.find(b => b.id === buildingId);
      const res = await analyzeComplaintAI(
        title,
        description,
        selectedBldgObj?.name || '',
        allComplaints
      );
      setAiResult(res);
      setIsAnalyzing(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [title, description, buildingId, buildings, allComplaints]);

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const bldgObj = buildings.find(b => b.id === buildingId);
    const category: ComplaintCategory = aiResult?.category || 'Others';
    const priority: PriorityLevel = aiResult?.priority || 'P3_MEDIUM';
    const deptId = aiResult?.suggestedDepartmentId || 'dept-civil';
    const deptName = aiResult?.suggestedDepartmentName || 'Sanitation, Water & Estate Care';

    const responseHours = priority === 'P1_CRITICAL' ? 0.5 : priority === 'P2_HIGH' ? 1 : 2;
    const resHours = priority === 'P1_CRITICAL' ? 2 : priority === 'P2_HIGH' ? 6 : 24;

    const now = new Date();
    const respDeadline = new Date(now.getTime() + responseHours * 60 * 60 * 1000).toISOString();
    const resDeadline = new Date(now.getTime() + resHours * 60 * 60 * 1000).toISOString();

    const newCmp: Complaint = {
      id: generateId('CMP'),
      trackingNumber: generateTrackingNumber(),
      title,
      description,
      category,
      subcategory: aiResult?.subcategory || 'General Issue',
      priority,
      status: 'categorized',
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      buildingId,
      buildingName: bldgObj?.name || 'Aryabhata Hostel',
      floor,
      roomNumber,
      attachments,
      departmentId: deptId,
      departmentName: deptName,
      submittedAt: now.toISOString(),
      responseDeadline: respDeadline,
      resolutionDeadline: resDeadline,
      aiSuggestedCategory: category,
      aiConfidence: aiResult?.confidence || 0.95,
      aiSummary: aiResult?.summary || title,
      sentiment: aiResult?.sentiment || 'Neutral',
      duplicateOfId: aiResult?.duplicateId,
      upvotesCount: 1,
      upvotedUserIds: [currentUser.id],
      timeline: [
        {
          id: generateId('TL'),
          status: 'submitted',
          title: 'Complaint Submitted',
          description: 'Logged by student.',
          timestamp: now.toISOString(),
          actorName: currentUser.name,
          actorRole: 'student'
        },
        {
          id: generateId('TL'),
          status: 'categorized',
          title: 'AI Auto-Triage',
          description: `AI assigned category "${category}" with priority "${priority}". Assigned to ${deptName}.`,
          timestamp: new Date(now.getTime() + 1000).toISOString(),
          actorName: 'CampusCare AI Engine',
          actorRole: 'admin'
        }
      ]
    };

    store.addComplaint(newCmp);

    setTitle('');
    setDescription('');
    setAttachments([]);
    setAiResult(null);
    setActiveTab('dashboard');
  };

  const handleQRSelect = (loc: QRCodeLocation) => {
    setBuildingId(loc.buildingId);
    setFloor(loc.floor);
    setRoomNumber(loc.roomNumber);
  };

  const activeCount = complaints.filter(c => c.status !== 'closed' && c.status !== 'verified').length;
  const resolvedCount = complaints.filter(c => c.status === 'closed' || c.status === 'verified').length;

  const duplicateComplaintObj = aiResult?.duplicateId ? allComplaints.find(c => c.id === aiResult.duplicateId) : null;

  return (
    <div className="space-y-6">
      {/* User Stats & Badges Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shadow-md" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100">{currentUser.name}</h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                120 Student Points
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              <GamificationBadge name="First Reporter" />
              <GamificationBadge name="Campus Helper" />
            </div>
          </div>
        </div>

        <div className="flex gap-4 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-850 text-center">
            <span className="text-[10px] text-slate-500 block">TOTAL FILED</span>
            <strong className="text-slate-100 text-lg font-extrabold">{complaints.length}</strong>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/20 text-center">
            <span className="text-[10px] text-amber-400 block">ACTIVE</span>
            <strong className="text-amber-300 text-lg font-extrabold">{activeCount}</strong>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/20 text-center">
            <span className="text-[10px] text-emerald-400 block">RESOLVED</span>
            <strong className="text-emerald-300 text-lg font-extrabold">{resolvedCount}</strong>
          </div>
        </div>
      </div>

      {/* REGISTRATION WIZARD TAB */}
      {activeTab === 'new_complaint' ? (
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                <PlusCircle className="w-6 h-6 text-brand-400" />
                Register Campus Grievance
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Submit maintenance issues. AI auto-categorizes and checks duplicate reports.
              </p>
            </div>

            {/* Scan QR Code Button */}
            <button
              type="button"
              onClick={() => setIsQRModalOpen(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-bold rounded-2xl transition flex items-center gap-2 shadow-md"
            >
              <QrCode className="w-4 h-4 text-brand-400" />
              <span>Scan QR Code</span>
            </button>
          </div>

          <form onSubmit={handleSubmitComplaint} className="space-y-5">
            {/* Voice Recording Widget */}
            <VoiceRecorder onTranscribe={(text) => {
              setTitle(text.substring(0, 60));
              setDescription(text);
            }} />

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Issue Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Severe water leakage near circuit breaker box"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* AI Real-time Triage & Duplicate Warning */}
            {(isAnalyzing || aiResult) && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-brand-500/30 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-bold text-brand-400">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    AI Triage Assistant Analysis
                  </span>
                  {aiResult && (
                    <span className="font-mono text-[10px] text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {(aiResult.confidence * 100).toFixed(0)}% Confidence Match
                    </span>
                  )}
                </div>

                {isAnalyzing ? (
                  <p className="text-xs text-slate-400 font-mono">Analyzing complaint text...</p>
                ) : (
                  aiResult && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Category:</span>
                        <strong className="text-brand-300">{aiResult.category}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Priority:</span>
                        <strong className="text-rose-400">{aiResult.priority}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Target Dept:</span>
                        <strong className="text-slate-200">{aiResult.suggestedDepartmentName.split(' ')[0]}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Est. Resolution:</span>
                        <strong className="text-emerald-400">{aiResult.estimatedHours} Hours</strong>
                      </div>
                    </div>
                  )
                )}

                {/* Duplicate Found - Community Upvoting Option */}
                {duplicateComplaintObj && (
                  <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-2 text-xs text-amber-200">
                    <div className="flex items-center justify-between font-bold text-amber-300">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        Matching Complaint Already Logged! ({duplicateComplaintObj.upvotesCount || 1} Students Affected)
                      </span>
                      <span className="font-mono text-xs">{duplicateComplaintObj.trackingNumber}</span>
                    </div>
                    <p className="text-slate-300">{duplicateComplaintObj.title}</p>
                    
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Join existing ticket to boost priority instead of creating duplicate:</span>
                      <button
                        type="button"
                        onClick={() => {
                          store.upvoteComplaint(duplicateComplaintObj.id, currentUser.id, currentUser.name);
                          setActiveTab('dashboard');
                        }}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>I Am Affected Too (+1 Upvote)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Detailed Description *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe the exact problem, exact location details, and any safety hazards..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 custom-scrollbar"
              />
            </div>

            {/* Location Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Campus Building *</label>
                <select
                  value={buildingId}
                  onChange={(e) => setBuildingId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200"
                >
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Floor Level</label>
                <input
                  type="text"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Room Number</label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200"
                />
              </div>
            </div>

            {/* File Upload Component */}
            <FileUpload
              attachments={attachments}
              onUpload={(newAtts) => setAttachments([...attachments, ...newAtts])}
              onRemove={(id) => setAttachments(attachments.filter(a => a.id !== id))}
            />

            {/* Submit Actions */}
            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-500/25 transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Grievance</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* COMPLAINT LIST */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100">My Registered Complaints</h3>
            <button
              onClick={() => setActiveTab('new_complaint')}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-xl transition shadow-lg shadow-brand-500/20 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Ticket</span>
            </button>
          </div>

          <div className="space-y-3">
            {complaints.length === 0 ? (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                <FileText className="w-12 h-12 text-slate-700 mx-auto" />
                <p className="text-sm text-slate-400">You have no active complaints registered.</p>
              </div>
            ) : (
              complaints.map((cmp) => (
                <div
                  key={cmp.id}
                  className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-4 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-bold text-brand-400">{cmp.trackingNumber}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/20">
                        {cmp.category}
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                        cmp.priority === 'P1_CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {cmp.priority}
                      </span>
                      {cmp.upvotesCount && cmp.upvotesCount > 1 && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          {cmp.upvotesCount} Affected
                        </span>
                      )}
                    </div>

                    <SLATimer
                      resolutionDeadline={cmp.resolutionDeadline}
                      priority={cmp.priority}
                      status={cmp.status}
                      compact
                    />
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-100">{cmp.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{cmp.description}</p>
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-brand-400" />
                      {cmp.buildingName} • Floor {cmp.floor || '3'} • Room {cmp.roomNumber || '304'}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-850">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenChat(cmp)}
                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-medium text-xs rounded-xl transition flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-brand-400" />
                        <span>Chat ({cmp.technicianName || 'Assigned Tech'})</span>
                      </button>

                      {/* Upvote Button for other students */}
                      <button
                        onClick={() => store.upvoteComplaint(cmp.id, currentUser.id, currentUser.name)}
                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-amber-300 font-medium text-xs rounded-xl transition flex items-center gap-1.5"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Affected Too ({cmp.upvotesCount || 1})</span>
                      </button>
                    </div>

                    {(cmp.status === 'proof_uploaded' || cmp.status === 'in_progress') && (
                      <button
                        onClick={() => setRatingTarget(cmp)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verify & Rate Resolution</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* QR CODE LOCATION SCANNER MODAL */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        onSelectLocation={handleQRSelect}
      />

      {/* RATING & REJECTION MODAL */}
      {ratingTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              Verify Resolution & Rate Technician
            </h3>

            {!isRejecting ? (
              <>
                <p className="text-xs text-slate-400">
                  Rate your satisfaction for ticket <strong className="font-mono text-brand-400">{ratingTarget.trackingNumber}</strong>.
                </p>

                {/* Emojis */}
                <div className="flex items-center justify-center gap-4 py-1">
                  <button
                    type="button"
                    onClick={() => { setEmojiChoice('happy'); setStars(5); }}
                    className={`p-3 rounded-2xl border transition ${
                      emojiChoice === 'happy' ? 'bg-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500 scale-110' : 'bg-slate-800 border-slate-700'
                    }`}
                  >
                    <Smile className="w-8 h-8 text-emerald-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEmojiChoice('neutral'); setStars(3); }}
                    className={`p-3 rounded-2xl border transition ${
                      emojiChoice === 'neutral' ? 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500 scale-110' : 'bg-slate-800 border-slate-700'
                    }`}
                  >
                    <Meh className="w-8 h-8 text-amber-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEmojiChoice('unhappy'); setStars(1); }}
                    className={`p-3 rounded-2xl border transition ${
                      emojiChoice === 'unhappy' ? 'bg-rose-500/20 border-rose-500 ring-2 ring-rose-500 scale-110' : 'bg-slate-800 border-slate-700'
                    }`}
                  >
                    <Frown className="w-8 h-8 text-rose-400" />
                  </button>
                </div>

                <textarea
                  rows={3}
                  placeholder="Leave feedback on technician speed and quality..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />

                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setRatingTarget(null)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-400 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        store.rateComplaint(ratingTarget.id, stars, feedback, emojiChoice);
                        setRatingTarget(null);
                      }}
                      className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-500/20"
                    >
                      Accept & Close Ticket
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsRejecting(true)}
                    className="text-rose-400 hover:underline text-xs font-semibold py-1 text-center"
                  >
                    Issue Persists? Reject Repair & Reopen Ticket
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-rose-400 font-semibold">
                  Provide reason why issue persists for ticket <strong className="font-mono">{ratingTarget.trackingNumber}</strong>:
                </p>
                <textarea
                  rows={3}
                  placeholder="e.g. Water is still dripping from pipe..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsRejecting(false)}
                    className="flex-1 py-2 rounded-xl border border-slate-800 text-slate-400 text-xs"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      store.rejectResolution(ratingTarget.id, rejectionReason, currentUser.name);
                      setRatingTarget(null);
                      setIsRejecting(false);
                    }}
                    className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl"
                  >
                    Confirm Reopen Ticket
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
