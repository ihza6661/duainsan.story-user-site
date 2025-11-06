// src/components/product/AddOnSelector.tsx (Updated)

import React from 'react';
import { AddOn } from '@/services/productService';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface AddOnSelectorProps {
  addOns: AddOn[];
  selectedAddOnIds: number[];
  onAddOnChange: (addOnId: number, isSelected: boolean) => void;
}

const AddOnSelector: React.FC<AddOnSelectorProps> = ({ addOns, selectedAddOnIds, onAddOnChange }) => {
  // If there are no add-ons for this product, render nothing.
  if (!addOns || addOns.length === 0) {
    return null;
  }

  return (
    <div>
      <Label className="font-semibold text-base">Pilih Tambahan</Label>
      {/* Added a border and padding for better visual grouping */}
      <div className="mt-2 space-y-1 border p-4 rounded-lg">
        {addOns.map((addOn) => (
          <div
            key={addOn.id}
            // The whole row is now clickable
            onClick={() => onAddOnChange(addOn.id, !selectedAddOnIds.includes(addOn.id))}
            className="flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-colors hover:bg-accent"
          >
            <Checkbox
              id={`addon-${addOn.id}`}
              checked={selectedAddOnIds.includes(addOn.id)}
              // The parent div's onClick now handles the logic
              onCheckedChange={() => { }}
            />
            <Label
              htmlFor={`addon-${addOn.id}`}
              className="flex justify-between w-full cursor-pointer text-sm"
            >
              <span className="">{addOn.name}</span>
              <span className="font-medium text-green-600">
                (+{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(addOn.price)})
              </span>
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddOnSelector;
