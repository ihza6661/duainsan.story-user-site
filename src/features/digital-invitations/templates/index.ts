// Template types
export type { InvitationTemplateProps, TemplateComponent, TemplateMetadata } from './types';

// Template registry functions
export {
  getTemplateComponent,
  getTemplateMetadata,
  hasTemplate,
  getRegisteredTemplates,
  getAllTemplates,
} from './registry';

// Individual template components (for direct imports if needed)
export { SakeenaTemplate } from './sakeenah/SakeenaTemplate';
export { ClassicTemplate } from './classic/ClassicTemplate';
