export type SpaceToken = '2xs' | 'xs' | 'sm' | 'md' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
export type RadiusToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'pill' | 'full' | 'input' | 'button' | 'container' | 'card';

export const spaceMap: Record<SpaceToken, string> = {
  '2xs': 'var(--space-2xs)',
  'xs': 'var(--space-xs)',
  'sm': 'var(--space-sm)',
  'md': 'var(--space-md)',
  'base': 'var(--space-base)',
  'lg': 'var(--space-lg)',
  'xl': 'var(--space-xl)',
  '2xl': 'var(--space-2xl)',
  '3xl': 'var(--space-3xl)',
  '4xl': 'var(--space-4xl)',
};

export const radiusMap: Record<RadiusToken, string> = {
  'xs': 'var(--radius-xs)',
  'sm': 'var(--radius-sm)',
  'md': 'var(--radius-md)',
  'lg': 'var(--radius-lg)',
  'xl': 'var(--radius-xl)',
  '2xl': 'var(--radius-2xl)',
  'pill': 'var(--radius-pill)',
  'full': 'var(--radius-full)',
  'input': 'var(--radius-input)',
  'button': 'var(--radius-button)',
  'container': 'var(--radius-container)',
  'card': 'var(--radius-card)',
};
