import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  EyeOff, 
  Upload, 
  X, 
  Loader2,
  CheckCircle,
  Calendar,
  MapPin,
  User,
  Clock
} from "lucide-react";

import { Button } from "@/components/ui/buttons/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/utils/card";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/forms/label";
import { Textarea } from "@/components/ui/forms/textarea";
import { toast } from "@/hooks/ui/use-toast";
import { Badge } from "@/components/ui/utils/badge";
import { Separator } from "@/components/ui/layout-ui/separator";
import { digitalInvitationService, type CustomizationData } from "@/features/digital-invitations/services/digitalInvitationService";

// Form validation schema
const invitationSchema = z.object({
  bride_name: z.string().min(1, "Nama mempelai wanita harus diisi").max(255),
  groom_name: z.string().min(1, "Nama mempelai pria harus diisi").max(255),
  event_date: z.string().min(1, "Tanggal acara harus diisi"),
  event_time: z.string().optional(),
  venue_name: z.string().min(1, "Nama tempat harus diisi").max(255),
  venue_address: z.string().optional(),
  venue_map_url: z.string().url("URL peta tidak valid").optional().or(z.literal("")),
  additional_info: z.string().max(2000).optional(),
});

type InvitationFormData = z.infer<typeof invitationSchema>;

const EditInvitationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Fetch invitation data
  const { data: invitation, isLoading } = useQuery({
    queryKey: ["invitation", id],
    queryFn: () => digitalInvitationService.getInvitationById(Number(id)),
    enabled: !!id,
  });

  // Initialize form with invitation data
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<InvitationFormData>({
    resolver: zodResolver(invitationSchema),
    values: invitation?.customization_data
      ? {
          bride_name: invitation.customization_data.bride_name || "",
          groom_name: invitation.customization_data.groom_name || "",
          event_date: invitation.customization_data.event_date || "",
          event_time: invitation.customization_data.event_time || "",
          venue_name: invitation.customization_data.venue_name || "",
          venue_address: invitation.customization_data.venue_address || "",
          venue_map_url: invitation.customization_data.venue_map_url || "",
          additional_info: invitation.customization_data.additional_info || "",
        }
      : undefined,
  });

  // Update customization mutation
  const updateMutation = useMutation({
    mutationFn: (data: CustomizationData) =>
      digitalInvitationService.updateCustomization(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitation", id] });
      queryClient.invalidateQueries({ queryKey: ["my-invitations"] });
      toast({
        title: "Berhasil disimpan",
        description: "Data undangan berhasil diperbarui",
      });
      reset(undefined, { keepValues: true });
    },
    onError: () => {
      toast({
        title: "Gagal menyimpan",
        description: "Terjadi kesalahan saat menyimpan data",
        variant: "destructive",
      });
    },
  });

  // Activate invitation mutation
  const activateMutation = useMutation({
    mutationFn: () => digitalInvitationService.activate(Number(id)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invitation", id] });
      queryClient.invalidateQueries({ queryKey: ["my-invitations"] });
      toast({
        title: "Undangan diaktifkan",
        description: "Undangan Anda sekarang dapat diakses publik",
      });
    },
    onError: () => {
      toast({
        title: "Gagal mengaktifkan",
        description: "Pastikan semua data telah diisi dengan benar",
        variant: "destructive",
      });
    },
  });

  // Deactivate invitation mutation
  const deactivateMutation = useMutation({
    mutationFn: () => digitalInvitationService.deactivate(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitation", id] });
      queryClient.invalidateQueries({ queryKey: ["my-invitations"] });
      toast({
        title: "Undangan dinonaktifkan",
        description: "Undangan Anda sekarang tidak dapat diakses publik",
      });
    },
  });

  // Photo upload mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: (file: File) =>
      digitalInvitationService.uploadPhoto(Number(id), file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitation", id] });
      toast({
        title: "Foto berhasil diunggah",
        description: "Foto telah ditambahkan ke undangan",
      });
    },
    onError: () => {
      toast({
        title: "Gagal mengunggah foto",
        description: "Ukuran file maksimal 5MB",
        variant: "destructive",
      });
    },
  });

  // Delete photo mutation
  const deletePhotoMutation = useMutation({
    mutationFn: (photoIndex: number) =>
      digitalInvitationService.deletePhoto(Number(id), photoIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitation", id] });
      toast({
        title: "Foto dihapus",
        description: "Foto berhasil dihapus dari undangan",
      });
    },
  });

  const onSubmit = (data: InvitationFormData) => {
    updateMutation.mutate(data);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingPhoto(true);
    try {
      for (const file of files) {
        await uploadPhotoMutation.mutateAsync(file);
      }
    } finally {
      setUploadingPhoto(false);
      e.target.value = ""; // Reset input
    }
  };

  const handleActivate = () => {
    if (!invitation?.customization_data?.bride_name || !invitation?.customization_data?.groom_name) {
      toast({
        title: "Data belum lengkap",
        description: "Lengkapi nama mempelai terlebih dahulu",
        variant: "destructive",
      });
      return;
    }
    activateMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Undangan tidak ditemukan</h3>
            <Link to="/my-invitations">
              <Button variant="outline" className="mt-4">
                Kembali ke Daftar Undangan
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const photoUrls = invitation.customization_data?.photo_urls || [];
  const isActive = invitation.status === "active";

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Link to="/my-invitations">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </Link>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Edit Undangan</h1>
            <p className="text-muted-foreground">
              Template: {invitation.template.name}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {isActive ? (
              <Badge className="bg-green-500">Aktif</Badge>
            ) : (
              <Badge variant="secondary">Draft</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Mempelai</CardTitle>
              <CardDescription>
                Isi data mempelai untuk ditampilkan di undangan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bride_name">
                      <User className="h-4 w-4 inline mr-2" />
                      Nama Mempelai Wanita *
                    </Label>
                    <Input
                      id="bride_name"
                      placeholder="Contoh: Siti Aisyah"
                      {...register("bride_name")}
                    />
                    {errors.bride_name && (
                      <p className="text-sm text-destructive">
                        {errors.bride_name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="groom_name">
                      <User className="h-4 w-4 inline mr-2" />
                      Nama Mempelai Pria *
                    </Label>
                    <Input
                      id="groom_name"
                      placeholder="Contoh: Ahmad Fauzi"
                      {...register("groom_name")}
                    />
                    {errors.groom_name && (
                      <p className="text-sm text-destructive">
                        {errors.groom_name.message}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event_date">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Tanggal Acara *
                    </Label>
                    <Input
                      id="event_date"
                      type="date"
                      {...register("event_date")}
                    />
                    {errors.event_date && (
                      <p className="text-sm text-destructive">
                        {errors.event_date.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event_time">
                      <Clock className="h-4 w-4 inline mr-2" />
                      Waktu Acara
                    </Label>
                    <Input
                      id="event_time"
                      type="time"
                      placeholder="Contoh: 10:00"
                      {...register("event_time")}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="venue_name">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Nama Tempat *
                  </Label>
                  <Input
                    id="venue_name"
                    placeholder="Contoh: Masjid Raya Jakarta"
                    {...register("venue_name")}
                  />
                  {errors.venue_name && (
                    <p className="text-sm text-destructive">
                      {errors.venue_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue_address">Alamat Lengkap</Label>
                  <Textarea
                    id="venue_address"
                    placeholder="Contoh: Jl. Raya Jakarta No. 123, Jakarta Pusat"
                    rows={2}
                    {...register("venue_address")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue_map_url">Google Maps URL</Label>
                  <Input
                    id="venue_map_url"
                    type="url"
                    placeholder="https://maps.google.com/..."
                    {...register("venue_map_url")}
                  />
                  {errors.venue_map_url && (
                    <p className="text-sm text-destructive">
                      {errors.venue_map_url.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Buka Google Maps, klik "Bagikan", lalu salin tautannya
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="additional_info">Informasi Tambahan</Label>
                  <Textarea
                    id="additional_info"
                    placeholder="Contoh: Dress code, protokol kesehatan, dll"
                    rows={3}
                    {...register("additional_info")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maksimal 2000 karakter
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={!isDirty || updateMutation.isPending}
                    className="flex-1"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Photo Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Foto Undangan</CardTitle>
              <CardDescription>
                Upload hingga 5 foto (max 5MB per foto)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photoUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                    <img
                      src={url}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deletePhotoMutation.mutate(index)}
                      disabled={deletePhotoMutation.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {photoUrls.length < 5 && (
                  <label className="relative aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Upload Foto
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={handleFileSelect}
                      disabled={uploadingPhoto}
                    />
                  </label>
                )}
              </div>

              {uploadingPhoto && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                  <span className="text-sm text-muted-foreground">
                    Mengunggah foto...
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Undangan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                {isActive ? (
                  <Badge className="bg-green-500">Aktif</Badge>
                ) : (
                  <Badge variant="secondary">Draft</Badge>
                )}
              </div>

              {isActive && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Views:</span>
                      <span className="font-medium">{invitation.view_count}</span>
                    </div>
                    {invitation.expires_at && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Berlaku hingga:</span>
                        <span className="font-medium">
                          {format(new Date(invitation.expires_at), "dd/MM/yyyy")}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}

              <Separator />

              {isActive ? (
                <div className="space-y-2">
                  <Link to={invitation.public_url} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="outline" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      Lihat Undangan
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => deactivateMutation.mutate()}
                    disabled={deactivateMutation.isPending}
                  >
                    {deactivateMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <EyeOff className="h-4 w-4 mr-2" />
                    )}
                    Nonaktifkan
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={handleActivate}
                  disabled={activateMutation.isPending}
                >
                  {activateMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Aktifkan Undangan
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">💡 Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-muted-foreground">
              <p>• Pastikan semua data terisi dengan benar sebelum mengaktifkan</p>
              <p>• Foto dengan rasio 1:1 (persegi) akan tampil lebih baik</p>
              <p>• Link Google Maps membantu tamu menemukan lokasi</p>
              <p>• Undangan dapat dinonaktifkan kapan saja</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditInvitationPage;
