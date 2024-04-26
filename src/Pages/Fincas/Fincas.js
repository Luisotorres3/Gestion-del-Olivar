import React, { useState } from "react";
import styles from "./Fincas.module.css";
import ListaFincas from "../../Components/Fincas/ListaFincas";
import Inmueble from "../../Components/Fincas/Inmueble";
import { getFincaById } from "../../Utils/Firebase/databaseFunctions";
const Fincas = () => {
  const [idInmueble, setIdInmueble] = useState(null);

  const mostrarInmuebleId = (id) => {
    setIdInmueble(id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {idInmueble ? (
          <Inmueble
            finca={getFincaById(idInmueble)}
            mostrarInmuebleId={mostrarInmuebleId}
          />
        ) : (
          <ListaFincas mostrarInmuebleId={mostrarInmuebleId} />
        )}
      </div>
    </div>
  );
};

export default Fincas;
