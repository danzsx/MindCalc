import { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  iconBg?: string;
}

export function StatsCard({ icon, value, label, iconBg = 'bg-primary/10' }: StatsCardProps) {
  return (
    <div className="bg-card rounded-[20px] p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_25px_-5px_rgba(0,0,0,0.08)] transition-all duration-300">
      <div className="flex flex-col items-center text-center gap-3">
        <div className={`${iconBg} p-3 rounded-full`}>
          {icon}
        </div>
        <div className="space-y-1">
          <div className="text-foreground" style={{ fontSize: '1.5rem', fontWeight: 'var(--font-weight-bold)' }}>
            {value}
          </div>
          <div className="text-muted-foreground text-sm">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}
