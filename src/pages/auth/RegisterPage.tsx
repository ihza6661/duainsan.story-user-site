import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom"; // ⬅ Import for navigation
import { useRegister } from "@/features/auth/hooks/useRegister";
import type { RegisterPayload } from "@/features/auth/services/auth/authService";
import { Button } from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/forms/input";

const RegisterPage = () => {
  const [formData, setFormData] = useState<RegisterPayload>({
    full_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone_number: "",
  });

  const {
    isLoading,
    error,
    validationErrors,
    successMessage,
    performRegister,
  } = useRegister();
  const [clientError, setClientError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setClientError(null);

    if (formData.password !== formData.password_confirmation) {
      setClientError("Password dan konfirmasi password tidak cocok.");
      return;
    }

    await performRegister(formData);
  };

  useEffect(() => {
    if (successMessage) {
      // Reset form
      setFormData({
        full_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone_number: "",
      });

      // Redirect after 1 second (optional delay so user can see the success message)
      setTimeout(() => {
        navigate("/login"); // ⬅ Go to login page
      }, 2000);
    }
  }, [successMessage, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl shadow-lg"
        noValidate
      >
        <h2 className="text-2xl font-normal tracking-wider text-card-foreground text-center">
          Buat Akun
        </h2>

        {successMessage && (
          <div className="p-3 text-sm text-center text-emerald-800 bg-emerald-100 rounded-md">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="p-3 text-sm text-center text-destructive-foreground bg-destructive/10 rounded-md">
            {error}
          </div>
        )}

        {clientError && (
          <div className="p-3 text-sm text-center text-destructive-foreground bg-destructive/10 rounded-md">
            {clientError}
          </div>
        )}

        {/* Input fields */}
        <div className="space-y-1">
          <Input
            id="full_name"
            type="text"
            name="full_name"
            // label="Nama Lengkap"
            placeholder="Nama Lengkap"
            required
            value={formData.full_name}
            onChange={handleChange}
          />
          {validationErrors?.full_name && (
            <p className="text-destructive text-xs mt-1">
              {validationErrors.full_name[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="email@gmail.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
          {validationErrors?.email && (
            <p className="text-destructive text-xs mt-1">
              {validationErrors.email[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="Minimal 8 karakter"
            required
            value={formData.password}
            onChange={handleChange}
          />
          {validationErrors?.password && (
            <p className="text-destructive text-xs mt-1">
              {validationErrors.password[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Input
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            placeholder="Ulangi password Anda"
            required
            value={formData.password_confirmation}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1">
          <Input
            id="phone_number"
            type="tel"
            name="phone_number"
            // label={<span>Nomor Telepon <span className="text-muted-foreground">(Opsional)</span></span>}
            placeholder="081234567890"
            value={formData.phone_number || ""}
            onChange={handleChange}
          />
          {validationErrors?.phone_number && (
            <p className="text-destructive text-xs mt-1">
              {validationErrors.phone_number[0]}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-md hover:bg-primary/90 transition-colors duration-300 disabled:bg-primary/50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Mendaftar..." : "Daftar"}
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
