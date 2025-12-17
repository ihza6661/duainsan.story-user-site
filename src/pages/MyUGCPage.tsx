import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/buttons/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/utils/card";
import { Badge } from "@/components/ui/utils/badge";
import { Loader2, Upload, Trash2, Instagram, CheckCircle, Clock } from "lucide-react";
import ugcService, { type UGCItem } from "@/services/api/ugcService";
import { UGCUploadForm } from "@/components/gallery/UGCUploadForm";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/dialogs/alert-dialog";
import { getImageUrl } from "@/lib/utils";
import { getErrorMessage } from "@/lib/types";

const MyUGCPage = () => {
  const queryClient = useQueryClient();
  const [uploadFormOpen, setUploadFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<UGCItem | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-ugc"],
    queryFn: () => ugcService.getMySubmissions({ per_page: 50 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ugcService.delete(id),
    onSuccess: () => {
      toast.success("Foto berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["my-ugc"] });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error, "Gagal menghapus foto");
      toast.error(message);
    },
  });

  const handleDeleteClick = (item: UGCItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete.id);
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-20 mx-auto px-4 py-20 text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground" />
        <p className="mt-4 text-lg text-muted-foreground">
          Memuat foto Anda...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mt-20 mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-destructive">
          Gagal Memuat Data
        </h1>
        <p className="text-muted-foreground mt-2">
          Terjadi kesalahan saat mengambil data foto Anda.
        </p>
      </div>
    );
  }

  const submissions = data?.data?.data || [];

  return (
    <div className="min-h-screen bg-background py-20 sm:py-28">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Foto Saya</h1>
            <p className="text-muted-foreground mt-1">
              Kelola foto yang telah Anda bagikan
            </p>
          </div>
          <Button onClick={() => setUploadFormOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Unggah Foto Baru
          </Button>
        </div>

        {submissions.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Upload className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Belum Ada Foto yang Diunggah
              </h3>
              <p className="text-muted-foreground mb-6">
                Bagikan foto produk yang Anda terima untuk ditampilkan di galeri
                kami
              </p>
              <Button onClick={() => setUploadFormOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Unggah Foto Pertama
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative aspect-square">
                  <img
                    src={getImageUrl(item.image_url)}
                    alt={item.caption || "User photo"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    {item.is_approved ? (
                      <Badge
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Disetujui
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>
                  {item.is_featured && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="default" className="bg-yellow-600 hover:bg-yellow-700">
                        ⭐ Unggulan
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-3">
                  {item.product && (
                    <CardDescription className="text-xs">
                      Produk: {item.product.name}
                    </CardDescription>
                  )}
                  {item.caption && (
                    <CardDescription className="line-clamp-2">
                      {item.caption}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="pt-0 space-y-3">
                  {item.instagram_handle && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Instagram className="h-4 w-4" />
                      @{item.instagram_handle}
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Diunggah:{" "}
                    {new Date(item.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>

                  {!item.is_approved && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => handleDeleteClick(item)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <UGCUploadForm
          open={uploadFormOpen}
          onOpenChange={setUploadFormOpen}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["my-ugc"] });
          }}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Foto?</AlertDialogTitle>
              <AlertDialogDescription>
                Anda yakin ingin menghapus foto ini? Tindakan ini tidak dapat
                dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteMutation.isPending}>
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  "Hapus"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default MyUGCPage;
