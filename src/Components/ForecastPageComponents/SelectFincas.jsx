import React from "react";
function SelectFincas({ fincas, selectedFinca, handleChange }) {
  return (
    fincas && (
      <select value={selectedFinca} onChange={handleChange}>
        {fincas.map((item) => (
          <option key={item.id} value={item.data.localizacion.municipio}>
            {item.data.localizacion.municipio}
          </option>
        ))}
      </select>
    )
  );
}
export default SelectFincas;
