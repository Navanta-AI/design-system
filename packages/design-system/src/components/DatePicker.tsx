"use client"
import React, { useState, useRef, useEffect, useId } from 'react';
import { CalendarBlank, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { cn } from '../utils/cn';

export interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string | boolean;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function formatDate(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

const sizeClasses = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-4 text-base',
};

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date',
  label,
  helperText,
  error,
  disabled = false,
  minDate,
  maxDate,
  size = 'md',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => (value || new Date()).getFullYear());
  const [viewMonth, setViewMonth] = useState(() => (value || new Date()).getMonth());
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const helperId = `${id}-helper`;

  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;
  const displayHelper = errorMessage || helperText;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [isOpen]);

  useEffect(() => {
    if (value) {
      setViewYear(value.getFullYear());
      setViewMonth(value.getMonth());
    }
  }, [value]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const selectDate = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    onChange?.(date);
    setIsOpen(false);
  };

  const isDisabledDate = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    if (minDate && date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true;
    if (maxDate && date > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) return true;
    return false;
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const today = new Date();

  return (
    <div ref={containerRef} className={cn('relative flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}

      <button
        type="button"
        className={cn(
          'flex items-center justify-between w-full border border-border rounded-md bg-background text-foreground cursor-pointer transition-all outline-none text-left focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring',
          sizeClasses[size],
          isOpen && 'border-ring',
          hasError && 'border-red-500 focus-visible:ring-red-500',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={() => !disabled && setIsOpen((o) => !o)}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-describedby={displayHelper ? helperId : undefined}
      >
        <span className={cn(value ? 'text-foreground' : 'text-muted-foreground')}>
          {value ? formatDate(value) : placeholder}
        </span>
        <CalendarBlank size={16} weight="regular" className="shrink-0 text-muted-foreground" />
      </button>

      {isOpen && (
        <div 
          className="absolute top-[calc(100%+4px)] left-0 z-50 w-[min(280px,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] p-4 bg-popover border border-border rounded-md shadow-lg animate-in fade-in slide-in-from-top-1 duration-200" 
          role="dialog" 
          aria-label="Date picker"
        >
          <div className="flex items-center justify-between mb-2">
            <button 
              type="button" 
              className="flex items-center justify-center w-7 h-7 border-none rounded-md bg-transparent text-muted-foreground cursor-pointer transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring outline-none" 
              onClick={prevMonth} 
              aria-label="Previous month"
            >
              <CaretLeft size={14} weight="bold" />
            </button>
            <span className="text-sm font-semibold text-foreground">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button 
              type="button" 
              className="flex items-center justify-center w-7 h-7 border-none rounded-md bg-transparent text-muted-foreground cursor-pointer transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring outline-none" 
              onClick={nextMonth} 
              aria-label="Next month"
            >
              <CaretRight size={14} weight="bold" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d) => (
              <span key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px">
            {Array.from({ length: firstDay }).map((_, i) => (
              <span key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(viewYear, viewMonth, day);
              const isSelected = value ? isSameDay(date, value) : false;
              const isToday = isSameDay(date, today);
              const isDayDisabled = isDisabledDate(day);

              return (
                <button
                  key={day}
                  type="button"
                  className={cn(
                    'aspect-square flex items-center justify-center border-none rounded-md bg-transparent text-foreground text-sm cursor-pointer transition-colors hover:bg-muted/50 focus-visible:ring-1 focus-visible:ring-ring outline-none relative hover:z-10 focus-visible:z-10',
                    isSelected && 'bg-primary !text-primary-foreground font-semibold hover:bg-primary/90',
                    isToday && !isSelected && 'border border-primary font-semibold',
                    isDayDisabled && 'opacity-30 cursor-not-allowed hover:bg-transparent'
                  )}
                  onClick={() => !isDayDisabled && selectDate(day)}
                  disabled={isDayDisabled}
                  aria-label={formatDate(date)}
                  aria-selected={isSelected || undefined}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {displayHelper && (
        <span id={helperId} className={cn('text-xs text-muted-foreground', hasError && 'text-red-500')}>
          {displayHelper}
        </span>
      )}
    </div>
  );
};

DatePicker.displayName = 'DatePicker';
export { DatePicker };
export default DatePicker;
