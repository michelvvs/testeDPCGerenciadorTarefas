const BASE =
  'inline-flex items-center justify-center rounded-md font-medium transition-colors ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

const VARIANT = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  ghost: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
  danger: 'border border-slate-300 bg-white text-red-700 hover:bg-red-50',
  dangerSolid: 'bg-red-700 text-white hover:bg-red-800',
} as const;

const SIZE = {
  md: 'px-3.5 py-2 text-sm',
  sm: 'px-2.5 py-1 text-xs',
  icon: 'h-8 w-8',
} as const;

export function btn(variant: keyof typeof VARIANT = 'ghost', size: keyof typeof SIZE = 'md'): string {
  return `${BASE} ${SIZE[size]} ${VARIANT[variant]}`;
}

export const inputClass =
  'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 ' +
  'placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30';

export const alertError = 'rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700';