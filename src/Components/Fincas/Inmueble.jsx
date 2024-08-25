import React, { useEffect, useState } from "react";
import styles from "./Gestion.module.css"; // Importa los estilos específicos para este componente
import { Tooltip } from "react-tooltip"; // Importa el componente Tooltip para mostrar información adicional
import { getFincaById } from "../../Utils/Firebase/databaseFunctions"; // Importa la función para obtener una finca por su ID

const Inmueble = ({ idInmueble, mostrarInmuebleId }) => {
  // Estado para almacenar la información de la finca seleccionada
  const [finca, setFinca] = useState(null);

  // Efecto secundario para obtener la finca cuando se monta el componente o cambia el ID
  useEffect(() => {
    if (idInmueble !== null) {
      const fetchFinca = async () => {
        try {
          // Llama a la función para obtener los datos de la finca
          const fincaData = await getFincaById(idInmueble);
          setFinca(fincaData); // Actualiza el estado con los datos obtenidos
        } catch (error) {
          console.error("Error al obtener la finca:", error);
          // Manejo del error en caso de que la solicitud falle
        }
      };

      fetchFinca(); // Llama a la función para obtener la finca
    }
  }, [idInmueble]); // Dependencia en idInmueble para que el efecto se ejecute cuando cambia

  return (
    <div className={styles.container}>
      {/* Renderiza el contenido solo si hay datos de la finca */}
      {finca && (
        <div className={`${styles.content} ${styles.contentInmueble}`}>
          <div className={styles.title}>
            <i
              className="fa fa-arrow-left" // Icono de flecha hacia la izquierda
              aria-hidden="true"
              data-tooltip-id="back"
              data-tooltip-content="Volver" // Texto del tooltip
              data-tooltip-place="top" // Posición del tooltip
              onClick={() => mostrarInmuebleId(null)} // Llama a la función para volver a la lista de fincas
            >
              <Tooltip id="back" style={{ zIndex: "9999" }} />
            </i>
            <h1>Volver</h1>
          </div>
          <div className={styles.fincas}>
            {/* Sección de información de la finca */}
            <div className={styles.infoFinca}>
              <h2>Información Finca</h2>
              {/* Cada div representa un bloque de información */}
              <div className={styles.infoDiv}>
                <h3>Referencia Catastral:</h3>
                <p>{finca.referenciaCatastral}</p>
              </div>
              <div className={styles.infoDiv}>
                <h3>Localización:</h3>
                <p>{`${finca.localizacion.direccion}, ${finca.localizacion.municipio}, ${finca.localizacion.codigoPostal}, ${finca.localizacion.pais}`}</p>
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
                <h3>Número de Olivos:</h3>
                <p>{finca.numOlivos}</p>
              </div>
            </div>
            {/* Sección de información de la parcela */}
            <div className={styles.infoFinca}>
              <h2>Información Parcela</h2>
              <div className={styles.infoDiv}>
                <h3>Latitud:</h3>
                <p>{finca.localizacion.latitud}</p>
              </div>
              <div className={styles.infoDiv}>
                <h3>Longitud:</h3>
                <p>{finca.localizacion.longitud}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inmueble;
