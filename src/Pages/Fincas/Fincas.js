import React, { useEffect, useState } from "react";
import styles from "./Fincas.module.css";
import ListaFincas from "../../Components/Fincas/ListaFincas";
import Inmueble from "../../Components/Fincas/Inmueble";
import { getFincas } from "../../Utils/Firebase/databaseFunctions";

const Fincas = () => {
  const [idInmueble, setIdInmueble] = useState(null);
  const [fincas, setFincas] = useState([]);

  useEffect(() => {
    async function fetchFincas() {
      try {
        const data = await getFincas();
        setFincas(data.data);
      } catch (error) {
        console.error("Hubo un error al obtener las fincas:", error);
        // Manejar el error según sea necesario
      }
    }

    fetchFincas();
  }, []); // El array vacío asegura que el efecto solo se ejecute una vez, después del montaje inicial

  const mostrarInmuebleId = async (id) => {
    setIdInmueble(id);
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
          <ListaFincas fincas={fincas} mostrarInmuebleId={mostrarInmuebleId} />
        )}
      </div>
    </div>
  );
};

export default Fincas;
