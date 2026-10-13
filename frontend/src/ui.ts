const BASE =
  'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-field font-semibold ' +
  'transition duration-150 ease-out active:scale-[0.97] ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ' +
  'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100';

const VARIANT = {
  primary: 'bg-brand-600 text-white shadow-btn hover:bg-brand-700',
  ghost: 'bg-base-200 text-base-content hover:bg-base-300',
  outline: 'border border-base-300 bg-base-100 text-base-content hover:bg-base-200',
  danger: 'bg-red-50 text-red-700 hover:bg-red-100',
  dangerSolid: 'bg-red-600 text-white shadow-btn hover:bg-red-700',
  success: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
  info: 'bg-brand-50 text-brand-600 hover:bg-brand-100',
} as const;

const SIZE = {
  md: 'h-10 px-4 text-sm',
  sm: 'h-8 px-3 text-xs',
  icon: 'h-8 w-8',
} as const;

export function btn(variant: keyof typeof VARIANT = 'ghost', size: keyof typeof SIZE = 'md'): string {
  return `${BASE} ${SIZE[size]} ${VARIANT[variant]}`;
}

export const inputClass =
  'min-h-10 rounded-field border border-base-300 bg-base-100 px-3 py-2 text-sm text-base-content ' +
  'placeholder:text-base-content/40 transition ' +
  'focus:border-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-600/15';

export const badge =
  'inline-flex items-center rounded-selector px-2.5 py-0.5 text-xs font-semibold';
