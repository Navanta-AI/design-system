import React from 'react';
import * as RadixProgress from '@radix-ui/react-progress';
import styles from '../styles/Progress.module.css';

/**
 * Linear Progress component.
 * 
 * @param {Object} props
 * @param {number} props.value - Progress value (0-100).
 * @param {boolean} props.indeterminate - Whether state is indeterminate.
 */
export function Progress({ value = 0, indeterminate = false }) {
  return (
    <RadixProgress.Root
      className={styles.root}
      value={indeterminate ? null : value}
    >
      <RadixProgress.Indicator
        className={indeterminate ? styles.indicatorIndeterminate : styles.indicator}
        style={{ transform: indeterminate ? undefined : `translateX(-${100 - value}%)` }}
      />
    </RadixProgress.Root>
  );
}

/**
 * Circular Progress component.
 * 
 * @param {Object} props
 * @param {number} props.value - Progress value (0-100).
 * @param {number} props.size - Size in pixels.
 * @param {number} props.strokeWidth - Thickness of the line.
 * @param {boolean} props.indeterminate - Indeterminate state.
 */
export function CircularProgress({ 
  value = 0, 
  size = 48, 
  strokeWidth = 4,
  indeterminate = false 
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div 
      className={indeterminate ? styles.circularRootIndeterminate : styles.circularRoot}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className={styles.circularTrack}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={styles.circularIndicator}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          style={{ strokeDashoffset: indeterminate ? undefined : offset }}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
    </div>
  );
}
