import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/buttons/button";
import { formatRupiah } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { ShoppingBag } from "lucide-react";

interface MobileCartSummaryBarProps {
  itemCount: number;
  subtotal: number;
  isMutating?: boolean;
  onCheckoutClick?: () => void;
}

/**
 * Mobile-only fixed bottom bar showing cart summary
 * Hides on scroll down, shows on scroll up for better UX
 * Only visible on screens < md breakpoint (768px)
 */
export function MobileCartSummaryBar({
  itemCount,
  subtotal,
  isMutating = false,
  onCheckoutClick,
}: MobileCartSummaryBarProps) {
  const navigate = useNavigate();
  const { isVisible } = useScrollDirection({ threshold: 10 });

  const handleCheckout = () => {
    if (onCheckoutClick) {
      onCheckoutClick();
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div
      className={`
        md:hidden fixed bottom-0 left-0 right-0 z-40 
        border-t backdrop-blur-md bg-background/95 shadow-lg
        transition-transform duration-300 ease-in-out
        ${isVisible ? "translate-y-0" : "translate-y-full"}
      `}
      role="region"
      aria-label="Cart summary"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center gap-4">
          {/* Left side: Item count + Total */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <ShoppingBag className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            </div>
            <p className="font-bold text-lg leading-none truncate">
              {formatRupiah(subtotal)}
            </p>
          </div>

          {/* Right side: Checkout button */}
          <Button
            onClick={handleCheckout}
            className="flex-shrink-0 shadow-sm"
            disabled={isMutating}
            size="default"
          >
            Checkout
          </Button>
        </div>
      </div>

      {/* Safe area padding for iOS devices */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  );
}
