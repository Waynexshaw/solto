/**
 * Solto — Centralized Theme & Branding Configuration
 * 
 * Per Phase 0 constraints:
 * "All colors/branding should be defined in one central theme file —
 * final brand colors aren't locked yet."
 * 
 * To re-brand or change any color across the entire application,
 * simply adjust the values in this file.
 */

export interface BrandTheme {
  name: string;
  tagline: string;
  description: string;
  logo: {
    symbol: string;
    text: string;
  };
  colors: {
    // Primary Brand Colors
    primary: string;
    primaryHover: string;
    primaryLight: string;
    primaryText: string;
    
    // Neutral & Backgrounds
    background: string;
    surface: string;
    surfaceHover: string;
    border: string;
    borderLight: string;
    
    // Text Hierarchy
    textMain: string;
    textMuted: string;
    textSubtle: string;

    // Channels
    twitter: string;
    email: string;

    // Badges & States
    listeningBadgeBg: string;
    listeningBadgeText: string;
    listeningBadgeBorder: string;
    unreadBadge: string;
    success: string;
    warning: string;
    error: string;
  };
  typography: {
    fontFamily: string;
    headingWeight: string;
  };
}

export const SOLTO_THEME: BrandTheme = {
  name: "Solto",
  tagline: "The Sovereign Customer Inbox",
  description: "Unified conversations from Email and X/Twitter. Simple, open, self-hosted.",
  logo: {
    symbol: "⚡",
    text: "Solto",
  },
  colors: {
    // Elegant, modern indigo-slate primary palette
    primary: "#4f46e5",       // indigo-600
    primaryHover: "#4338ca",  // indigo-700
    primaryLight: "#eef2ff",  // indigo-50
    primaryText: "#ffffff",

    background: "#0f172a",    // slate-900
    surface: "#1e293b",       // slate-800
    surfaceHover: "#334155",  // slate-700
    border: "#334155",        // slate-700
    borderLight: "#1e293b",   // slate-800

    textMain: "#f8fafc",      // slate-50
    textMuted: "#94a3b8",     // slate-400
    textSubtle: "#64748b",    // slate-500

    // Channel colors
    twitter: "#1d9bf0",       // Twitter/X signature blue
    email: "#10b981",         // Vibrant Emerald for Email

    // Listening feature: distinct visual treatment for "caught by listening"
    listeningBadgeBg: "#78350f",     // amber-900 / warm amber
    listeningBadgeText: "#fde68a",   // amber-200
    listeningBadgeBorder: "#d97706", // amber-600

    // Status colors
    unreadBadge: "#6366f1",
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
  },
  typography: {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    headingWeight: "600",
  },
};

/**
 * Generates CSS variable style string to inject into root/body
 */
export function getThemeCssVariables(): string {
  return `
    :root {
      --brand-primary: ${SOLTO_THEME.colors.primary};
      --brand-primary-hover: ${SOLTO_THEME.colors.primaryHover};
      --brand-primary-light: ${SOLTO_THEME.colors.primaryLight};
      --brand-surface: ${SOLTO_THEME.colors.surface};
      --brand-border: ${SOLTO_THEME.colors.border};
      --brand-text-main: ${SOLTO_THEME.colors.textMain};
      --brand-text-muted: ${SOLTO_THEME.colors.textMuted};
      --brand-listening-bg: ${SOLTO_THEME.colors.listeningBadgeBg};
      --brand-listening-text: ${SOLTO_THEME.colors.listeningBadgeText};
      --brand-listening-border: ${SOLTO_THEME.colors.listeningBadgeBorder};
      --brand-twitter: ${SOLTO_THEME.colors.twitter};
      --brand-email: ${SOLTO_THEME.colors.email};
    }
  `;
}
