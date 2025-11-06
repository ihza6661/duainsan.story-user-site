const GuestbookVariantSelect = ({ value, onChange, variants }) => {
  return (
    <div className="flex flex-col gap-2 pt-2">
      <label className="text-sm">Tipe Guestbook</label>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="">-- Pilih Variant --</option>
        {variants?.map((variant) => (
          <option key={variant.type} value={variant.type}>
            {variant.type}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GuestbookVariantSelect;
