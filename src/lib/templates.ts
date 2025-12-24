// Template Registry System
// This allows for multiple full-page templates to be registered and used

import { HomePageData } from "@/components/HomePage";

export type TemplateType = "homepage" | "standard";

export interface TemplateConfig {
  name: string;
  description: string;
  type: TemplateType;
  component: React.ComponentType<any>;
  editorComponent: React.ComponentType<any>;
  defaultData: any;
  parseData: (content: string) => any;
  serializeData: (data: any) => string;
}

// Template registry
export const templates: Record<string, TemplateConfig> = {
  homepage: {
    name: "Homepage Template",
    description: "Full-page IT company homepage with predefined sections",
    type: "homepage",
    component: null as any, // Will be set dynamically
    editorComponent: null as any, // Will be set dynamically
    defaultData: null as any, // Will be set dynamically
    parseData: (content: string) => {
      if (!content) return null;
      try {
        return JSON.parse(content);
      } catch {
        return null;
      }
    },
    serializeData: (data: any) => {
      return JSON.stringify(data);
    },
  },
  standard: {
    name: "Standard Page",
    description: "Flexible page with customizable sections",
    type: "standard",
    component: null as any,
    editorComponent: null as any,
    defaultData: null,
    parseData: (content: string) => content,
    serializeData: (data: any) => data,
  },
};

// Register a template
export function registerTemplate(config: TemplateConfig) {
  templates[config.type] = config;
}

// Get template by type
export function getTemplate(type: string): TemplateConfig | null {
  return templates[type] || null;
}

// Check if a template type exists
export function hasTemplate(type: string): boolean {
  return type in templates;
}

