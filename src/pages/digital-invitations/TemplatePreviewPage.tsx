import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle, ShoppingCart, ArrowLeft, Smartphone, Monitor } from "lucide-react";
import { digitalInvitationService } from "@/features/digital-invitations/services/digitalInvitationService";
import { getTemplateComponent } from "@/features/digital-invitations/templates";
import { Button } from "@/components/ui/buttons/button";
import { Badge } from "@/components/ui/utils/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/features/cart/hooks/cart/use-cart";
import { toast } from "@/hooks/ui/use-toast";

/**
 * Template Preview Page with Watermark
 * 
 * Shows a preview of the invitation template with:
 * - Sample/placeholder data
 * - Watermark overlay ("PREVIEW ONLY")
 * - Desktop/Mobile view toggle
 * - CTA to purchase
 */
const TemplatePreviewPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const { data: templates, isLoading, error } = useQuery({
    queryKey: ["invitation-templates"],
    queryFn: digitalInvitationService.getTemplates,
  });

  const template = templates?.find(t => t.slug === slug);

  const handleAddToCart = async () => {
    if (!template) return;
    
    try {
      await addItem({ product_id: template.product_id, quantity: 1 });
      
      toast({
        title: "Ditambahkan ke keranjang",
        description: `${template.name} berhasil ditambahkan`,
      });
      
      navigate("/cart");
    } catch (error) {
      toast({
        title: "Gagal menambahkan",
        description: "Terjadi kesalahan, silakan coba lagi",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat preview template...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">
            Template Tidak Ditemukan
          </h1>
          <p className="text-muted-foreground mb-4">
            Maaf, template yang Anda cari tidak tersedia.
          </p>
          <Link to="/digital-templates">
            <Button>
              Lihat Semua Template
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get the template component from registry
  const TemplateComponent = getTemplateComponent(template.template_component);

  if (!TemplateComponent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">
            Template Tidak Tersedia
          </h1>
          <p className="text-muted-foreground mb-4">
            Component untuk template ini belum tersedia. Silakan pilih template lain.
          </p>
          <Link to="/digital-templates">
            <Button>Kembali</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Sample/placeholder data for preview
  const sampleData = {
    brideNickname: "Aisyah",
    groomNickname: "Ahmad",
    brideName: "Siti Aisyah binti Abdullah",
    groomName: "Muhammad Ahmad bin Umar",
    eventDate: "2025-12-25",
    eventTime: "09:00",
    venueName: "Masjid Al-Ikhlas",
    venueAddress: "Jl. Merdeka No. 123, Jakarta Selatan",
    venueMapUrl: "https://maps.google.com",
    additionalInfo: "Merupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.",
    photos: [] as string[],
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Toolbar */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Back Button */}
            <Link to="/digital-templates">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>

            {/* Template Info */}
            <div className="flex-1 text-center">
              <h1 className="text-lg font-semibold">{template.name}</h1>
              <p className="text-sm text-muted-foreground">
                Preview Mode
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <div className="flex bg-muted rounded-lg p-1">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={cn(
                    "px-3 py-1.5 rounded-md transition-colors",
                    viewMode === 'desktop' ? "bg-background shadow-sm" : "hover:bg-background/50"
                  )}
                >
                  <Monitor className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={cn(
                    "px-3 py-1.5 rounded-md transition-colors",
                    viewMode === 'mobile' ? "bg-background shadow-sm" : "hover:bg-background/50"
                  )}
                >
                  <Smartphone className="h-4 w-4" />
                </button>
              </div>

              {/* CTA Button */}
              <Button onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Beli ({formatPrice(template.price)})
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div
            className={cn(
              "relative bg-background shadow-2xl overflow-hidden transition-all duration-300",
              viewMode === 'desktop' ? "w-full max-w-5xl rounded-lg" : "w-full max-w-sm rounded-3xl border-8 border-gray-800"
            )}
            style={{
              height: viewMode === 'mobile' ? '667px' : 'auto',
            }}
          >
            {/* Watermark Overlay */}
            <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-full">
                {/* Multiple watermarks for better coverage */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-6xl font-bold text-gray-500/10 select-none"
                    style={{
                      transform: 'rotate(-45deg)',
                      top: `${15 + i * 20}%`,
                      left: viewMode === 'desktop' ? `${-10 + (i % 3) * 40}%` : '50%',
                      translateX: '-50%',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    PREVIEW ONLY
                  </div>
                ))}
              </div>
            </div>

            {/* Badge */}
            <div className="absolute top-4 right-4 z-40">
              <Badge className="bg-primary/90 backdrop-blur-sm">
                👁️ Mode Preview
              </Badge>
            </div>

            {/* Template Content */}
            <div className={cn(
              "overflow-auto",
              viewMode === 'mobile' && "h-full"
            )}>
              <TemplateComponent {...sampleData} />
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 max-w-3xl mx-auto bg-card border rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl">💡</div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Tentang Preview Ini</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ini adalah preview template dengan data contoh. Setelah membeli, Anda dapat:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Mengisi data pernikahan Anda sendiri</li>
                <li>✓ Upload foto pre-wedding (hingga 5 foto)</li>
                <li>✓ Customize warna dan tema</li>
                <li>✓ Menambahkan link Google Maps</li>
                <li>✓ Bagikan via WhatsApp, Instagram, dll</li>
                <li>✓ Aktif selama 12 bulan</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewPage;
