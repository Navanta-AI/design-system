"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from "react";

export type ToastType = "success" | "warning" | "info" | "error";
export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  position?: ToastPosition;
  dismissing?: boolean;
}

export interface AddToastOptions {
  type?: ToastType;
  title?: string;
  duration?: number;
  position?: ToastPosition;
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (
    message: string,
    typeOrOptions?: ToastType | AddToastOptions,
    maybeOptions?: AddToastOptions
  ) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);
const EXIT_ANIMATION_MS = 220;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Record<string, number>>({});

  const dismiss = useCallback((id: string) => {
    if (timersRef.current[id]) {
      window.clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }

    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, dismissing: true } : t))
    );

    timersRef.current[id] = window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      delete timersRef.current[id];
    }, EXIT_ANIMATION_MS);
  }, []);

  const addToast = useCallback((
    message: string,
    typeOrOptions?: ToastType | AddToastOptions,
    maybeOptions?: AddToastOptions
  ) => {
    const resolvedOptions: AddToastOptions =
      typeof typeOrOptions === "string"
        ? { ...(maybeOptions ?? {}), type: typeOrOptions }
        : (typeOrOptions ?? {});

    const type = resolvedOptions.type ?? "info";
    const duration = resolvedOptions.duration ?? 5000;
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type,
        title: resolvedOptions.title,
        duration,
        position: resolvedOptions.position,
      },
    ]);

    if (duration > 0) {
      timersRef.current[id] = window.setTimeout(() => dismiss(id), duration);
    }
  }, [dismiss]);

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach((timer) => window.clearTimeout(timer));
      timersRef.current = {};
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
