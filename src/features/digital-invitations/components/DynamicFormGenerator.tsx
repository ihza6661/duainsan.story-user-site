import { UseFormReturn } from "react-hook-form";
import { TemplateField } from "../services/digitalInvitationService";
import { DynamicFieldRenderer } from "./DynamicFieldRenderer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/utils/card";

interface DynamicFormGeneratorProps {
  fields: TemplateField[];
  form: UseFormReturn<any>;
}

// Category labels and icons
const categoryConfig = {
  couple: {
    title: "Data Mempelai",
    description: "Informasi pengantin pria dan wanita",
    icon: "💑",
  },
  event: {
    title: "Detail Acara",
    description: "Tanggal, waktu, dan jadwal acara",
    icon: "📅",
  },
  venue: {
    title: "Lokasi",
    description: "Tempat pelaksanaan acara",
    icon: "📍",
  },
  design: {
    title: "Desain & Foto",
    description: "Kustomisasi tampilan undangan",
    icon: "🎨",
  },
  general: {
    title: "Informasi Lainnya",
    description: "Data tambahan",
    icon: "📝",
  },
};

/**
 * Dynamic Form Generator
 * 
 * Renders a dynamic form based on template field configuration.
 * Groups fields by category and displays them in cards.
 */
export function DynamicFormGenerator({ fields, form }: DynamicFormGeneratorProps) {
  // Group fields by category
  const groupedFields = fields.reduce((acc, field) => {
    const category = field.field_category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(field);
    return acc;
  }, {} as Record<string, TemplateField[]>);

  // Sort categories in preferred order
  const categoryOrder: Array<keyof typeof categoryConfig> = ['couple', 'event', 'venue', 'design', 'general'];
  const sortedCategories = categoryOrder.filter(cat => groupedFields[cat]);

  return (
    <div className="space-y-6">
      {sortedCategories.map((category) => {
        const config = categoryConfig[category];
        const categoryFields = groupedFields[category];

        return (
          <Card key={category}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{config.icon}</span>
                <div>
                  <CardTitle>{config.title}</CardTitle>
                  <CardDescription>{config.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryFields.map((field) => (
                <DynamicFieldRenderer
                  key={field.id}
                  field={field}
                  control={form.control}
                />
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
