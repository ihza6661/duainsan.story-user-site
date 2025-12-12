import { TemplateComponent, TemplateMetadata } from './types';
import { SakeenaTemplate } from './sakeenah/SakeenaTemplate';
import { ClassicTemplate } from './classic/ClassicTemplate';

/**
 * Template Registry
 * 
 * Maps template_component identifiers (from backend) to React components.
 * This replaces the hardcoded name-matching logic in PublicInvitationPage.
 * 
 * To add a new template:
 * 1. Create the template component in templates/{name}/
 * 2. Import it here
 * 3. Add an entry to the registry below
 * 4. Update the database seeder with the correct template_component value
 */

const templateRegistry: Record<string, TemplateMetadata> = {
  // Sakeenah - Islamic Modern template
  SakenahTemplate: {
    name: 'Sakeenah - Islamic Modern',
    description: 'Modern Islamic wedding invitation with elegant animations',
    component: SakeenaTemplate,
  },
  
  // Classic Elegant template
  ClassicElegantTemplate: {
    name: 'Classic Elegant - Traditional',
    description: 'Timeless classic wedding invitation with gold tones',
    component: ClassicTemplate,
  },
};

/**
 * Get a template component by its identifier
 * @param componentName - The template_component value from the backend
 * @returns The template component or undefined if not found
 */
export function getTemplateComponent(componentName: string): TemplateComponent | undefined {
  const template = templateRegistry[componentName];
  return template?.component;
}

/**
 * Get template metadata
 * @param componentName - The template_component value from the backend
 * @returns Template metadata or undefined if not found
 */
export function getTemplateMetadata(componentName: string): TemplateMetadata | undefined {
  return templateRegistry[componentName];
}

/**
 * Check if a template exists in the registry
 * @param componentName - The template_component value from the backend
 * @returns true if the template exists
 */
export function hasTemplate(componentName: string): boolean {
  return componentName in templateRegistry;
}

/**
 * Get all registered template names
 * @returns Array of template component names
 */
export function getRegisteredTemplates(): string[] {
  return Object.keys(templateRegistry);
}

/**
 * Get all template metadata
 * @returns Record of all templates with their metadata
 */
export function getAllTemplates(): Record<string, TemplateMetadata> {
  return { ...templateRegistry };
}
