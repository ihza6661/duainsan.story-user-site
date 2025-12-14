// src/features/addresses/components/AddressForm.tsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/forms/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/forms/form";
import { Form } from "@/components/ui/forms/form-provider";
import { Loader2 } from "lucide-react";

const addressFormSchema = z.object({
  label: z.string().optional(),
  recipient_name: z.string().optional(),
  recipient_phone: z.string().optional(),
  street: z.string().min(5, "Alamat lengkap minimal 5 karakter"),
  city: z.string().min(2, "Kota/kabupaten harus diisi"),
  state: z.string().min(2, "Provinsi harus diisi"),
  subdistrict: z.string().optional(),
  postal_code: z.string().min(5, "Kode pos harus diisi"),
  country: z.string().optional(),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;

interface AddressFormProps {
  initialData?: Partial<AddressFormValues>;
  onSubmit: (data: AddressFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AddressForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: AddressFormProps) {
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      label: initialData?.label || "",
      recipient_name: initialData?.recipient_name || "",
      recipient_phone: initialData?.recipient_phone || "",
      street: initialData?.street || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      subdistrict: initialData?.subdistrict || "",
      postal_code: initialData?.postal_code || "",
      country: initialData?.country || "Indonesia",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label Alamat (Opsional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: Rumah, Kantor, Toko"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recipient_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Penerima (Opsional)</FormLabel>
              <FormControl>
                <Input placeholder="Nama lengkap penerima" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recipient_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No. Telepon Penerima (Opsional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="08xxxxxxxxxx"
                  type="tel"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat Lengkap *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Jl. Contoh No. 123, RT/RW"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="subdistrict"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kecamatan (Opsional)</FormLabel>
                <FormControl>
                  <Input placeholder="Nama kecamatan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kota/Kabupaten *</FormLabel>
                <FormControl>
                  <Input placeholder="Nama kota/kabupaten" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provinsi *</FormLabel>
                <FormControl>
                  <Input placeholder="Nama provinsi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kode Pos *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="12345"
                    maxLength={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Negara</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Perbarui Alamat" : "Simpan Alamat"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
