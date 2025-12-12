import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/utils/card";
import { Button } from "@/components/ui/buttons/button";
import { Badge } from "@/components/ui/utils/badge";
import { Skeleton } from "@/components/ui/utils/skeleton";
import { Eye, ShoppingCart, Sparkles } from "lucide-react";
import { digitalInvitationService } from "@/features/digital-invitations/services/digitalInvitationService";
import { useCart } from "@/features/cart/hooks/cart/use-cart";
import { toast } from "@/hooks/ui/use-toast";
import { getImageUrl } from "@/lib/utils";

const DigitalTemplatesPage = () => {
  const { data: templates, isLoading } = useQuery({
    queryKey: ["invitation-templates"],
    queryFn: digitalInvitationService.getTemplates,
  });

  const { addItem } = useCart();

  const handleAddToCart = async (productId: number, productName: string) => {
    try {
      // Add digital product to cart
      await addItem({ product_id: productId, quantity: 1 });

      toast({
        title: "Ditambahkan ke keranjang",
        description: `${productName} berhasil ditambahkan`,
      });
    } catch (error) {
      toast({
        title: "Gagal menambahkan",
        description: "Terjadi kesalahan, silakan coba lagi",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-6 w-96 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-64 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 sm:py-28">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Undangan Digital Modern</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Template Undangan Digital
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pilih template undangan digital yang sempurna untuk hari spesial
            Anda. Mudah dikustomisasi, ramah lingkungan, dan dapat dibagikan
            dengan mudah.
          </p>
        </div>

        {/* Features Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-card p-6 rounded-lg border text-center">
            <div className="text-3xl mb-2">🌿</div>
            <h3 className="font-semibold mb-1">Ramah Lingkungan</h3>
            <p className="text-sm text-muted-foreground">
              Tanpa kertas, lebih hemat biaya
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold mb-1">Instan & Mudah</h3>
            <p className="text-sm text-muted-foreground">
              Aktif langsung setelah pembayaran
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border text-center">
            <div className="text-3xl mb-2">🔗</div>
            <h3 className="font-semibold mb-1">Share Link</h3>
            <p className="text-sm text-muted-foreground">
              Bagikan via WhatsApp, Instagram, dsb
            </p>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates?.map((template) => (
            <Card
              key={template.id}
              className="overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Template Preview */}
              <div className="relative h-64 bg-muted overflow-hidden">
                <img
                  src={getImageUrl(template.thumbnail_image)}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                  <Link to={`/digital-templates/${template.slug}`}>
                    <Button variant="secondary" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Lihat Detail
                    </Button>
                  </Link>
                </div>

                {/* Popular Badge */}
                {template.usage_count > 10 && (
                  <Badge className="absolute top-4 right-4 bg-yellow-500 hover:bg-yellow-600">
                    ⭐ Populer
                  </Badge>
                )}
              </div>

              <CardHeader>
                <CardTitle className="text-xl">{template.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {template.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(template.price)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(template.price * 1.5)}
                  </span>
                </div>

                <div className="text-sm text-muted-foreground mb-2">
                  ✓ Gratis 1 tahun hosting
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  ✓ Unlimited views
                </div>
                <div className="text-sm text-muted-foreground">
                  ✓ Upload foto (max 5)
                </div>
              </CardContent>

              <CardFooter className="gap-2">
                <Button
                  className="flex-1"
                  onClick={() =>
                    handleAddToCart(template.product_id, template.name)
                  }
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Beli Sekarang
                </Button>
                <Link to={`/digital-templates/${template.slug}`}>
                  <Button variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      {/* Empty State */}
      {templates && templates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Belum ada template tersedia saat ini
          </p>
        </div>
      )}
    </div>
  );
};

export default DigitalTemplatesPage;
