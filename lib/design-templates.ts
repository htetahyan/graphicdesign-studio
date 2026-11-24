import { DesignTemplate, ImageStyle, AspectRatio } from "./design-templates/types";
import { designTemplates } from "./design-templates/templates-list";

export type { ImageStyle, AspectRatio, DesignTemplate };
export { designTemplates };

export function getTemplatesByCategory(category: DesignTemplate["category"]) {
  return designTemplates.filter((t) => t.category === category);
}

export function fillTemplateVariables(
  template: DesignTemplate,
  values: Record<string, string | string[]>,
): DesignTemplate["prompt"] {
  const prompt = JSON.parse(JSON.stringify(template.prompt));

  function replaceVariables(obj: any): any {
    if (typeof obj === "string") {
      let result = obj;
      Object.entries(values).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        if (typeof value === "string") {
          result = result.replace(placeholder, value);
        } else if (Array.isArray(value) && value.length > 0) {
          result = result.replace(placeholder, value[0]);
        }
      });
      return result;
    }
    if (Array.isArray(obj)) {
      return obj.map(replaceVariables);
    }
    if (typeof obj === "object" && obj !== null) {
      const result: any = {};
      for (const key in obj) {
        result[key] = replaceVariables(obj[key]);
      }
      return result;
    }
    return obj;
  }

  return replaceVariables(prompt);
}
