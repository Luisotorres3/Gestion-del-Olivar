import React, { useEffect, useState } from "react";
import styles from "./Gestion.module.css";
import { Tooltip } from "react-tooltip";
import { getFincaById } from "../../Utils/Firebase/databaseFunctions";
const Inmueble = ({ idInmueble, mostrarInmuebleId }) => {
  const [finca, setFinca] = useState(null);

  useEffect(() => {
    if (idInmueble !== null) {
      const fetchFinca = async () => {
        try {
          const fincaData = await getFincaById(idInmueble);
          setFinca(fincaData);
        } catch (error) {
          console.error("Error al obtener la finca:", error);
        }
      };

      fetchFinca();
    }
  }, [idInmueble]);

  return (
    <div className={styles.container}>
      {finca && (
        <div className={`${styles.content} ${styles.contentInmueble}`}>
          <div className={styles.title}>
            <i
              className="fa fa-arrow-left"
              aria-hidden="true"
              data-tooltip-id="back"
              data-tooltip-content="Volver"
              data-tooltip-place="top"
              onClick={() => mostrarInmuebleId(null)}
            >
              <Tooltip id="back" style={{ zIndex: "9999" }} />
            </i>
            <h1>Volver</h1>
          </div>
          <div className={styles.fincas}>
            <div className={styles.infoFinca}>
              <h2>Información Finca</h2>
              <div className={styles.infoDiv}>
                <h3>Referencia Catastral:</h3>
                <p>{finca.referenciaCatastral}</p>
              </div>
              <div className={styles.infoDiv}>
                <h3>Localización:</h3>
                <p>{`${finca.localizacion.direccion}, ${finca.localizacion.municipio}, ${finca.localizacion.codigoPostal}, ${finca.localizacion.pais}`}</p>
              </div>
              <div className={styles.infoDiv}>
                <h3>Clase:</h3>
                <p>{finca.clase}</p>
              </div>
              <div className={styles.infoDiv}>
                <h3>Uso Principal:</h3>
                <p>{finca.usoPrincipal}</p>
              </div>
              <div className={styles.infoDiv}>
                <h3>Superficie Construida:</h3>
                <p>{finca.superficieConstruida}</p>
              </div>
              <div className={styles.infoDiv}>
                <h3>Año de Construcción:</h3>
                <p>{finca.anoConstruccion}</p>
              </div>
              <div className={styles.infoDiv}>
                <h3>Número de Olivos</h3>
                <p>{finca.numOlivos}</p>
              </div>
            </div>
            <div className={styles.infoFinca}>
              <h2>Información Parcela</h2>
              <div className={styles.infoDiv}>
                <h3>Localización:</h3>
                <p></p>
              </div>
              <div className={styles.infoDiv}>
                <h3>Superficie Gráfica:</h3>
                <p>{finca.superficieConstruida}</p>
              </div>
            </div>
            <div className={styles.infoFinca}>
              <h2>Información Cultivo</h2>
              <div className={styles.infoDiv}>
                <h3>Tipo de Cultivo:</h3>
                <p></p>
              </div>
              <div className={styles.infoDiv}>
                <h3>Número de árboles:</h3>
                <p>{finca.superficieConstruida}</p>
              </div>
              <div className={styles.infoDiv}>
                <h3>Histórico de producción:</h3>
                <p>{finca.superficieConstruida}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inmueble;
