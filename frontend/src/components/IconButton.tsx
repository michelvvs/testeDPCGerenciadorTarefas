import type { LucideIcon } from 'lucide-react';
import { btn } from '../ui';

type Variant = NonNullable<Parameters<typeof btn>[0]>;

interface Props {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: Variant;
  disabled?: boolean;
}

export function IconButton({ icon: Icon, label, onClick, variant = 'ghost', disabled }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={btn(variant, 'icon')}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}