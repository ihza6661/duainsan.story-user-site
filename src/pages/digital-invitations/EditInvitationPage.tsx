import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Upload,
  X,
  Loader2,
  Share2,
  AlertCircle,
  Calendar,
  Edit,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/buttons/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/utils/card";
import { toast } from "@/hooks/ui/use-toast";
import { Badge } from "@/components/ui/utils/badge";
import { Form } from "@/components/ui/forms/form";
import { Alert, AlertDescription } from "@/components/ui/feedback/alert";
import { getErrorMessage } from "@/lib/types";
import { digitalInvitationService } from "@/features/digital-invitations/services/digitalInvitationService";
import { DynamicFormGenerator } from "@/features/digital-invitations/components/DynamicFormGenerator";
import { ExportButtons } from "@/features/digital-invitations/components/export/ExportButtons";
import { ColorThemeSelector } from "@/features/digital-invitations/components/ColorThemeSelector";
import { ScheduleActivationDialog } from "@/features/digital-invitations/components/ScheduleActivationDialog";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

const EditInvitationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState(false);
  const [newSlug, setNewSlug] = useState("");

  // Fetch invitation data
  const { data: invitation, isLoading: invitationLoading } = useQuery({
    queryKey: ["invitation", id],
    queryFn: () => digitalInvitationService.getInvitationById(Number(id)),
    enabled: !!id,
  });

  // Fetch template fields for dynamic form
  const { data: templateFields, isLoading: fieldsLoading } = useQuery({
    queryKey: ["template-fields", invitation?.template?.id],
    queryFn: () =>
      digitalInvitationService.getTemplateFields(invitation!.template.id),
    enabled: !!invitation?.template?.id,
  });

  // Initialize form with dynamic default values
  const form = useForm({
    defaultValues: invitation?.customization_data?.custom_fields || {},
    values: invitation?.customization_data?.custom_fields || {},
  });

  // Update customization mutation
  const updateMutation = useMutation({
    mutationFn: (data: Record<string, string | number | boolean>) =>
      digitalInvitationService.updateCustomization(Number(id), {
        custom_fields: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitation", id] });
      queryClient.invalidateQueries({ queryKey: ["my-invitations"] });
      toast({
        title: "Berhasil disimpan",
        description: "Data undangan berhasil diperbarui",
      });
      form.reset(form.getValues(), { keepValues: true });
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
    mutationFn: ({ file, photoType }: { file: File; photoType?: 'bride' | 'groom' }) =>
      digitalInvitationService.uploadPhoto(Number(id), file, photoType),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invitation", id] });
      const typeLabel = data.photo_type === 'bride' ? 'Mempelai Wanita' : data.photo_type === 'groom' ? 'Mempelai Pria' : '';
      toast({
        title: "Foto berhasil diunggah",
        description: typeLabel ? `Foto ${typeLabel} telah ditambahkan` : "Foto telah ditambahkan ke undangan",
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

  // Update slug mutation
  const updateSlugMutation = useMutation({
    mutationFn: (slug: string) =>
      digitalInvitationService.updateSlug(Number(id), slug),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invitation", id] });
      queryClient.invalidateQueries({ queryKey: ["my-invitations"] });
      setEditingSlug(false);
      setNewSlug("");
      toast({
        title: "URL berhasil diperbarui",
        description: `URL undangan telah diubah dari "${data.old_slug}" menjadi "${data.slug}"`,
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Gagal memperbarui URL",
        description: getErrorMessage(error, "Terjadi kesalahan"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: Record<string, string | number | boolean>) => {
    updateMutation.mutate(data);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, photoType?: 'bride' | 'groom') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      await uploadPhotoMutation.mutateAsync({ file, photoType });
    } finally {
      setUploadingPhoto(false);
      e.target.value = ""; // Reset input
    }
  };

  const handleActivate = () => {
    activateMutation.mutate();
  };

  const handleCopyLink = () => {
    if (invitation?.public_url) {
      navigator.clipboard.writeText(invitation.public_url);
      toast({
        title: "Link disalin",
        description: "Link undangan berhasil disalin ke clipboard",
      });
    }
  };

  const handlePreview = () => {
    if (invitation?.slug) {
      // Open preview in new tab
      window.open(`/undangan/${invitation.slug}`, "_blank");
    }
  };

  const handleEditSlug = () => {
    setNewSlug(invitation?.slug || "");
    setEditingSlug(true);
  };

  const handleCancelEditSlug = () => {
    setEditingSlug(false);
    setNewSlug("");
  };

  const handleSaveSlug = () => {
    if (!newSlug.trim()) {
      toast({
        title: "URL tidak boleh kosong",
        description: "Silakan masukkan URL yang valid",
        variant: "destructive",
      });
      return;
    }

    if (newSlug === invitation?.slug) {
      setEditingSlug(false);
      return;
    }

    updateSlugMutation.mutate(newSlug.trim().toLowerCase());
  };

  if (invitationLoading || fieldsLoading) {
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
            <h3 className="text-lg font-semibold mb-2">
              Undangan tidak ditemukan
            </h3>
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
  const isDirty = form.formState.isDirty;

  return (
    <div className="min-h-screen bg-background py-20 sm:py-28">
      <div className="container mx-auto px-4">
        {/* <div className="container mx-auto px-4 py-8 min-h-screen"> */}
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
            {/* Alert for unsaved changes */}
            {isDirty && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Anda memiliki perubahan yang belum disimpan. Klik "Simpan
                  Perubahan" untuk menyimpan.
                </AlertDescription>
              </Alert>
            )}

            {/* Dynamic Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {templateFields?.fields && templateFields.fields.length > 0 ? (
                  <DynamicFormGenerator
                    fields={templateFields.fields}
                    form={form}
                  />
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">
                        Template ini belum memiliki field kustomisasi.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!isDirty || updateMutation.isPending}
                    className="w-full md:w-auto"
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
            </Form>

            {/* Photo Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Foto Mempelai</CardTitle>
                <CardDescription>
                  Upload foto mempelai wanita dan pria (maksimal 5MB per foto)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Bride Photo */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Foto Mempelai Wanita</h3>
                      {photoUrls.find(p => p.type === 'bride') && (
                        <button
                          type="button"
                          onClick={() => {
                            const brideIndex = photoUrls.findIndex(p => p.type === 'bride');
                            if (brideIndex !== -1) deletePhotoMutation.mutate(brideIndex);
                          }}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                    
                    {photoUrls.find(p => p.type === 'bride') ? (
                      <div className="relative group aspect-square max-w-xs mx-auto">
                        <img
                          src={photoUrls.find(p => p.type === 'bride')?.url}
                          alt="Foto Mempelai Wanita"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileSelect(e, 'bride')}
                          className="hidden"
                          id="bride-photo-upload"
                          disabled={uploadingPhoto}
                        />
                        <label htmlFor="bride-photo-upload">
                          <Button
                            type="button"
                            variant="outline"
                            disabled={uploadingPhoto}
                            asChild
                          >
                            <span className="cursor-pointer">
                              {uploadingPhoto ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Mengunggah...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Pilih Foto Mempelai Wanita
                                </>
                              )}
                            </span>
                          </Button>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                  </div>

                  {/* Groom Photo */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Foto Mempelai Pria</h3>
                      {photoUrls.find(p => p.type === 'groom') && (
                        <button
                          type="button"
                          onClick={() => {
                            const groomIndex = photoUrls.findIndex(p => p.type === 'groom');
                            if (groomIndex !== -1) deletePhotoMutation.mutate(groomIndex);
                          }}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                    
                    {photoUrls.find(p => p.type === 'groom') ? (
                      <div className="relative group aspect-square max-w-xs mx-auto">
                        <img
                          src={photoUrls.find(p => p.type === 'groom')?.url}
                          alt="Foto Mempelai Pria"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileSelect(e, 'groom')}
                          className="hidden"
                          id="groom-photo-upload"
                          disabled={uploadingPhoto}
                        />
                        <label htmlFor="groom-photo-upload">
                          <Button
                            type="button"
                            variant="outline"
                            disabled={uploadingPhoto}
                            asChild
                          >
                            <span className="cursor-pointer">
                              {uploadingPhoto ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Mengunggah...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Pilih Foto Mempelai Pria
                                </>
                              )}
                            </span>
                          </Button>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Additional Photos (optional) */}
                  {photoUrls.filter(p => !p.type || (p.type !== 'bride' && p.type !== 'groom')).length > 0 && (
                    <>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            Foto Tambahan
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {photoUrls.filter(p => !p.type || (p.type !== 'bride' && p.type !== 'groom')).map((photo, idx) => {
                          const originalIndex = photoUrls.findIndex(p => p.url === photo.url);
                          return (
                            <div key={idx} className="relative group aspect-square">
                              <img
                                src={photo.url}
                                alt={`Foto ${idx + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => deletePhotoMutation.mutate(originalIndex)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activation Card */}
            <Card>
              <CardHeader>
                <CardTitle>Status Undangan</CardTitle>
                <CardDescription>
                  {isActive
                    ? "Undangan Anda dapat diakses publik"
                    : "Aktifkan untuk mulai membagikan"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Scheduled Activation Alert */}
                {invitation.scheduled_activation_at && !isActive && (
                  <Alert className="bg-primary/5 border-primary/20">
                    <Calendar className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-sm">
                      <strong>Dijadwalkan untuk aktif pada:</strong>
                      <br />
                      {format(
                        new Date(invitation.scheduled_activation_at),
                        "EEEE, dd MMMM yyyy 'pukul' HH:mm",
                        { locale: localeId }
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex flex-col gap-2">
                  {isActive ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() =>
                          window.open(invitation.public_url, "_blank")
                        }
                        className="w-full"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Lihat Undangan
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCopyLink}
                        className="w-full"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Salin Link
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => deactivateMutation.mutate()}
                        disabled={deactivateMutation.isPending}
                        className="w-full"
                      >
                        <EyeOff className="h-4 w-4 mr-2" />
                        Nonaktifkan
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* Preview Button */}
                      <Button
                        variant="outline"
                        onClick={handlePreview}
                        className="w-full"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Undangan
                      </Button>

                      {/* Activate Now Button */}
                      <Button
                        onClick={handleActivate}
                        disabled={activateMutation.isPending}
                        className="w-full"
                      >
                        {activateMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Mengaktifkan...
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Aktifkan Sekarang
                          </>
                        )}
                      </Button>

                      {/* Schedule Activation Button */}
                      <Button
                        variant="secondary"
                        onClick={() => setScheduleDialogOpen(true)}
                        className="w-full"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        {invitation.scheduled_activation_at
                          ? "Ubah Jadwal Aktivasi"
                          : "Jadwalkan Aktivasi"}
                      </Button>
                    </>
                  )}
                </div>

                {isActive && invitation.public_url && (
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground mb-2">
                      Link Undangan:
                    </p>
                    <code className="block p-2 bg-muted rounded text-xs break-all">
                      {invitation.public_url}
                    </code>
                  </div>
                )}

                {/* URL/Slug Editor */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">URL Undangan</p>
                    {!editingSlug && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditSlug}
                        className="h-7 text-xs"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit URL
                      </Button>
                    )}
                  </div>

                  {editingSlug ? (
                    <div className="space-y-3">
                      <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/20">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-xs text-amber-800 dark:text-amber-200">
                          <strong>Perhatian:</strong> Mengubah URL akan membuat link lama tidak dapat diakses. 
                          Pastikan untuk membagikan link baru kepada tamu.
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-2">
                        <label className="text-xs text-muted-foreground">
                          URL Slug (contoh: nama-mempelai-wedding)
                        </label>
                        <input
                          type="text"
                          value={newSlug}
                          onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                          placeholder="contoh: ihza-iren-wedding"
                          className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          disabled={updateSlugMutation.isPending}
                        />
                        <p className="text-xs text-muted-foreground">
                          Preview: {window.location.origin}/undangan/<strong>{newSlug || 'url-anda'}</strong>
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSaveSlug}
                          disabled={updateSlugMutation.isPending || !newSlug.trim()}
                          className="flex-1"
                        >
                          {updateSlugMutation.isPending ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Menyimpan...
                            </>
                          ) : (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              Simpan URL
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEditSlug}
                          disabled={updateSlugMutation.isPending}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Batal
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <code className="block p-2 bg-muted rounded text-xs break-all">
                        /undangan/{invitation?.slug}
                      </code>
                      <p className="text-xs text-muted-foreground">
                        Klik "Edit URL" untuk mengubah alamat undangan
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t space-y-2 text-sm text-muted-foreground">
                  <p>👁️ Total views: {invitation.view_count}</p>
                  {invitation.expires_at && (
                    <p>
                      ⏰ Aktif hingga:{" "}
                      {new Date(invitation.expires_at).toLocaleDateString(
                        "id-ID",
                      )}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Export Card */}
            {isActive && (
              <ExportButtons
                invitationId={Number(id)}
                disabled={!isActive}
              />
            )}

            {/* Color Theme Card */}
            <ColorThemeSelector
              invitationId={Number(id)}
              disabled={!isActive}
            />

            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Isi semua field yang wajib (*) sebelum mengaktifkan</p>
                <p>• Upload foto berkualitas baik untuk hasil terbaik</p>
                <p>• Periksa kembali tanggal dan waktu acara</p>
                <p>• Link Google Maps membantu tamu menemukan lokasi</p>
                {isActive && (
                  <p>• Unduh PDF untuk mencetak atau membagikan offline</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Schedule Activation Dialog */}
        <ScheduleActivationDialog
          open={scheduleDialogOpen}
          onOpenChange={setScheduleDialogOpen}
          invitationId={Number(id)}
          currentScheduledAt={invitation?.scheduled_activation_at}
        />
      </div>
    </div>
  );
};

export default EditInvitationPage;
