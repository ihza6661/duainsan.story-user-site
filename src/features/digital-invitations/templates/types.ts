import { FC } from 'react';

/**
 * Color theme data structure
 */
export interface ColorThemeData {
  key: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textMuted: string;
  };
}

/**
 * Base props interface that all invitation templates must implement.
 * This interface includes all possible fields from all templates to support dynamic customization.
 * Templates should extract only the fields they need.
 */
export interface InvitationTemplateProps {
  // Legacy/Common fields (for backward compatibility)
  brideNickname?: string;
  groomNickname?: string;
  brideName?: string;
  groomName?: string;
  eventDate?: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  venueMapUrl?: string;
  additionalInfo?: string;
  photos: string[];
  
  // Photo management with metadata
  bridePhoto?: string;
  groomPhoto?: string;
  
  // Sakeenah template fields
  brideFullName?: string;
  brideParents?: string;
  groomFullName?: string;
  groomParents?: string;
  akadDate?: string;
  akadTime?: string;
  akadLocation?: string;
  receptionDate?: string;
  receptionTime?: string;
  receptionLocation?: string;
  gmapsLink?: string;
  preweddingPhoto?: string;
  primaryColor?: string;
  
  // Classic template fields
  couplePhoto?: string;
  eventLocation?: string;
  themeColor?: string;
  
  // Color theme (applied via CSS variables)
  colorTheme?: ColorThemeData | null;
  
  // Allow any additional custom fields (string, number, or boolean values)
  [key: string]: string | number | boolean | string[] | ColorThemeData | null | undefined;
}

/**
 * Template component type - a React functional component that accepts InvitationTemplateProps
 */
export type TemplateComponent = FC<InvitationTemplateProps>;

/**
 * Template metadata for registry
 */
export interface TemplateMetadata {
  name: string;
  description?: string;
  component: TemplateComponent;
}
