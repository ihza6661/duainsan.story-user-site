import { FC, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Edit2, Trash2, MapPin, Star } from "lucide-react";

import { Address } from "@/features/addresses/types/address.types";
import { deleteAddress, setDefaultAddress } from "@/features/addresses/services/addressService";
import { Button } from "@/components/ui/buttons/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/utils/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/dialogs/alert-dialog";
import { Badge } from "@/components/ui/utils/badge";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
}

export const AddressCard: FC<AddressCardProps> = ({ address, onEdit }) => {
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { mutate: deleteAddressMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      toast.success("Alamat berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Gagal menghapus alamat: ${error.message}`);
    },
  });

  const { mutate: setDefaultMutate, isPending: isSettingDefault } = useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: () => {
      toast.success("Alamat berhasil dijadikan default");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: Error) => {
      toast.error(`Gagal mengatur alamat default: ${error.message}`);
    },
  });

  const handleDelete = () => {
    deleteAddressMutate(address.id);
  };

  const handleSetDefault = () => {
    if (!address.is_default) {
      setDefaultMutate(address.id);
    }
  };

  const formatAddress = () => {
    const parts = [
      address.street,
      address.subdistrict,
      address.city,
      address.state,
      address.postal_code,
      address.country,
    ].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">
                {address.label || "Alamat"}
              </CardTitle>
              {address.is_default && (
                <Badge variant="default" className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Default
                </Badge>
              )}
            </div>
            {address.recipient_name && (
              <p className="text-sm font-medium text-foreground">
                {address.recipient_name}
              </p>
            )}
            {address.recipient_phone && (
              <p className="text-sm text-muted-foreground">
                {address.recipient_phone}
              </p>
            )}
          </div>
          <MapPin className="w-5 h-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{formatAddress()}</p>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(address)}
            className="flex items-center gap-1"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>

          {!address.is_default && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSetDefault}
              disabled={isSettingDefault}
              className="flex items-center gap-1"
            >
              <Star className="w-4 h-4" />
              Jadikan Default
            </Button>
          )}

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="w-4 h-4" />
                Hapus
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Alamat</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus alamat ini? Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Menghapus..." : "Hapus"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};
