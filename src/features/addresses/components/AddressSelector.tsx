import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

import { getAddresses } from "@/features/addresses/services/addressService";
import { Address } from "@/features/addresses/types/address.types";
import { AddressForm } from "@/features/addresses/components/AddressForm";
import { Button } from "@/components/ui/buttons/button";
import { Label } from "@/components/ui/forms/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/forms/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialogs/dialog";
import { Badge } from "@/components/ui/utils/badge";

interface AddressSelectorProps {
  selectedAddressId: number | null;
  onSelectAddress: (address: Address | null) => void;
}

export const AddressSelector: FC<AddressSelectorProps> = ({
  selectedAddressId,
  onSelectAddress,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: addresses, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: getAddresses,
  });

  const handleSelectAddress = (addressId: string) => {
    if (addressId === "manual") {
      onSelectAddress(null);
    } else {
      const address = addresses?.find((addr) => addr.id === Number(addressId));
      if (address) {
        onSelectAddress(address);
      }
    }
  };

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Memuat alamat...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Pilih Alamat Pengiriman</Label>
        {addresses && addresses.length > 0 && (
          <Link
            to="/profile/addresses"
            className="text-sm text-primary hover:underline"
          >
            Kelola Alamat
          </Link>
        )}
      </div>

      {addresses && addresses.length > 0 ? (
        <RadioGroup
          value={selectedAddressId?.toString() || "manual"}
          onValueChange={handleSelectAddress}
          className="space-y-3"
        >
          {addresses.map((address) => (
            <div
              key={address.id}
              className="flex items-start space-x-3 border border-input p-4 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <RadioGroupItem
                value={address.id.toString()}
                id={`address-${address.id}`}
                className="mt-1"
              />
              <label
                htmlFor={`address-${address.id}`}
                className="flex-1 cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">
                    {address.label || "Alamat"}
                  </span>
                  {address.is_default && (
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 fill-current" />
                      Default
                    </Badge>
                  )}
                </div>
                {address.recipient_name && (
                  <p className="text-sm font-medium text-foreground">
                    {address.recipient_name}
                    {address.recipient_phone && ` - ${address.recipient_phone}`}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  {[
                    address.street,
                    address.subdistrict,
                    address.city,
                    address.state,
                    address.postal_code,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </label>
            </div>
          ))}

          <div className="flex items-start space-x-3 border border-input p-4 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
            <RadioGroupItem value="manual" id="address-manual" className="mt-1" />
            <label
              htmlFor="address-manual"
              className="flex-1 cursor-pointer"
            >
              <span className="font-medium">Gunakan Alamat dari Profil</span>
              <p className="text-sm text-muted-foreground mt-1">
                Alamat dari profil Anda akan digunakan untuk pengiriman
              </p>
            </label>
          </div>
        </RadioGroup>
      ) : (
        <div className="border border-dashed border-input rounded-md p-6 text-center">
          <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-4">
            Belum ada alamat tersimpan. Tambahkan alamat untuk mempermudah checkout di masa depan.
          </p>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2 mx-auto">
                <Plus className="w-4 h-4" />
                Tambah Alamat
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tambah Alamat Baru</DialogTitle>
                <DialogDescription>
                  Tambahkan alamat pengiriman baru
                </DialogDescription>
              </DialogHeader>
              <AddressForm
                onSuccess={handleAddSuccess}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};
