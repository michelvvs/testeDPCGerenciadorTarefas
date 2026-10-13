import { CircleAlert, CircleCheck, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type Tone = 'error' | 'success';

const TONE: Record<Tone, { box: string; icon: LucideIcon; role: 'alert' | 'status' }> = {
  error: { box: 'border-red-200 bg-red-50 text-red-800', icon: CircleAlert, role: 'alert' },
  success: { box: 'border-emerald-200 bg-emerald-50 text-emerald-800', icon: CircleCheck, role: 'status' },
};

interface Props {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}

export function Alert({ tone = 'error', className = '', children }: Props) {
  const { box, icon: Icon, role } = TONE[tone];

  return (
    <div role={role} className={`flex items-start gap-2.5 rounded-field border px-3.5 py-3 text-sm ${box} ${className}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
