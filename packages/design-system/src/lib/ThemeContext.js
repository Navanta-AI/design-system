import React, { createContext, useContext, useState, useEffect } from 'react';
import chroma from 'chroma-js';
import { useTheme as useNextTheme } from 'next-themes';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const LIGHT_PRIMARY = '#6440B6';
const DARK_PRIMARY = '#8C66E3';

export const DEFAULT_TOKENS = {
  '--color-primary': LIGHT_PRIMARY,
  '--radius-input': '4px',
  '--radius-button': '6px',
  '--radius-container': '12px',
};

const STORAGE_KEY = 'navanta-portal-theme-overrides';

export const ThemeProvider = ({ children }) => {
  const { resolvedTheme } = useNextTheme();
  const [tokens, setTokens] = useState(DEFAULT_TOKENS);
  const [isMounted, setIsMounted] = useState(false);
  const [hasCustomColor, setHasCustomColor] = useState(false);

  // Initial load from localStorage
  useEffect(() => {
    setIsMounted(true);
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const valid = {};
        Object.keys(DEFAULT_TOKENS).forEach(key => {
          if (parsed[key]) valid[key] = parsed[key];
        });
        setTokens(prev => ({ ...prev, ...valid }));
        if (parsed['--color-primary'] && parsed['--color-primary'] !== LIGHT_PRIMARY) {
          setHasCustomColor(true);
        }
      } catch (e) {
        console.error('Failed to parse saved theme tokens', e);
      }
    }
  }, []);

  // Sync to document root whenever tokens OR theme changes
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    const root = document.documentElement;
    const isDark = resolvedTheme === 'dark';

    // Determine the base primary color
    let baseColor = tokens['--color-primary'];
    if (!hasCustomColor) {
      baseColor = isDark ? DARK_PRIMARY : LIGHT_PRIMARY;
    }

    // 1. Apply primary base
    root.style.setProperty('--color-primary', baseColor);

    // 2. Generate and apply variations based on current mode
    try {
      const color = chroma(baseColor);

      if (isDark) {
        root.style.setProperty('--color-primary-hover', color.brighten(0.5).desaturate(0.1).hex());
        root.style.setProperty('--color-primary-light', color.alpha(0.2).css());
        root.style.setProperty('--color-text-on-primary', color.luminance() > 0.5 ? '#000000' : '#FFFFFF');
      } else {
        root.style.setProperty('--color-primary-hover', color.brighten(2).desaturate(0.2).hex());
        root.style.setProperty('--color-primary-light', color.alpha(0.1).css());
        root.style.setProperty('--color-text-on-primary', color.luminance() > 0.6 ? '#000000' : '#FFFFFF');
      }
    } catch (e) {
      // Ignore during typing
    }

    // 3. Apply other tokens (radius)
    Object.entries(tokens).forEach(([key, value]) => {
      if (key !== '--color-primary') {
        root.style.setProperty(key, value);
      }
    });

    // Save to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...tokens, '--color-primary': baseColor }));
  }, [tokens, resolvedTheme, isMounted, hasCustomColor]);

  const updateToken = (key, value) => {
    if (key === '--color-primary') setHasCustomColor(true);
    setTokens(prev => ({ ...prev, [key]: value }));
  };

  const resetTheme = () => {
    setTokens(DEFAULT_TOKENS);
    setHasCustomColor(false);
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  return (
    <ThemeContext.Provider value={{ tokens, updateToken, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
