import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/forms/input";
import { Textarea } from "@/components/ui/forms/textarea";
import { Label } from "@/components/ui/forms/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialogs/dialog";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import ugcService, { type SubmitUGCPayload } from "@/services/api/ugcService";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/types";

interface UGCUploadFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId?: number;
  productId?: number;
  digitalInvitationId?: number;
  onSuccess?: () => void;
}

export function UGCUploadForm({
  open,
  onOpenChange,
  orderId,
  productId,
  digitalInvitationId,
  onSuccess,
}: UGCUploadFormProps) {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");

  const uploadMutation = useMutation({
    mutationFn: (payload: SubmitUGCPayload) => ugcService.submit(payload),
    onSuccess: () => {
      toast.success("Foto berhasil dikirim! Menunggu persetujuan admin.");
      queryClient.invalidateQueries({ queryKey: ["ugc"] });
      queryClient.invalidateQueries({ queryKey: ["my-ugc"] });
      handleReset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(
        error,
        "Gagal mengunggah foto. Silakan coba lagi."
      );
      toast.error(message);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar (JPG, PNG, etc.)");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Silakan pilih foto terlebih dahulu");
      return;
    }

    const payload: SubmitUGCPayload = {
      image: selectedFile,
      caption: caption.trim() || undefined,
      instagram_handle: instagramHandle.trim() || undefined,
      instagram_url: instagramUrl.trim() || undefined,
      order_id: orderId,
      product_id: productId,
      digital_invitation_id: digitalInvitationId,
    };

    uploadMutation.mutate(payload);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCaption("");
    setInstagramHandle("");
    setInstagramUrl("");
  };

  const handleCancel = () => {
    handleReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bagikan Foto Anda</DialogTitle>
          <DialogDescription>
            Unggah foto produk yang Anda terima untuk ditampilkan di galeri
            kami. Foto akan ditinjau oleh admin sebelum dipublikasikan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">
              Foto <span className="text-destructive">*</span>
            </Label>
            {!previewUrl ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Klik untuk memilih foto
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG (Max. 5MB)
                  </p>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden border">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 hover:bg-destructive/90 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-white text-sm flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    {selectedFile?.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption">Caption (Opsional)</Label>
            <Textarea
              id="caption"
              placeholder="Ceritakan pengalaman Anda dengan produk ini..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {caption.length}/500
            </p>
          </div>

          {/* Instagram Handle */}
          <div className="space-y-2">
            <Label htmlFor="instagram-handle">
              Instagram Handle (Opsional)
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">@</span>
              <Input
                id="instagram-handle"
                type="text"
                placeholder="username_anda"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Instagram URL */}
          <div className="space-y-2">
            <Label htmlFor="instagram-url">URL Post Instagram (Opsional)</Label>
            <Input
              id="instagram-url"
              type="url"
              placeholder="https://www.instagram.com/p/..."
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={uploadMutation.isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={uploadMutation.isPending}>
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengunggah...
                </>
              ) : (
                "Kirim Foto"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
