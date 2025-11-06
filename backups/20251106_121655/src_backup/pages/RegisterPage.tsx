import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom"; // ⬅ Import for navigation
import { useRegister } from "../hooks/useRegister";
import type { RegisterPayload } from "../services/authService";

const RegisterPage = () => {
  const [formData, setFormData] = useState<RegisterPayload>({
    full_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone_number: "",
  });

  const { isLoading, error, validationErrors, successMessage, performRegister } = useRegister();
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg"
        noValidate
      >
        <h2 className="text-2xl font-normal tracking-wider text-gray-800 text-center">Buat Akun</h2>

        {successMessage && (
          <div className="p-3 text-sm text-center text-green-800 bg-green-100 rounded-md">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="p-3 text-sm text-center text-red-800 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        {clientError && (
          <div className="p-3 text-sm text-center text-red-800 bg-red-100 rounded-md">
            {clientError}
          </div>
        )}

        {/* Input fields */}
        <div className="space-y-1">
          <label htmlFor="full_name" className="text-sm font-medium text-gray-700">
            Nama Lengkap
          </label>
          <input
            id="full_name"
            type="text"
            name="full_name"
            placeholder=""
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
            value={formData.full_name}
            onChange={handleChange}
          />
          {validationErrors?.full_name && (
            <p className="text-red-600 text-xs mt-1">{validationErrors.full_name[0]}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="email@gmail.com"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
            value={formData.email}
            onChange={handleChange}
          />
          {validationErrors?.email && (
            <p className="text-red-600 text-xs mt-1">{validationErrors.email[0]}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Minimal 8 karakter"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
            value={formData.password}
            onChange={handleChange}
          />
          {validationErrors?.password && (
            <p className="text-red-600 text-xs mt-1">{validationErrors.password[0]}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">
            Konfirmasi Password
          </label>
          <input
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            placeholder="Ulangi password Anda"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
            value={formData.password_confirmation}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="phone_number" className="text-sm font-medium text-gray-700">
            Nomor Telepon <span className="text-gray-500">(Opsional)</span>
          </label>
          <input
            id="phone_number"
            type="tel"
            name="phone_number"
            // placeholder="081234567890"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
            value={formData.phone_number || ""}
            onChange={handleChange}
          />
          {validationErrors?.phone_number && (
            <p className="text-red-600 text-xs mt-1">{validationErrors.phone_number[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white font-semibold py-2.5 rounded-md hover:bg-gray-800 transition-colors duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isLoading ? "Mendaftar..." : "Daftar"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
