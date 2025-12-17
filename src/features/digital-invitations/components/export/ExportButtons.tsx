import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Download, FileDown, Loader2, Image as ImageIcon, Eye } from "lucide-react";
import { Button } from "@/components/ui/buttons/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/utils/card";
import { toast } from "@/hooks/ui/use-toast";
import { digitalInvitationService } from "../../services/digitalInvitationService";
import { exportInvitationToImage, ImageFormat } from "@/lib/imageExport";
import { getErrorMessage } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/forms/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialogs/dialog";
import { InvitationPreview } from "./InvitationPreview";

interface ExportButtonsProps {
  invitationId: number;
  disabled?: boolean;
}

export const ExportButtons = ({
  invitationId,
  disabled = false,
}: ExportButtonsProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [imageFormat, setImageFormat] = useState<ImageFormat>("png");
  const [showPreview, setShowPreview] = useState(false);

  // Export PDF mutation (direct download)
  const exportPdfMutation = useMutation({
    mutationFn: () => digitalInvitationService.exportPdf(invitationId),
    onSuccess: () => {
      toast({
        title: "PDF berhasil diunduh",
        description: "File PDF undangan telah diunduh ke perangkat Anda",
      });
      setIsExporting(false);
    },
    onError: (error: unknown) => {
      toast({
        title: "Gagal mengekspor PDF",
        description: getErrorMessage(
          error,
          "Terjadi kesalahan saat mengekspor PDF"
        ),
        variant: "destructive",
      });
      setIsExporting(false);
    },
  });

  // Save PDF mutation (save to server)
  const savePdfMutation = useMutation({
    mutationFn: () => digitalInvitationService.savePdf(invitationId),
    onSuccess: (data) => {
      toast({
        title: "PDF berhasil disimpan",
        description: "File PDF telah disimpan ke server",
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Gagal menyimpan PDF",
        description: getErrorMessage(
          error,
          "Terjadi kesalahan saat menyimpan PDF"
        ),
        variant: "destructive",
      });
    },
  });

  const handleExportPdf = async () => {
    setIsExporting(true);
    exportPdfMutation.mutate();
  };

  const handleSavePdf = () => {
    savePdfMutation.mutate();
  };

  const handleExportImage = async () => {
    setIsExportingImage(true);
    try {
      await exportInvitationToImage(invitationId, imageFormat);
      toast({
        title: "Gambar berhasil diunduh",
        description: `File ${imageFormat.toUpperCase()} undangan telah diunduh ke perangkat Anda`,
      });
    } catch (error: unknown) {
      toast({
        title: "Gagal mengekspor gambar",
        description: getErrorMessage(
          error,
          "Terjadi kesalahan saat mengekspor gambar"
        ),
        variant: "destructive",
      });
    } finally {
      setIsExportingImage(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ekspor Undangan</CardTitle>
        <CardDescription>
          Unduh undangan Anda dalam format PDF atau simpan ke server
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={handleExportPdf}
          disabled={disabled || isExporting || exportPdfMutation.isPending}
          className="w-full"
          variant="default"
        >
          {isExporting || exportPdfMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Mengekspor...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Unduh PDF
            </>
          )}
        </Button>

        <Button
          onClick={handleSavePdf}
          disabled={disabled || savePdfMutation.isPending}
          className="w-full"
          variant="outline"
        >
          {savePdfMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <FileDown className="h-4 w-4 mr-2" />
              Simpan ke Server
            </>
          )}
        </Button>

        <div className="pt-3 border-t">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Select
                value={imageFormat}
                onValueChange={(value) => setImageFormat(value as ImageFormat)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleExportImage}
                disabled={disabled || isExportingImage}
                className="flex-1"
                variant="secondary"
              >
                {isExportingImage ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Mengekspor...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Unduh Gambar
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground mb-3">
            💡 <strong>Tips:</strong> PDF untuk cetak, PNG/JPEG untuk media sosial
          </p>
          
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                disabled={disabled}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview untuk Export
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Preview Undangan</DialogTitle>
                <DialogDescription>
                  Ini adalah tampilan undangan yang akan diekspor
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <InvitationPreview invitationId={invitationId} />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                >
                  Tutup
                </Button>
                <Button
                  onClick={() => {
                    setShowPreview(false);
                    handleExportImage();
                  }}
                  disabled={isExportingImage}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Ekspor Gambar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};
