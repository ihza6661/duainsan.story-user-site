import { useState, useEffect, FC } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Edit2Icon, XCircle } from "lucide-react";

import {
  getMyProfile,
  updateProfile,
  changePassword,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "@/features/auth/services/auth/authService";
import {
  getProvinces,
  getCities,
  Province,
  City,
} from "@/services/shipping/rajaOngkirService";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/buttons/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/utils/card";
import { Input } from "@/components/ui/forms/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/forms/form";
import { Form } from "@/components/ui/forms/form-provider";
import { Separator } from "@/components/ui/layout-ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/forms/select";

// --- Form Schemas for Validation ---
const profileFormSchema = z
  .object({
    full_name: z.string().min(3, "Nama lengkap minimal 3 karakter."),
    email: z.string().email("Format email tidak valid."),
    phone_number: z.string().optional(),
    address: z.string().optional(),
    province_name: z.string().optional(),
    city_name: z.string().optional(),
    postal_code: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const addressFields = [
      data.address,
      data.province_name,
      data.city_name,
      data.postal_code,
    ];
    const filledFields = addressFields.filter(
      (field) => field && field.trim() !== "",
    );
    const allFieldsEmpty = filledFields.length === 0;

    if (!allFieldsEmpty && filledFields.length < addressFields.length) {
      if (!data.address) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Alamat lengkap harus diisi.",
          path: ["address"],
        });
      }
      if (!data.province_name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Provinsi harus diisi.",
          path: ["province_name"],
        });
      }
      if (!data.city_name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Kota/Kabupaten harus diisi.",
          path: ["city_name"],
        });
      }
      if (!data.postal_code) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Kode pos harus diisi.",
          path: ["postal_code"],
        });
      }
    }
  });

const passwordFormSchema = z
  .object({
    current_password: z.string().min(8, "Password minimal 8 karakter."),
    new_password: z.string().min(8, "Password baru minimal 8 karakter."),
    new_password_confirmation: z.string(),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Konfirmasi password baru tidak cocok.",
    path: ["new_password_confirmation"],
  });

const ProfilePage: FC = () => {
  const queryClient = useQueryClient();
  const { user: authUser, token, updateUser } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
    enabled: !!token, // Only run this query if a token exists
  });

  const profileForm = useForm<UpdateProfilePayload>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      address: "",
      province_name: "",
      city_name: "",
      postal_code: "",
    },
  });

  const passwordForm = useForm<ChangePasswordPayload>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number ?? "",
        address: user.address ?? "",
        province_name: user.province_name ?? "",
        city_name: user.city_name ?? "",
        postal_code: user.postal_code ?? "",
      });
    }
  }, [user, profileForm]);

  const { mutate: updateProfileMutate, isPending: isUpdatingProfile } =
    useMutation({
      mutationFn: updateProfile,
      onSuccess: (response) => {
        const updatedUser = response.data;
        toast.success("Profil berhasil diperbarui.");
        updateUser(updatedUser);
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        setIsEditingProfile(false);
      },
      onError: (error) => toast.error(`Gagal memperbarui: ${error.message}`),
    });

  const { mutate: changePasswordMutate, isPending: isChangingPassword } =
    useMutation({
      mutationFn: changePassword,
      onSuccess: () => {
        toast.success("Password berhasil diubah.");
        passwordForm.reset();
      },
      onError: (error) => toast.error(`Gagal: ${error.message}`),
    });

  // --- Render Logic ---
  if (isLoading) {
    return (
      <div className="container mx-auto pt-48 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Memuat profil...</p>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="container mx-auto pt-40 text-center">
        <p className="text-destructive">
          Gagal memuat profil. Silakan{" "}
          <Link to="/login" className="underline">
            login
          </Link>{" "}
          kembali.
        </p>
      </div>
    );
  }

  return (
    // <div className="container mx-auto py-24 md:py-32">
    <div className="min-h-screen bg-background py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Profil Saya</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Informasi Profil</CardTitle>
                <CardDescription>
                  Perbarui nama, email, dan nomor telepon Anda.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
              >
                {isEditingProfile ? (
                  <XCircle className="w-5 h-5 text-destructive" />
                ) : (
                  <Edit2Icon className="w-5 h-5 text-foreground" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              {isEditingProfile ? (
                <Form {...profileForm}>
                  <form
                    onSubmit={profileForm.handleSubmit((data) => {
                      const payload = { ...data };
                      if (payload.address === "") {
                        payload.address = null;
                      }
                      if (payload.province_name === "") {
                        payload.province_name = null;
                      }
                      if (payload.city_name === "") {
                        payload.city_name = null;
                      }
                      if (payload.postal_code === "") {
                        payload.postal_code = null;
                      }
                      updateProfileMutate(payload);
                    })}
                    className="space-y-4"
                  >
                    <FormField
                      control={profileForm.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Lengkap</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nomor Telepon</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alamat Lengkap</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="province_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Provinsi</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nama Provinsi" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="city_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kota/Kabupaten</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Nama Kota/Kabupaten"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="postal_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kode Pos</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingProfile(false)}
                      >
                        Batal
                      </Button>
                      <Button type="submit" disabled={isUpdatingProfile}>
                        {isUpdatingProfile && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Simpan Perubahan
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-4 text-sm text-muted-foreground">
                  {/* optional chaining untuk akses yang aman */}
                  <div>
                    <p className="font-semibold">Nama Lengkap</p>
                    <p>{user?.full_name ?? "Nama belum diatur"}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p>{user?.email}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold">Nomor Telepon</p>
                    <p>{user?.phone_number || "Belum ditambahkan"}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold">Alamat</p>
                    <p>{user?.address || "Belum ditambahkan"}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold">Provinsi</p>
                    <p>{user?.province_name || "Belum ditambahkan"}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold">Kota/Kabupaten</p>
                    <p>{user?.city_name || "Belum ditambahkan"}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold">Kode Pos</p>
                    <p>{user?.postal_code || "Belum ditambahkan"}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ubah Password</CardTitle>
              <CardDescription>
                Pastikan Anda menggunakan password yang kuat.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit((data) =>
                    changePasswordMutate(data),
                  )}
                  className="space-y-4 text-muted-foreground"
                >
                  <FormField
                    control={passwordForm.control}
                    name="current_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password Saat Ini</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="new_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password Baru</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="new_password_confirmation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konfirmasi Password Baru</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Ubah Password
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
