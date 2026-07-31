import React from 'react';
import { Award, Zap, ShieldCheck, Star, Trophy } from 'lucide-react';

interface BadgeProps {
  name: string;
  size?: 'sm' | 'md';
}

export const GamificationBadge: React.FC<BadgeProps> = ({ name, size = 'sm' }) => {
  const getBadgeMeta = (title: string) => {
    switch (title) {
      case 'First Reporter':
        return { icon: Award, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'Campus Helper':
        return { icon: Star, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'Fast Resolver':
        return { icon: Zap, color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
      case 'SLA Champion':
        return { icon: ShieldCheck, color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
      default:
        return { icon: Trophy, color: 'bg-brand-500/10 text-brand-400 border-brand-500/20' };
    }
  };

  const meta = getBadgeMeta(name);
  const Icon = meta.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-mono font-bold ${meta.color} ${
      size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
    }`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      <span>{name}</span>
    </span>
  );
};
