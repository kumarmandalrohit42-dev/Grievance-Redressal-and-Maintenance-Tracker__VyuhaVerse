import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  BarChart3, 
  FileSpreadsheet, 
  FileText, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  Search,
  QrCode,
  Trophy,
  Award,
  Users
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { store } from '../../services/store';
import { calculateCampusMetrics } from '../../services/ai';
import { Complaint, AuditLog, PredictiveInsight, CampusBuilding, User } from '../../types';
import { QRCodeModal, SAMPLE_QR_LOCATIONS } from '../common/QRCodeModal';
import { GamificationBadge } from '../common/GamificationBadge';

export const AdminDashboard: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [buildings, setBuildings] = useState<CampusBuilding[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [logFilter, setLogFilter] = useState('');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      setComplaints(store.getComplaints());
      setBuildings(store.getBuildings());
      setAuditLogs(store.getAuditLogs());
      setInsights(store.getPredictiveInsights());
      setUsers(store.getUsers());
    };
    update();
    return store.subscribe(update);
  }, []);

  const metrics = calculateCampusMetrics(complaints, buildings);

  const categoryCounts: Record<string, number> = {};
  complaints.forEach(c => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  const chartData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

  const technicians = users.filter(u => u.role === 'technician').sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const exportPDFReport = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('CampusCare AI - University Executive Maintenance Report', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Campus Health Score: ${metrics.healthScore}% | SLA Compliance: ${metrics.slaCompliancePercentage}%`, 14, 34);

    const tableData = complaints.map(c => [
      c.trackingNumber,
      c.title.substring(0, 30),
      c.category,
      c.priority,
      c.buildingName,
      c.status.toUpperCase()
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Tracking #', 'Title', 'Category', 'Priority', 'Building', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] }
    });

    doc.save(`CampusCare_Executive_Report_${new Date().toISOString().substring(0, 10)}.pdf`);
  };

  const exportExcelReport = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      complaints.map(c => ({
        'Tracking Number': c.trackingNumber,
        'Title': c.title,
        'Category': c.category,
        'Priority': c.priority,
        'Status': c.status,
        'Student Name': c.studentName,
        'Building': c.buildingName,
        'Floor/Room': `${c.floor || ''} ${c.roomNumber || ''}`,
        'Submitted At': c.submittedAt,
        'Technician': c.technicianName || 'N/A',
        'Resolution Notes': c.resolutionNotes || 'N/A'
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Campus Complaints');
    XLSX.writeFile(workbook, `CampusCare_Data_Export_${new Date().toISOString().substring(0, 10)}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-brand-400" />
            Admin Senate Control Center & Campus Health
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            System-wide SLA audits, QR Code dispatches, and executive report exports.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-indigo-500/20 flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4" />
            <span>Manage Location QR Codes</span>
          </button>
          <button
            onClick={exportPDFReport}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-brand-500/20 flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={exportExcelReport}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export XLSX</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>CAMPUS HEALTH SCORE</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">{metrics.healthScore}%</p>
          <p className="text-[11px] text-slate-400">Aggregated across all 7 buildings</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>SLA COMPLIANCE</span>
            <Clock className="w-4 h-4 text-brand-400" />
          </div>
          <p className="text-3xl font-extrabold text-brand-400">{metrics.slaCompliancePercentage}%</p>
          <p className="text-[11px] text-slate-400">Target response &lt; 30 mins</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>AVG RESOLUTION VELOCITY</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold text-indigo-300">{metrics.avgResolutionHours} hrs</p>
          <p className="text-[11px] text-slate-400">Industry benchmark: 8 hrs</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>SATISFACTION RATING</span>
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400">{metrics.studentSatisfactionRating} / 5.0</p>
          <p className="text-[11px] text-slate-400">Based on verified student reviews</p>
        </div>
      </div>

      {/* Analytics & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-400" />
            Complaint Category Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Technician Leaderboard */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Technician Gamification Leaderboard
          </h3>
          <div className="space-y-3">
            {technicians.map((tech, rank) => (
              <div
                key={tech.id}
                className="p-3 rounded-2xl bg-slate-850 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    rank === 0 ? 'bg-amber-400 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-400'
                  }`}>
                    #{rank + 1}
                  </span>
                  <img src={tech.avatar} alt={tech.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-bold text-slate-200">{tech.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{tech.completedJobs} Jobs Completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-400">{tech.rating}★</span>
                  <div className="mt-0.5">
                    <GamificationBadge name={rank === 0 ? 'Top Performer' : 'Fast Resolver'} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Audit Log Inspector Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            System Security Audit Logs
          </h3>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Filter audit logs..."
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">TIMESTAMP</th>
                <th className="py-2.5 px-3">ACTOR</th>
                <th className="py-2.5 px-3">ACTION</th>
                <th className="py-2.5 px-3">TARGET</th>
                <th className="py-2.5 px-3">DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {auditLogs
                .filter(l => l.actorName.toLowerCase().includes(logFilter.toLowerCase()) || l.action.toLowerCase().includes(logFilter.toLowerCase()))
                .map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850/50 transition">
                    <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-3 px-3 font-semibold text-slate-200">{log.actorName} ({log.actorRole})</td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">{log.target}</td>
                    <td className="py-3 px-3 text-slate-400 max-w-xs truncate">{log.details}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />
    </div>
  );
};
