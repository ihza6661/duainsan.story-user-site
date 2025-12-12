import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/forms/form";
import { Input } from "@/components/ui/forms/input";
import { Textarea } from "@/components/ui/forms/textarea";
import { TemplateField } from "../services/digitalInvitationService";

interface DynamicFieldRendererProps<T extends FieldValues> {
  field: TemplateField;
  control: Control<T>;
}

/**
 * Dynamic Field Renderer
 * 
 * Renders appropriate input component based on field_type from template field configuration.
 * Supports: text, textarea, date, time, url, email, phone, color, image
 */
export function DynamicFieldRenderer<T extends FieldValues>({
  field,
  control,
}: DynamicFieldRendererProps<T>) {
  const fieldName = field.field_key as Path<T>;

  const renderInput = (value: any, onChange?: (value: string) => void) => {
    switch (field.field_type) {
      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder || ''}
            rows={4}
            className="resize-none"
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            placeholder={field.placeholder || ''}
          />
        );

      case 'time':
        return (
          <Input
            type="time"
            placeholder={field.placeholder || ''}
          />
        );

      case 'url':
        return (
          <Input
            type="url"
            placeholder={field.placeholder || 'https://...'}
          />
        );

      case 'email':
        return (
          <Input
            type="email"
            placeholder={field.placeholder || 'email@example.com'}
          />
        );

      case 'phone':
        return (
          <Input
            type="tel"
            placeholder={field.placeholder || '+62...'}
          />
        );

      case 'color':
        // For color picker, we need to handle both inputs syncing
        return (
          <div className="flex gap-2 items-center">
            <Input
              type="color"
              value={value || '#000000'}
              onChange={(e) => onChange?.(e.target.value)}
              className="w-20 h-10 cursor-pointer"
              title="Pilih warna"
            />
            <Input
              type="text"
              value={value || ''}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder="#000000"
              className="flex-1 font-mono"
              maxLength={7}
            />
          </div>
        );

      case 'image':
        // Note: Image field stores URL string, not file object
        // Image upload is handled separately via the photo upload section
        // This field just displays/stores the image URL
        return (
          <div className="space-y-2">
            <Input
              type="url"
              placeholder={field.placeholder || 'https://... atau gunakan upload foto di bawah'}
              className="flex-1"
            />
            {/* Show image preview if URL exists */}
            {value && (
              <div className="mt-2 relative w-full max-w-xs">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg border"
                  onError={(e) => {
                    // Hide broken images
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        );

      case 'text':
      default:
        return (
          <Input
            type="text"
            placeholder={field.placeholder || ''}
          />
        );
    }
  };

  return (
    <FormField
      control={control}
      name={fieldName}
      defaultValue={field.default_value as any}
      rules={{
        required: field.validation_rules.required 
          ? `${field.field_label} wajib diisi`
          : false,
        minLength: field.validation_rules.min 
          ? {
              value: field.validation_rules.min,
              message: `Minimal ${field.validation_rules.min} karakter`,
            }
          : undefined,
        maxLength: field.validation_rules.max
          ? {
              value: field.validation_rules.max,
              message: `Maksimal ${field.validation_rules.max} karakter`,
            }
          : undefined,
        pattern: field.validation_rules.pattern
          ? {
              value: new RegExp(field.validation_rules.pattern),
              message: 'Format tidak valid',
            }
          : undefined,
      }}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel>
            {field.field_label}
            {field.validation_rules.required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </FormLabel>
          <FormControl>
            {/* Special handling for color field */}
            {field.field_type === 'color' ? (
              renderInput(formField.value, formField.onChange)
            ) : (
              /* Clone the input element and spread formField props */
              React.cloneElement(renderInput(formField.value), {
                ...formField,
                value: formField.value || '',
                onChange: (e: any) => {
                  // Handle different input types
                  if (field.field_type === 'image') {
                    const files = e.target.files;
                    formField.onChange(files?.[0] || null);
                  } else {
                    formField.onChange(e.target.value);
                  }
                },
              })
            )}
          </FormControl>
          {field.help_text && (
            <FormDescription>{field.help_text}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
