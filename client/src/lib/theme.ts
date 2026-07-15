import type { IndustryKey } from '../types';

export const getTheme = (key: IndustryKey | null) => {
  if (!key) return {
    bg: 'bg-neutral-50',
    panelBg: 'bg-white',
    headerFont: 'font-sans font-bold',
    bodyFont: 'font-sans text-neutral-800',
    radius: 'rounded-2xl',
    innerRadius: 'rounded-xl',
    border: 'border-neutral-200',
    animationSpeed: 'duration-300'
  };

  const themes: Record<IndustryKey, any> = {
    restaurant: {
      bg: 'bg-orange-50/40',
      panelBg: 'bg-[#fffdfa]',
      headerFont: 'font-serif font-bold text-red-950',
      bodyFont: 'font-sans text-neutral-800',
      radius: 'rounded-2xl',
      innerRadius: 'rounded-lg',
      border: 'border-red-100',
      animationSpeed: 'duration-300'
    },
    salon: {
      bg: 'bg-stone-100',
      panelBg: 'bg-white',
      headerFont: 'font-sans font-extrabold text-stone-900 tracking-tight',
      bodyFont: 'font-sans text-stone-900',
      radius: 'rounded-none',
      innerRadius: 'rounded-none',
      border: 'border-stone-200',
      animationSpeed: 'duration-200'
    },
    dental: {
      bg: 'bg-cyan-50/30',
      panelBg: 'bg-white',
      headerFont: 'font-sans font-medium text-cyan-900',
      bodyFont: 'font-sans font-light text-cyan-950',
      radius: 'rounded-[2rem]',
      innerRadius: 'rounded-2xl',
      border: 'border-cyan-100',
      animationSpeed: 'duration-500'
    },
    gym: {
      bg: 'bg-zinc-100',
      panelBg: 'bg-white',
      headerFont: 'font-sans font-black text-orange-600 uppercase tracking-tighter',
      bodyFont: 'font-sans text-neutral-900',
      radius: 'rounded-sm',
      innerRadius: 'rounded-sm',
      border: 'border-orange-200',
      animationSpeed: 'duration-150'
    }
  };

  return themes[key];
};
