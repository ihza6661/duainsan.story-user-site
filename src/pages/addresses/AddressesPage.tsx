import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus, MapPin } from "lucide-react";

import { getAddresses } from "@/features/addresses/services/addressService";
import { Address } from "@/features/addresses/types/address.types";
import { AddressCard } from "@/features/addresses/components/AddressCard";
import { AddressForm } from "@/features/addresses/components/AddressForm";
import { Button } from "@/components/ui/buttons/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialogs/dialog";

const AddressesPage: FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const { data: addresses, isLoading, isError } = useQuery({
    queryKey: ["addresses"],
    queryFn: getAddresses,
  });

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAddress(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-20 sm:py-28">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Memuat alamat...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background py-20 sm:py-28">
        <div className="container mx-auto px-4 text-center">
          <p className="text-destructive">
            Gagal memuat alamat. Silakan coba lagi nanti.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Alamat Saya</h1>
            <p className="text-muted-foreground mt-1">
              Kelola alamat pengiriman Anda
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Tambah Alamat
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAddress ? "Edit Alamat" : "Tambah Alamat Baru"}
                </DialogTitle>
                <DialogDescription>
                  {editingAddress
                    ? "Perbarui informasi alamat Anda"
                    : "Tambahkan alamat pengiriman baru"}
                </DialogDescription>
              </DialogHeader>
              <AddressForm
                address={editingAddress}
                onSuccess={handleCloseDialog}
                onCancel={handleCloseDialog}
              />
            </DialogContent>
          </Dialog>
        </div>

        {addresses && addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={handleEdit}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Belum Ada Alamat
            </h2>
            <p className="text-muted-foreground mb-6">
              Tambahkan alamat pengiriman untuk memudahkan proses checkout
            </p>
            <Button onClick={handleAddNew} className="flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              Tambah Alamat Pertama
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressesPage;
