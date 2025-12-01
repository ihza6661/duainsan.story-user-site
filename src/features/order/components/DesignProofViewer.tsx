import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/utils/card";
import { Button } from "@/components/ui/buttons/button";
import { Badge } from "@/components/ui/utils/badge";
import { Separator } from "@/components/ui/layout-ui/separator";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";
import {
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Clock,
  Loader2,
} from "lucide-react";
import {
  getDesignProofsByOrderId,
  approveDesignProof,
  rejectDesignProof,
  requestRevision,
} from "@/features/order/services/designProofService";
import { ApprovalDialog } from "./ApprovalDialog";
import { DesignProof, DesignProofStatus } from "@/types/design-proof";

interface DesignProofViewerProps {
  orderId: number;
}

type ActionType = "approve" | "reject" | "revision";

export const DesignProofViewer = ({ orderId }: DesignProofViewerProps) => {
  const queryClient = useQueryClient();
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    actionType: ActionType;
    proofId: number | null;
  }>({
    isOpen: false,
    actionType: "approve",
    proofId: null,
  });

  // Fetch design proofs
  const {
    data: designProofs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["design-proofs", orderId],
    queryFn: () => getDesignProofsByOrderId(orderId),
  });

  // Mutation for all actions
  const actionMutation = useMutation({
    mutationFn: async ({
      proofId,
      action,
      feedback,
    }: {
      proofId: number;
      action: ActionType;
      feedback?: string;
    }) => {
      switch (action) {
        case "approve":
          return approveDesignProof(proofId, { feedback });
        case "reject":
          return rejectDesignProof(proofId, { feedback: feedback! });
        case "revision":
          return requestRevision(proofId, { feedback: feedback! });
      }
    },
    onSuccess: (_, variables) => {
      const actionMessages = {
        approve: "Desain berhasil disetujui!",
        reject: "Desain berhasil ditolak.",
        revision: "Permintaan revisi berhasil dikirim.",
      };
      toast.success(actionMessages[variables.action]);
      queryClient.invalidateQueries({ queryKey: ["design-proofs", orderId] });
      queryClient.invalidateQueries({
        queryKey: ["order", orderId.toString()],
      });
      setDialogState({ isOpen: false, actionType: "approve", proofId: null });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error.response as { data?: { message?: string } })?.data?.message
          : undefined;
      toast.error(errorMessage || "Terjadi kesalahan. Silakan coba lagi.");
    },
  });

  const handleOpenDialog = (proofId: number, actionType: ActionType) => {
    setDialogState({ isOpen: true, actionType, proofId });
  };

  const handleCloseDialog = () => {
    setDialogState({ isOpen: false, actionType: "approve", proofId: null });
  };

  const handleSubmitAction = (action: ActionType, feedback?: string) => {
    if (dialogState.proofId) {
      actionMutation.mutate({ proofId: dialogState.proofId, action, feedback });
    }
  };

  const getStatusBadge = (status: DesignProofStatus | undefined) => {
    const configs = {
      pending_approval: {
        variant: "secondary" as const,
        icon: <Clock className="h-3 w-3 mr-1" />,
        text: "Menunggu Review",
      },
      approved: {
        variant: "default" as const,
        icon: <CheckCircle2 className="h-3 w-3 mr-1" />,
        text: "Disetujui",
      },
      revision_requested: {
        variant: "outline" as const,
        icon: <AlertCircle className="h-3 w-3 mr-1" />,
        text: "Revisi Diminta",
      },
      rejected: {
        variant: "destructive" as const,
        icon: <XCircle className="h-3 w-3 mr-1" />,
        text: "Ditolak",
      },
    };

    // Default to pending_approval if status is undefined or not found
    const config =
      configs[status || "pending_approval"] || configs.pending_approval;
    return (
      <Badge variant={config.variant} className="flex items-center w-fit">
        {config.icon}
        {config.text}
      </Badge>
    );
  };

  const getStorageUrl = (path: string | undefined) => {
    if (!path) return "";
    return getImageUrl(path);
  };

  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Desain Proof
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Memuat desain proof...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Desain Proof
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">
            Gagal memuat desain proof. Silakan coba lagi.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!designProofs || designProofs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Desain Proof
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Belum ada desain proof yang diunggah untuk pesanan ini.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group by order_item_id and get latest version for each
  const groupedProofs = designProofs.reduce(
    (acc, proof) => {
      if (!acc[proof.order_item_id]) {
        acc[proof.order_item_id] = [];
      }
      acc[proof.order_item_id].push(proof);
      return acc;
    },
    {} as Record<number, DesignProof[]>,
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Desain Proof
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(groupedProofs).map(([orderItemId, proofs]) => {
            // Sort by version descending to get latest first
            const sortedProofs = [...proofs].sort(
              (a, b) => (b.version || 0) - (a.version || 0),
            );
            const latestProof = sortedProofs[0];

            // Safety check
            if (!latestProof) {
              return null;
            }

            return (
              <div key={orderItemId} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      Item Pesanan #{orderItemId}
                    </h4>
                    {getStatusBadge(latestProof.status)}
                  </div>
                </div>

                {/* Latest Proof */}
                <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    {latestProof.thumbnail_url && (
                      <img
                        src={getStorageUrl(latestProof.thumbnail_url)}
                        alt={`Design Proof v${latestProof.version}`}
                        className="w-32 h-32 object-cover rounded-md border"
                      />
                    )}

                    {/* Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">
                          Versi {latestProof.version}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          Terbaru
                        </Badge>
                      </div>

                      <div className="text-xs text-muted-foreground space-y-1">
                        {latestProof.file_name && (
                          <p>Nama File: {latestProof.file_name}</p>
                        )}
                        {latestProof.file_size && (
                          <p>Ukuran: {formatFileSize(latestProof.file_size)}</p>
                        )}
                        <p>Diunggah: {formatDate(latestProof.created_at)}</p>
                      </div>

                      {(latestProof.customer_feedback ||
                        latestProof.admin_notes) && (
                        <div className="mt-2 p-2 bg-background rounded border space-y-1">
                          {latestProof.admin_notes && (
                            <div>
                              <p className="text-xs font-medium text-foreground mb-1">
                                Catatan Admin:
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {latestProof.admin_notes}
                              </p>
                            </div>
                          )}
                          {latestProof.customer_feedback && (
                            <div>
                              <p className="text-xs font-medium text-foreground mb-1">
                                Feedback Anda:
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {latestProof.customer_feedback}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const url = getStorageUrl(latestProof.file_url);
                            window.open(url, "_blank");
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Unduh
                        </Button>

                        {latestProof.status === "pending_approval" && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() =>
                                handleOpenDialog(latestProof.id, "approve")
                              }
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Setujui
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() =>
                                handleOpenDialog(latestProof.id, "revision")
                              }
                            >
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Minta Revisi
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleOpenDialog(latestProof.id, "reject")
                              }
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Tolak
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Previous Versions */}
                {sortedProofs.length > 1 && (
                  <details className="text-sm">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      Lihat versi sebelumnya ({sortedProofs.length - 1})
                    </summary>
                    <div className="mt-3 space-y-2">
                      {sortedProofs.slice(1).map((proof) => (
                        <div
                          key={proof.id}
                          className="border rounded p-3 bg-background space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {proof.thumbnail_url && (
                                <img
                                  src={getStorageUrl(proof.thumbnail_url)}
                                  alt={`Design Proof v${proof.version}`}
                                  className="w-16 h-16 object-cover rounded border"
                                />
                              )}
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  Versi {proof.version}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(proof.created_at)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(proof.status)}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const url = getStorageUrl(proof.file_url);
                                  window.open(url, "_blank");
                                }}
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          {(proof.customer_feedback || proof.admin_notes) && (
                            <div className="p-2 bg-muted rounded space-y-1">
                              {proof.admin_notes && (
                                <div>
                                  <p className="text-xs font-medium text-foreground mb-1">
                                    Catatan Admin:
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {proof.admin_notes}
                                  </p>
                                </div>
                              )}
                              {proof.customer_feedback && (
                                <div>
                                  <p className="text-xs font-medium text-foreground mb-1">
                                    Feedback Anda:
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {proof.customer_feedback}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </details>
                )}

                <Separator />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <ApprovalDialog
        isOpen={dialogState.isOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitAction}
        actionType={dialogState.actionType}
        isLoading={actionMutation.isPending}
      />
    </>
  );
};
