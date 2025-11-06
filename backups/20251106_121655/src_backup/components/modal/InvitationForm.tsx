import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button"; // ganti jika kamu pakai komponen lain

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function InvitationModal({ isOpen, onClose }: Props) {
  const [formData, setFormData] = useState({
    namaPasangan: "",
    namaWanita: "",
    putriKe: "",
    ortuWanita: "",
    namaPria: "",
    putraKe: "",
    ortuPria: "",
    tglAcara: "",
    waktu1: "",
    lokasi1: "",
    waktu2: "",
    lokasi2: "",
    turutMengundang: "",
    instagram: "",
    noHp: "",
    alamat: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    onClose(); // atau lakukan submit ke API
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen bg-black/50 px-4">
        <Dialog.Panel className="bg-white max-w-2xl w-full rounded-xl p-6 space-y-4">
          <Dialog.Title className="text-xl font-semibold">Format Undangan</Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Nama Pasangan" name="namaPasangan" value={formData.namaPasangan} onChange={handleChange} />
              <Input label="Nama Mempelai Wanita" name="namaWanita" value={formData.namaWanita} onChange={handleChange} />
              <Input label="Putri ke-" name="putriKe" value={formData.putriKe} onChange={handleChange} />
              <Input label="Nama Orang Tua Wanita" name="ortuWanita" value={formData.ortuWanita} onChange={handleChange} />
              <Input label="Nama Mempelai Pria" name="namaPria" value={formData.namaPria} onChange={handleChange} />
              <Input label="Putra ke-" name="putraKe" value={formData.putraKe} onChange={handleChange} />
              <Input label="Nama Orang Tua Pria" name="ortuPria" value={formData.ortuPria} onChange={handleChange} />
              <Input label="Tanggal Acara" name="tglAcara" value={formData.tglAcara} onChange={handleChange} type="date" />
              <Input label="Waktu (1)" name="waktu1" value={formData.waktu1} onChange={handleChange} type="time" />
              <Input label="Lokasi Acara (1)" name="lokasi1" value={formData.lokasi1} onChange={handleChange} />
              <Input label="Waktu (2)" name="waktu2" value={formData.waktu2} onChange={handleChange} type="time" />
              <Input label="Lokasi Acara (2)" name="lokasi2" value={formData.lokasi2} onChange={handleChange} />
              <Input label="Turut Mengundang" name="turutMengundang" value={formData.turutMengundang} onChange={handleChange} />
              <Input label="Nama Instagram" name="instagram" value={formData.instagram} onChange={handleChange} />
              <Input label="Nomor HP" name="noHp" value={formData.noHp} onChange={handleChange} />
            </div>
            <div>
              <label className="block font-medium mb-1">Alamat Lengkap penerima undangan</label>
              <textarea
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                rows={3}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" onClick={onClose} variant="outline">Batal</Button>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

type InputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

const Input = ({ label, name, value, onChange, type = "text" }: InputProps) => (
  <div>
    <label htmlFor={name} className="block font-medium mb-1">{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full border rounded-md px-3 py-2"
    />
  </div>
);

