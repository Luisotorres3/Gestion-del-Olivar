import React, { useEffect, useState } from "react";
import styles from "./Fincas.module.css";
import ListaFincas from "../../Components/Fincas/ListaFincas";
import Inmueble from "../../Components/Fincas/Inmueble";
import {
  deleteFincaById,
  getFincas,
} from "../../Utils/Firebase/databaseFunctions";

const Fincas = () => {
  const [idInmueble, setIdInmueble] = useState(null);
  const [fincas, setFincas] = useState([]);

  const fetchFincas = async () => {
    try {
      const data = await getFincas();
      setFincas(data.data);
    } catch (error) {
      console.error("Hubo un error al obtener las fincas:", error);
      // Manejar el error según sea necesario
    }
  };

  useEffect(() => {
    fetchFincas();
  }, []); // El array vacío asegura que el efecto solo se ejecute una vez, después del montaje inicial

  const mostrarInmuebleId = async (id) => {
    setIdInmueble(id);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "¿Estás seguro de que quieres borrar esta finca?"
    );

    if (isConfirmed) {
      try {
        const response = await deleteFincaById(id);
        console.log(`Finca ${id} borrada correctamente.`);
        fetchFincas();
      } catch (error) {
        console.log(`Finca ${id} no borrada correctamente.`);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {idInmueble ? (
          <Inmueble
            idInmueble={idInmueble}
            mostrarInmuebleId={mostrarInmuebleId}
          />
        ) : (
          <ListaFincas
            fincas={fincas}
            mostrarInmuebleId={mostrarInmuebleId}
            handleDelete={handleDelete}
            fetchFincas={fetchFincas}
          />
        )}
      </div>
    </div>
  );
};

export default Fincas;
