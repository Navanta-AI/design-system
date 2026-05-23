import React from 'react';
import styles from '../styles/Skeleton.module.css';

/**
 * Skeleton component used to show a placeholder while content is loading.
 * 
 * @param {Object} props
 * @param {'text' | 'circular' | 'rectangular' | 'rounded'} props.variant - Shape of the skeleton.
 * @param {string | number} props.width - Width of the skeleton.
 * @param {string | number} props.height - Height of the skeleton.
 * @param {number} props.count - Number of lines to render (for text variant).
 * @param {string} props.className - Custom class name.
 */
export default function Skeleton({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
  style = {}
}) {
  const elements = Array.from({ length: count });

  const skeletonStyle = {
    width: width,
    height: height,
    ...style
  };

  return (
    <>
      {elements.map((_, index) => (
        <div
          key={index}
          className={`${styles.skeleton} ${styles[variant]} ${className}`}
          style={skeletonStyle}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
