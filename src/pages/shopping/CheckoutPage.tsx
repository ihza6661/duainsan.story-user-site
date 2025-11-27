import { useState, useEffect, FormEvent } from "react";
import { useCart } from "@/features/cart/hooks/cart/use-cart";
import { Button } from "@/components/ui/buttons/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/utils/card";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/forms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/forms/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/forms/radio-group";
import { Loader2, ShoppingCart } from "lucide-react";
import { formatRupiah, getImageUrl } from "@/lib/utils";
import {
  createGuestOrder,
  createOrder,
  calculateShippingCost,
  type ShippingService,
} from "@/features/order/services/checkoutService";
import { AxiosError } from "axios";

import { useAuth } from "@/features/auth/hooks/useAuth";

import { useToast } from "@/hooks/ui/use-toast";
import { Textarea } from "@/components/ui/forms/textarea";

import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { cart, isLoading } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snapToken, setSnapToken] = useState<string | null>(null);
  const [paymentOption, setPaymentOption] = useState("full");

  // Shipping State
  const [shippingServices, setShippingServices] = useState<ShippingService[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<string>("jne");
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [shippingService, setShippingService] = useState<string>("");
  const [shippingSelection, setShippingSelection] = useState<string>("");
  const [isCalculatingCost, setIsCalculatingCost] = useState(false);
  const [calculatedWeight, setCalculatedWeight] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Login Diperlukan",
        description:
          "Mohon login untuk melanjutkan checkout. Checkout sebagai tamu tidak didukung tanpa alamat profil.",
        variant: "destructive",
      });
      return;
    }

    if (!user.phone_number) {
      toast({
        title: "Nomor Telepon Tidak Ditemukan",
        description:
          "Mohon tambahkan nomor telepon Anda di halaman profil sebelum melanjutkan checkout.",
        variant: "destructive",
      });
      return;
    }

    if (!user.address || !user.postal_code) {
      toast({
        title: "Alamat Profil Tidak Lengkap",
        description:
          "Mohon lengkapi alamat Anda di halaman profil sebelum melanjutkan checkout.",
        variant: "destructive",
      });
      return;
    }

    if (!cart || cart.items.length === 0) {
  setShippingServices([]);
  setShippingService("");
  setShippingSelection("");
  setShippingCost(0);
      setCalculatedWeight(null);
      return;
    }

    setCalculatedWeight(typeof cart.total_weight === "number" ? cart.total_weight : null);

    const fetchShippingCost = async () => {
      setIsCalculatingCost(true);
      try {
        const response = await calculateShippingCost(String(user.postal_code), selectedCourier);

        let services: ShippingService[] = [];
        if (response?.rajaongkir?.results?.length) {
          services = response.rajaongkir.results[0].costs ?? [];
        } else if (Array.isArray(response?.data)) {
          services = response.data.map((service) => ({
            service: service.service,
            description: service.description,
            cost: [
              {
                value: service.cost,
                etd: service.etd ?? "",
                note: "",
              },
            ],
          }));
        }

  setShippingServices(services);
  setShippingService("");
  setShippingSelection("");
  setShippingCost(0);

        if (typeof response?.total_weight === "number") {
          setCalculatedWeight(response.total_weight);
        } else if (typeof cart.total_weight === "number") {
          setCalculatedWeight(cart.total_weight);
        } else {
          setCalculatedWeight(null);
        }

        if (services.length === 0) {
          toast({
            title: "Layanan Pengiriman Tidak Tersedia",
            description: "Tidak ada layanan pengiriman yang tersedia untuk kombinasi alamat dan courier ini.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching shipping cost:", error);
  setShippingServices([]);
  setShippingService("");
  setShippingSelection("");
  setShippingCost(0);
        setCalculatedWeight(cart.total_weight ?? null);
        toast({
          title: "Gagal Menghitung Biaya Kirim",
          description: "Tidak dapat mengambil data biaya pengiriman.",
          variant: "destructive",
        });
      } finally {
        setIsCalculatingCost(false);
      }
    };

    fetchShippingCost();
  }, [
    cart,
    selectedCourier,
    toast,
    user,
  ]);

  // Load Midtrans Script Dynamically
  useEffect(() => {
    const loadMidtransScript = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
        const url = baseUrl.endsWith('/v1') ? `${baseUrl}/config/payment` : `${baseUrl}/v1/config/payment`;
        const response = await fetch(url);
        const config = await response.json();

        const scriptUrl = config.snap_url;
        const clientKey = config.client_key;

        if (document.querySelector(`script[src="${scriptUrl}"]`)) return;

        const script = document.createElement("script");
        script.src = scriptUrl;
        script.setAttribute("data-client-key", clientKey);
        script.async = true;
        document.body.appendChild(script);

        return () => {
          document.body.removeChild(script);
        };
      } catch (error) {
        console.error("Failed to load payment config", error);
        toast({
          title: "Gagal Memuat Konfigurasi Pembayaran",
          description: "Silakan refresh halaman.",
          variant: "destructive",
        });
      }
    };

    loadMidtransScript();
  }, [toast]);

  const handleServiceSelection = (value: string) => {
    setShippingSelection(value);

    const [service, cost] = value.split("|");
    setShippingService(service);

    const parsedCost = Number(cost);
    setShippingCost(Number.isFinite(parsedCost) ? parsedCost : 0);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (shippingCost === 0 && cart && cart.total_weight > 0) {
      toast({
        title: "Pilih Layanan Pengiriman",
        description: "Anda harus memilih layanan pengiriman terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const fullAddress = [
      user?.address,
      user?.city_name,
      user?.province_name,
      user?.postal_code,
    ]
      .filter(Boolean)
      .join(", ");

    formData.append("shipping_address", fullAddress);
    formData.append("postal_code", String(user?.postal_code));
    formData.append("courier", selectedCourier);
    formData.append("shipping_cost", String(shippingCost));
    formData.append("shipping_service", shippingService);
    formData.append("payment_option", paymentOption);

    try {
      const order = user
        ? await createOrder(formData)
        : await createGuestOrder(formData);
      setSnapToken(order.snap_token);

      if (order.snap_token) {
        window.snap.pay(order.snap_token, {
          onSuccess: function (result) {
            console.log("success", result);
            toast({
              title: "Pembayaran Berhasil!",
              description: "Anda akan diarahkan ke halaman konfirmasi pesanan.",
            });
            navigate(`/order-confirmation/${order.data.id}`);
          },
          onPending: function (result) {
            console.log("pending", result);
            toast({
              title: "Pembayaran Tertunda",
              description: "Selesaikan pembayaran Anda sebelum batas waktu.",
            });
            navigate(`/order-confirmation/${order.data.id}`);
          },
          onError: function (result) {
            console.log("error", result);
            toast({
              title: "Pembayaran Gagal",
              description: "Silakan coba lagi.",
              variant: "destructive",
            });
          },
          onClose: function () {
            toast({
              title: "Pembayaran Dibatalkan",
              description:
                "Anda dapat melanjutkan pembayaran nanti dari halaman pesanan Anda.",
            });
          },
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<{
        message: string;
        errors?: Record<string, string[]>;
      }>;
      console.error("Checkout error:", axiosError);
      const errorMessage = axiosError.response?.data?.errors
        ? Object.values(axiosError.response.data.errors).flat().join("\n")
        : axiosError.response?.data?.message || "Terjadi kesalahan.";
      toast({
        title: "Gagal Membuat Pesanan",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-20 mx-auto text-center py-20">
        <Loader2 className="h-20 w-20 mx-auto text-muted-foreground animate-spin" />
        <h1 className="text-3xl font-semibold mt-4">Memuat Keranjang...</h1>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mt-20 mx-auto text-center py-20">
        <ShoppingCart className="h-20 w-20 mx-auto text-muted-foreground" />
        <h1 className="text-3xl font-semibold mt-4">Keranjang Anda Kosong</h1>
        <p className="text-muted-foreground mt-2">
          Anda tidak bisa melanjutkan ke checkout karena keranjang kosong.
        </p>
      </div>
    );
  }

  return (
    <div className="container mt-20 mx-auto px-4 py-0 sm:py-6">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Checkout</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Kontak Anda</CardTitle>
              <p className="text-sm text-muted-foreground">
                Kami akan mengirimkan konfirmasi pesanan ke email ini.
              </p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer_name">Nama Anda</Label>
                <Input
                  id="customer_name"
                  name="customer_name"
                  defaultValue={user?.full_name}
                  placeholder="Nama Lengkap Anda"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_email">Email Anda</Label>
                <Input
                  id="customer_email"
                  name="customer_email"
                  type="email"
                  defaultValue={user?.email}
                  placeholder="email@example.com"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Shipping Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Alamat Pengiriman</CardTitle>
              <p className="text-sm text-muted-foreground">
                Alamat pengiriman dari profil anda
              </p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Provinsi</Label>
                <p className="text-sm text-muted-foreground">
                  {user?.province_name || ""}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Kota/Kabupaten</Label>
                <p className="text-sm text-muted-foreground">
                  {user?.city_name || ""}
                </p>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="shipping_address">Alamat Lengkap</Label>
                <p className="text-sm text-muted-foreground">
                  {user?.address || ""}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Kode Pos</Label>
                <p className="text-sm text-muted-foreground">
                  {user?.postal_code || ""}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Form Data Pernikahan */}
          <Card>
            <CardHeader>
              <CardTitle>Data Pernikahan</CardTitle>
              <p className="text-sm text-muted-foreground">
                Isi detail lengkap untuk undangan Anda.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Data Mempelai */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Data Mempelai
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bride_full_name">
                      Nama Lengkap Mempelai Wanita
                    </Label>
                    <Input
                      id="bride_full_name"
                      name="bride_full_name"
                      placeholder="Adinda Putri"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groom_full_name">
                      Nama Lengkap Mempelai Pria
                    </Label>
                    <Input
                      id="groom_full_name"
                      name="groom_full_name"
                      placeholder="Budi Setiawan"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bride_nickname">
                      Nama Panggilan Mempelai Wanita
                    </Label>
                    <Input
                      id="bride_nickname"
                      name="bride_nickname"
                      placeholder="Dinda"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groom_nickname">
                      Nama Panggilan Mempelai Pria
                    </Label>
                    <Input
                      id="groom_nickname"
                      name="groom_nickname"
                      placeholder="Budi"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bride_parents">
                      Nama Orang Tua Mempelai Wanita
                    </Label>
                    <Input
                      id="bride_parents"
                      name="bride_parents"
                      placeholder="Bpk. Hermawan & Ibu Sri Lestari"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groom_parents">
                      Nama Orang Tua Mempelai Pria
                    </Label>
                    <Input
                      id="groom_parents"
                      name="groom_parents"
                      placeholder="Bpk. Agus Salim & Ibu Wati"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border"></div>

              {/* Detail Acara */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-4">
                  <h3 className="text-foreground text-lg font-semibold">
                    Detail Akad Nikah
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="akad_date">Tanggal Akad</Label>
                    <Input
                      id="akad_date"
                      name="akad_date"
                      type="date"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="akad_time">Waktu Akad</Label>
                    <Input
                      id="akad_time"
                      name="akad_time"
                      placeholder="09:00 WIB"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="akad_location">Lokasi Akad</Label>
                    <Input
                      id="akad_location"
                      name="akad_location"
                      placeholder="Masjid Raya Mujahidin"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-foreground text-lg font-semibold">
                    Detail Resepsi
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="reception_date">Tanggal Resepsi</Label>
                    <Input
                      id="reception_date"
                      name="reception_date"
                      type="date"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reception_time">Waktu Resepsi</Label>
                    <Input
                      id="reception_time"
                      name="reception_time"
                      placeholder="19:00 WIB"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reception_location">Lokasi Resepsi</Label>
                    <Input
                      id="reception_location"
                      name="reception_location"
                      placeholder="Gedung Pontianak Convention Center"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border"></div>

              {/* Data Pendukung */}
              <div className="space-y-4">
                <h3 className="text-foreground text-lg font-semibold">
                  Data Pendukung (Opsional)
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="gmaps_link">Link Google Maps</Label>
                  <Input
                    id="gmaps_link"
                    name="gmaps_link"
                    type="url"
                    placeholder="https://maps.app.goo.gl/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prewedding_photo">Foto Pre-wedding</Label>
                  <Input
                    id="prewedding_photo"
                    name="prewedding_photo"
                    type="file"
                    className="hover:bg-primary cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Unggah satu foto untuk desain undangan Anda.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cart.items.map((item) => {
                  const getImageUrlForItem = () => {
                    let imageToRender = null;
                    const featuredVariantImage = item.variant?.images?.find(
                      (img) => img.is_featured
                    );
                    if (featuredVariantImage) {
                      imageToRender = featuredVariantImage;
                    }
                    if (!imageToRender && item.product.featured_image) {
                      imageToRender = item.product.featured_image;
                    }
                    if (
                      !imageToRender &&
                      item.variant?.images?.length > 0
                    ) {
                      imageToRender = item.variant.images[0];
                    }
                    return imageToRender
                      ? getImageUrl(imageToRender.image_url)
                      : "/placeholder.svg";
                  };
                  const imageUrl = getImageUrlForItem();

                  return (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center space-x-2">
                        <img
                          src={imageUrl}
                          alt={item.product?.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="text-sm font-medium">
                            {item.product?.name} x {item.quantity}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.customizations?.options
                              ?.map(
                                (opt: { name: string; value: string }) =>
                                  opt.value
                              )
                              .join(" / ")}
                          </p>
                        </div>
                      </div>
                      <span>{formatRupiah(item.sub_total)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <Label htmlFor="courier">Kurir</Label>
                <Select
                  onValueChange={setSelectedCourier}
                  value={selectedCourier}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kurir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jne">JNE</SelectItem>
                    <SelectItem value="pos">POS Indonesia</SelectItem>
                    <SelectItem value="jnt">J&T</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <Label htmlFor="shipping-service">Layanan Pengiriman</Label>
                <Select
                  onValueChange={handleServiceSelection}
                  value={shippingSelection}
                  disabled={isCalculatingCost || shippingServices.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isCalculatingCost ? "Menghitung..." : "Pilih layanan"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {shippingServices.map((service) => {
                      const primaryCost = service.cost[0];
                      if (!primaryCost) {
                        return null;
                      }

                      const costValue = Number(primaryCost.value);
                      if (!Number.isFinite(costValue)) {
                        return null;
                      }

                      return (
                        <SelectItem
                          key={service.service}
                          value={`${service.service}|${costValue}`}
                        >
                          <div className="flex justify-between w-full">
                            <span>
                              {service.description} ({service.service})
                            </span>
                            <span>{formatRupiah(costValue)}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              {calculatedWeight !== null && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Berat Dihitung</span>
                  <span>{calculatedWeight.toLocaleString("id-ID")} gr</span>
                </div>
              )}
              <div className="border-t border-border pt-4 flex justify-between">
                <span>Subtotal</span>
                <span>{formatRupiah(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>
                  Biaya Pengiriman
                  {shippingService ? ` (${shippingService})` : ""}
                </span>
                <span>{formatRupiah(shippingCost)}</span>
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <Label>Opsi Pembayaran</Label>
                <RadioGroup
                  defaultValue="full"
                  onValueChange={setPaymentOption}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="full" />
                    <Label htmlFor="full">Bayar Lunas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dp" id="dp" />
                    <Label htmlFor="dp">Down Payment (50%)</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="border-t border-border pt-4 flex justify-between text-lg font-bold">
                <span>Total Pembayaran</span>
                <span>
                  {formatRupiah(
                    paymentOption === "dp"
                      ? (cart.subtotal + shippingCost) * 0.5
                      : cart.subtotal + shippingCost
                  )}
                </span>
              </div>
              <Button
                type="submit"
                variant="default"
                className="w-full"
                disabled={
                  isSubmitting ||
                  isCalculatingCost ||
                  !user ||
                  !user.phone_number ||
                  !user.postal_code ||
                  (shippingCost === 0 && cart && cart.total_weight > 0)
                }
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Buat Pesanan
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
