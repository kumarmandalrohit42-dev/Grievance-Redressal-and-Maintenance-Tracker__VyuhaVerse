import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { PriorityLevel } from '../../types';

interface SLATimerProps {
  responseDeadline?: string;
  resolutionDeadline: string;
  priority: PriorityLevel;
  status: string;
  compact?: boolean;
}

export const SLATimer: React.FC<SLATimerProps> = ({
  resolutionDeadline,
  priority,
  status,
  compact = false,
}) => {
  const [timeLeftMs, setTimeLeftMs] = useState<number>(0);
  const [isOverdue, setIsOverdue] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<number>(100);

  const isCompleted = status === 'resolved' || status === 'closed' || status === 'verified';

  useEffect(() => {
    if (isCompleted) return;

    const calculate = () => {
      const target = new Date(resolutionDeadline).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setIsOverdue(true);
        setTimeLeftMs(Math.abs(diff));
        setPercentage(0);
      } else {
        setIsOverdue(false);
        setTimeLeftMs(diff);

        const totalDurationHours = priority === 'P1_CRITICAL' ? 2 : priority === 'P2_HIGH' ? 6 : priority === 'P3_MEDIUM' ? 24 : 48;
        const totalMs = totalDurationHours * 60 * 60 * 1000;
        const pct = Math.max(0, Math.min(100, (diff / totalMs) * 100));
        setPercentage(pct);
      }
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [resolutionDeadline, isCompleted, priority]);

  if (isCompleted) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        SLA Fulfilled
      </span>
    );
  }

  const totalSec = Math.floor(timeLeftMs / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formattedTime = `${hours > 0 ? `${hours}h ` : ''}${pad(minutes)}m ${pad(seconds)}s`;

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium shadow-sm ${
        isOverdue 
          ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse' 
          : percentage < 25 
          ? 'bg-amber-50 text-amber-700 border border-amber-200' 
          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      }`}>
        <Clock className="w-3.5 h-3.5" />
        <span>{isOverdue ? `🔴 OVERDUE (+${formattedTime})` : percentage < 25 ? `🟡 ${formattedTime}` : `🟢 ${formattedTime}`}</span>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-2xl border transition shadow-sm ${
      isOverdue 
        ? 'bg-red-50/80 border-red-200 text-red-900' 
        : percentage < 25
        ? 'bg-amber-50/80 border-amber-200 text-amber-900'
        : 'bg-slate-50/80 border-slate-200 text-slate-900'
    }`}>
      <div className="flex items-center justify-between text-xs mb-2 font-medium">
        <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
          {isOverdue ? <ShieldAlert className="w-4 h-4 text-red-600" /> : <Clock className="w-4 h-4 text-brand-600" />}
          Resolution SLA Countdown
        </span>
        <span className={`font-mono font-bold ${isOverdue ? 'text-red-700 font-extrabold' : 'text-slate-900'}`}>
          {isOverdue ? `BREACHED +${formattedTime}` : formattedTime}
        </span>
      </div>

      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${
            isOverdue 
              ? 'bg-red-600 w-full animate-pulse' 
              : percentage < 25 
              ? 'bg-amber-500' 
              : 'bg-emerald-500'
          }`} 
          style={{ width: isOverdue ? '100%' : `${percentage}%` }}
        />
      </div>

      {isOverdue && (
        <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-red-700 font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>SLA Breached! Auto-Escalation broadcasted to Department Head & Admin.</span>
        </div>
      )}
    </div>
  );
};
