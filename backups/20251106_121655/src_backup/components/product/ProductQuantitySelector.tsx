import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon, RotateCcwIcon } from "lucide-react";

// 1. Tambahkan 'minOrder' ke dalam interface props
interface ProductQuantitySelectorProps {
  quantity: number;
  onQuantityChange: (change: number) => void;
  onReset?: () => void;
  minOrder: number; // Prop baru untuk kuantitas minimal
}

const ProductQuantitySelector = ({
  quantity,
  onQuantityChange,
  onReset,
  minOrder, // Terima prop baru
}: ProductQuantitySelectorProps) => {

  return (
    <div className="flex flex-col gap-4 my-4">
      <div className="flex items-center">
        <span className="mr-4 font-medium">Jumlah</span>
        <div className="flex items-center border rounded-md">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onQuantityChange(-100)}
            className="h-10 w-10"
            // 2. Gunakan 'minOrder' untuk menonaktifkan tombol secara dinamis
            disabled={quantity <= minOrder}
          >
            <MinusIcon className="h-4 w-4" />
          </Button>

          <span className="w-16 text-center font-semibold">{quantity}</span>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onQuantityChange(100)}
            className="h-10 w-10"
          >
            <PlusIcon className="h-4 w-4" />
          </Button>

          {/* Tombol reset bisa disembunyikan jika tidak ada fungsi onReset */}
          {onReset && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onReset}
              className="h-10 w-10 text-shop-dark-gray"
            >
              <RotateCcwIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductQuantitySelector;
