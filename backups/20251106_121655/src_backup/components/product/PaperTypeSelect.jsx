const PaperTypeSelect = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-2 pt-2">
      <label className="text-sm">Jenis Kertas</label>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="">-- Pilih Jenis Kertas --</option>
        <option value="jasmine">Kertas Jasmine</option>
        <option value="photo">Kertas Foto</option>
        <option value="brief">Kertas Manila</option>
      </select>
    </div>
  );
};

export default PaperTypeSelect;
