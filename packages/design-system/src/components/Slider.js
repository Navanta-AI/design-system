import React from 'react';
import * as RadixSlider from '@radix-ui/react-slider';
import styles from '../styles/Slider.module.css';

/**
 * Slider component allows users to make selections from a range of values.
 * 
 * @param {Object} props
 * @param {number[]} props.value - Current value(s) of the slider.
 * @param {number[]} props.defaultValue - Initial value(s).
 * @param {number} props.min - Minimum value.
 * @param {number} props.max - Maximum value.
 * @param {number} props.step - Increment step.
 * @param {Function} props.onValueChange - Callback when values change.
 * @param {boolean} props.disabled - Whether the slider is interactive.
 * @param {'horizontal' | 'vertical'} props.orientation - Slider orientation.
 */
export default function Slider({
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  disabled = false,
  orientation = 'horizontal'
}) {
  return (
    <RadixSlider.Root
      className={styles.root}
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      onValueChange={onValueChange}
      disabled={disabled}
      orientation={orientation}
    >
      <RadixSlider.Track className={styles.track}>
        <RadixSlider.Range className={styles.range} />
      </RadixSlider.Track>
      
      {/* Support multiple thumbs for range selection */}
      {(value || defaultValue || [0]).map((_, i) => (
        <RadixSlider.Thumb key={i} className={styles.thumb} aria-label="Slider handle" />
      ))}
    </RadixSlider.Root>
  );
}
