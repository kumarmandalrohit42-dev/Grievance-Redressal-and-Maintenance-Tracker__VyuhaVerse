import React, { useState } from 'react';
import { 
  Sparkles, 
  GraduationCap, 
  Wrench, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('aarav.sharma@univ.edu.in');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const roles: { role: UserRole; title: string; desc: string; icon: any; color: string }[] = [
    { role: 'student', title: 'Student Portal', desc: 'File complaints & track SLA status', icon: GraduationCap, color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
    { role: 'technician', title: 'Technician Desk', desc: 'View dispatches & upload repair proof', icon: Wrench, color: 'text-amber-500 bg-amber-50 border-amber-200' },
    { role: 'dept_head', title: 'Department Head', desc: 'Manage triage & AI matchmaker', icon: Building2, color: 'text-brand-600 bg-brand-50 border-brand-200' },
    { role: 'admin', title: 'Admin Senate', desc: 'Campus analytics, heatmaps & audits', icon: ShieldCheck, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  ];

  const handleRoleSelect = (r: UserRole) => {
    setSelectedRole(r);
    if (r === 'student') setEmail('aarav.sharma@univ.edu.in');
    else if (r === 'technician') setEmail('suresh.plumbing@univ.edu.in');
    else if (r === 'dept_head') setEmail('meera.iyer@univ.edu.in');
    else if (r === 'admin') setEmail('admin.director@univ.edu.in');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, selectedRole);
    onLoginSuccess();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-slate-950 overflow-hidden font-sans">
      {/* Background Campus Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1920&auto=format&fit=crop&q=80')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/90 to-brand-950/60" />

      {/* Main Glassmorphism Container */}
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Welcome Branding (5 Columns) */}
        <div className="lg:col-span-5 space-y-6 text-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 p-0.5 shadow-xl shadow-brand-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-brand-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                CampusCare <span className="text-brand-400 font-extrabold">AI</span>
              </h1>
              <p className="text-xs text-slate-400 font-mono">University Grievance Redressal OS</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h2 className="text-3xl font-black text-white leading-tight">
              Smart Maintenance & SLA Management
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Enterprise university grievance redressal platform with real-time AI auto-triage, geospatial campus heatmaps, and automated SLA escalations.
            </p>
          </div>

          <div className="space-y-2 pt-2 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Real-time AI Categorization & Duplicate Detection</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Location QR Code reporting & Voice-to-Text</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Before & After Repair photo verification</span>
            </div>
          </div>
        </div>

        {/* Right Glass Card Login Form (7 Columns) */}
        <div className="lg:col-span-7 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Sign In to Campus Portal</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Select your access role to continue to dashboard</p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.role;
              return (
                <div
                  key={r.role}
                  onClick={() => handleRoleSelect(r.role)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-brand-50 border-brand-400 ring-2 ring-brand-500/20 shadow-md scale-[1.02]' 
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className={`p-2 rounded-xl border ${r.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                  </div>
                  <p className="text-xs font-bold text-slate-900">{r.title}</p>
                  <p className="text-[10px] text-slate-500 font-medium line-clamp-1 mt-0.5">{r.desc}</p>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Campus Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-medium">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset instructions sent to your campus email.'); }} className="text-brand-600 hover:underline font-bold">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Sign In to {roles.find(r => r.role === selectedRole)?.title}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
