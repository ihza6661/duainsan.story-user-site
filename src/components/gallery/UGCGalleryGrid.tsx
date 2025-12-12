import { useState } from "react";
import { Instagram, X } from "lucide-react";
import type { UGCItem } from "@/services/api/ugcService";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialogs/dialog";

interface UGCGalleryGridProps {
  items: UGCItem[];
  onItemClick?: (item: UGCItem) => void;
}

export const UGCGalleryGrid = ({ items, onItemClick }: UGCGalleryGridProps) => {
  const [selectedItem, setSelectedItem] = useState<UGCItem | null>(null);

  const handleItemClick = (item: UGCItem) => {
    setSelectedItem(item);
    onItemClick?.(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer"
            onClick={() => handleItemClick(item)}
          >
            {/* Image */}
            <img
              src={item.image_url}
              alt={item.caption || "User photo"}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />

            {/* Featured Badge */}
            {item.is_featured && (
              <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded">
                Featured
              </div>
            )}

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
              {item.caption && (
                <p className="text-white text-sm text-center line-clamp-3 mb-2">
                  {item.caption}
                </p>
              )}
              {item.user && (
                <p className="text-white/80 text-xs">by {item.user.name}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={!!selectedItem} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl p-0">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {selectedItem && (
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="md:w-2/3 bg-black flex items-center justify-center">
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.caption || "User photo"}
                  className="max-h-[80vh] w-full object-contain"
                />
              </div>

              {/* Details */}
              <div className="md:w-1/3 p-6 flex flex-col">
                {selectedItem.user && (
                  <div className="mb-4">
                    <p className="font-semibold text-lg">{selectedItem.user.name}</p>
                    {selectedItem.instagram_handle && (
                      <a
                        href={`https://instagram.com/${selectedItem.instagram_handle.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-pink-500 hover:text-pink-600 flex items-center gap-1"
                      >
                        <Instagram className="w-4 h-4" />
                        @{selectedItem.instagram_handle.replace('@', '')}
                      </a>
                    )}
                  </div>
                )}

                {selectedItem.caption && (
                  <div className="mb-4">
                    <p className="text-muted-foreground">{selectedItem.caption}</p>
                  </div>
                )}

                {selectedItem.product && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">Product:</p>
                    <a
                      href={`/product/${selectedItem.product.slug}`}
                      className="text-primary hover:underline"
                    >
                      {selectedItem.product.name}
                    </a>
                  </div>
                )}

                {selectedItem.instagram_url && (
                  <a
                    href={selectedItem.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80"
                  >
                    <Instagram className="w-4 h-4" />
                    View on Instagram
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
