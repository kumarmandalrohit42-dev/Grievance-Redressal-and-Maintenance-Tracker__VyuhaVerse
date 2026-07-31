import React, { useState, useEffect } from 'react';
import { 
  Building, 
  MapPin, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Navigation,
  Map as MapIcon,
  X,
  Flame
} from 'lucide-react';
import { store } from '../../services/store';
import { CampusBuilding, Complaint, User } from '../../types';

interface CampusMapProps {
  onSelectComplaint?: (complaint: Complaint) => void;
}

export const CampusMap: React.FC<CampusMapProps> = ({ onSelectComplaint }) => {
  const [buildings, setBuildings] = useState<CampusBuilding[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [techs, setTechs] = useState<User[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<CampusBuilding | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    const update = () => {
      setBuildings(store.getBuildings());
      setComplaints(store.getComplaints());
      setTechs(store.getUsers().filter(u => u.role === 'technician'));
    };
    update();
    return store.subscribe(update);
  }, []);

  const activeComplaints = complaints.filter(c => 
    c.status !== 'closed' && 
    c.status !== 'verified' &&
    (filterCategory === 'all' || c.category === filterCategory)
  );

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            Live Campus Complaint Heatmap & Geospatial Grid
          </h2>
          <p className="text-xs text-slate-400">
            Real-time complaint density nodes: 🟢 Low, 🟡 Moderate, 🔴 High Density.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {['all', 'Water Leakage', 'Electrical', 'Internet', 'Furniture'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterCategory === cat
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Issues' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Campus Map Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative min-h-[500px] rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl p-6 flex flex-col justify-between select-none">
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />

          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {activeComplaints.map((cmp) => {
              if (!cmp.technicianId) return null;
              const tech = techs.find(t => t.id === cmp.technicianId);
              const bldg = buildings.find(b => b.id === cmp.buildingId);
              if (!tech || !bldg) return null;

              return (
                <g key={`vector-${cmp.id}`}>
                  <line
                    x1="15%"
                    y1="80%"
                    x2={`${bldg.x}%`}
                    y2={`${bldg.y}%`}
                    stroke={cmp.priority === 'P1_CRITICAL' ? '#f43f5e' : '#6366f1'}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className="animate-pulse"
                  />
                  <circle cx={`${bldg.x}%`} cy={`${bldg.y}%`} r="6" fill="#6366f1" opacity="0.3" />
                </g>
              );
            })}
          </svg>

          {/* Building Heatmap Nodes */}
          <div className="relative z-20 w-full h-full min-h-[440px]">
            {buildings.map((bldg) => {
              const bldgIssues = activeComplaints.filter(c => c.buildingId === bldg.id);
              const isSelected = selectedBuilding?.id === bldg.id;
              const count = bldgIssues.length;

              // Density color
              let densityColor = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
              if (count >= 4) {
                densityColor = 'bg-rose-950/90 text-rose-200 border-rose-500/60';
              } else if (count >= 2) {
                densityColor = 'bg-amber-950/80 text-amber-300 border-amber-500/40';
              }

              return (
                <div
                  key={bldg.id}
                  style={{ left: `${bldg.x}%`, top: `${bldg.y}%` }}
                  onClick={() => setSelectedBuilding(bldg)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group z-20"
                >
                  {count >= 4 && (
                    <span className="absolute inset-0 rounded-2xl bg-rose-500/40 animate-ping" />
                  )}

                  <div className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl backdrop-blur-md border shadow-xl transition transform group-hover:scale-105 ${
                    isSelected ? 'bg-brand-600 text-white border-brand-400 ring-4 ring-brand-500/30' : densityColor
                  }`}>
                    <div className={`p-1.5 rounded-xl ${count >= 4 ? 'bg-rose-500 text-white' : count >= 2 ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'}`}>
                      <Building className="w-4 h-4 font-bold" />
                    </div>
                    <div>
                      <p className="text-xs font-bold whitespace-nowrap">{bldg.name.split(' ')[0]}</p>
                      <div className="flex items-center gap-2 text-[10px] opacity-80 font-mono">
                        <span>{bldg.healthScore}% Health</span>
                        {count > 0 && (
                          <span className={`px-1.5 rounded font-bold ${count >= 4 ? 'bg-rose-500/30 text-rose-300' : 'bg-amber-500/30 text-amber-300'}`}>
                            {count} Issues
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Technician Location Pins */}
            {techs.map((tech) => (
              <div
                key={tech.id}
                style={{ left: '15%', top: '80%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30 flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-indigo-950/90 border border-indigo-500/50 text-indigo-200 shadow-xl"
                title={`Active Tech: ${tech.name}`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <Wrench className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[11px] font-bold font-mono">{tech.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-400" /> 🟢 Low (0-1 Issues)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400" /> 🟡 Moderate (2-3)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500" /> 🔴 High Hotspot (4+)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-indigo-500" /> Dispatch Route</span>
            </div>
            <span>University Campus Map Nodes</span>
          </div>
        </div>

        {/* Building Details Sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 flex flex-col justify-between">
          {selectedBuilding ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    {selectedBuilding.code}
                  </span>
                  <h3 className="text-base font-bold text-slate-100 mt-1">{selectedBuilding.name}</h3>
                  <p className="text-xs text-slate-400">{selectedBuilding.totalRooms} Total Rooms</p>
                </div>
                <button onClick={() => setSelectedBuilding(null)} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300">Building Health Index</span>
                  <span className={`font-mono ${selectedBuilding.healthScore > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {selectedBuilding.healthScore}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      selectedBuilding.healthScore > 80 ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                    style={{ width: `${selectedBuilding.healthScore}%` }}
                  />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Active Building Complaints ({complaints.filter(c => c.buildingId === selectedBuilding.id && c.status !== 'closed').length})
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {complaints
                    .filter(c => c.buildingId === selectedBuilding.id && c.status !== 'closed')
                    .map((cmp) => (
                      <div
                        key={cmp.id}
                        onClick={() => onSelectComplaint && onSelectComplaint(cmp)}
                        className="p-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-brand-500/40 cursor-pointer transition space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-brand-400 font-bold">{cmp.trackingNumber}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            {cmp.priority}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-200">{cmp.title}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-3">
              <Building className="w-12 h-12 text-slate-700 animate-bounce" />
              <p className="text-xs">Click any building node on the campus map to inspect health score and active maintenance complaints.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
