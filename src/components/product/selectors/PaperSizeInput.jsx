import { useState } from "react";

const PaperSizeInput = ({ onChange }) => {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState("cm");

  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    // Hanya angka dan titik
    if (/^\d*\.?\d*$/.test(value)) {
      setter(value);
      if (onChange) {
        onChange({
          width: parseFloat(value || 0),
          height: parseFloat(height || 0),
          unit,
        });
      }
    }
  };

  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    setUnit(newUnit);
    if (onChange) {
      onChange({
        width: parseFloat(width || 0),
        height: parseFloat(height || 0),
        unit: newUnit,
      });
    }
  };

  return (
    <div className="flex flex-col gap-2 max-w-xs">
      <label className="text-sm font-medium">Paper Size</label>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Width"
          value={width}
          onChange={handleInputChange(setWidth)}
          className="w-1/2 border rounded px-2 py-1"
        />
        <input
          type="text"
          placeholder="Height"
          value={height}
          onChange={handleInputChange(setHeight)}
          className="w-1/2 border rounded px-2 py-1"
        />
      </div>
      <select
        value={unit}
        onChange={handleUnitChange}
        className="border rounded px-2 py-1"
      >
        <option value="cm">Centimeter (cm)</option>
        <option value="inch">Inch (in)</option>
      </select>
    </div>
  );
};

export default PaperSizeInput;
