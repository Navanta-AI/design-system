import React from 'react';
import * as RadixAvatar from '@radix-ui/react-avatar';
import styles from '../styles/Avatar.module.css';
import { FiUser } from 'react-icons/fi';

/**
 * Avatar component for user profile images or placeholders.
 * 
 * @param {Object} props
 * @param {string} props.src - Image source URL.
 * @param {string} props.alt - Alt text for image.
 * @param {string} props.initials - Fallback initials.
 * @param {'sm' | 'md' | 'lg' | 'xl'} props.size - Size variant.
 * @param {'circle' | 'square'} props.shape - Shape variant.
 */
export default function Avatar({
  src,
  alt = 'User avatar',
  initials,
  size = 'md',
  shape = 'circle'
}) {
  return (
    <RadixAvatar.Root 
      className={`${styles.root} ${styles[size]} ${styles[shape]}`}
    >
      <RadixAvatar.Image
        className={styles.image}
        src={src}
        alt={alt}
      />
      <RadixAvatar.Fallback className={styles.fallback} delayMs={600}>
        {initials ? (
          <span className={styles.initials}>{initials}</span>
        ) : (
          <FiUser className={styles.icon} />
        )}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
}
