'use client'

/**
 * Certificate styling configuration
 * Defines colors, fonts, and layout settings for the certificate
 */

export const certificateColors = {
  // Main colors
  primary: '#8B0000', // Deep red
  secondary: '#333333', // Dark gray
  accent: '#D4AF37', // Gold
  background: '#ffffff', // White
  text: '#000000', // Black

  // Border and decoration
  border: '#000000',
  headerFooter: '#8B0000',

  // Safe RGB alternatives for oklch colors
  safeRed: '#8B0000',
  safeGold: '#D4AF37',
  safeBlack: '#000000',
  safeWhite: '#ffffff',
  safeGray: '#f8f9fa',
}

export const certificateFonts = {
  title: {
    family: 'serif',
    size: '3rem', // 48px
    weight: 700,
    spacing: '-0.02em',
  },
  recipient: {
    family: 'sans-serif',
    size: '2.5rem', // 40px
    weight: 700,
    spacing: '0',
  },
  body: {
    family: 'sans-serif',
    size: '1.125rem', // 18px
    weight: 400,
    spacing: '0',
  },
  organization: {
    family: 'sans-serif',
    size: '1.5rem', // 24px
    weight: 700,
    spacing: '0.01em',
  },
  signature: {
    family: 'sans-serif',
    size: '1rem', // 16px
    weight: 600,
    spacing: '0',
  },
  code: {
    family: 'monospace',
    size: '1rem', // 16px
    weight: 600,
    spacing: '0.05em',
  },
}

export const certificateLayout = {
  aspectRatio: '5/4',
  maxWidth: '1000px',
  borderWidth: '10px',
  spacing: {
    outer: '2rem', // 32px
    inner: '1.5rem', // 24px
    section: '1rem', // 16px
  },
  borderRadius: '0.5rem', // 8px
}

/**
 * Get RGB fallback for an oklch color
 * Maps known oklch variables to safe RGB colors
 */
export const getRGBFallback = (variableName: string): string => {
  const colorMap: Record<string, string> = {
    // Map CSS variables to safe RGB colors
    '--primary': certificateColors.primary,
    '--secondary': certificateColors.secondary,
    '--accent': certificateColors.accent,
    '--background': certificateColors.background,
    '--foreground': certificateColors.text,
    '--border': certificateColors.border,

    // Default fallback
    default: '#000000',
  }

  return colorMap[variableName] || colorMap.default
}
