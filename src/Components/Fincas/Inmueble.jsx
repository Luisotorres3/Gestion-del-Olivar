import React, { useEffect, useState } from "react";
import styles from "./Gestion.module.css"; // Importa los estilos específicos para este componente
import { Tooltip } from "react-tooltip"; // Importa el componente Tooltip para mostrar información adicional
import { getFincaById } from "../../Utils/Firebase/databaseFunctions"; // Importa la función para obtener una finca por su ID
import { Polygon } from "ol/geom";

const Inmueble = ({ idInmueble, mostrarInmuebleId }) => {
  // Estado para almacenar la información de la finca seleccionada
  const [finca, setFinca] = useState(null);
  const [formaFinca, setFormaFinca] = useState(null);

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
  useEffect(() => {
    if (finca) {
      crearPol();
    }
  }, [finca]); // Este efecto solo se ejecuta cuando `finca` ha cambiado

  const crearPol = () => {
    const coordinatesFinca = JSON.parse(finca.coordenadasFinca);
    let polygon;
    if (coordinatesFinca) {
      polygon = new Polygon([coordinatesFinca]);
    }
    if (polygon) {
      // Crear un canvas
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const extent = polygon.getExtent();

      // Calcular tamaño del canvas
      const width = extent[2] - extent[0];
      const height = extent[3] - extent[1];
      canvas.width = 500; // Tamaño de la imagen
      canvas.height = 500;

      // Normalizar coordenadas
      const coordinates = polygon.getCoordinates()[0].map((coord) => {
        const x = (coord[0] - extent[0]) / width;
        const y = (extent[3] - coord[1]) / height;
        return [x * canvas.width, y * canvas.height];
      });

      // Dibujar el polígono en el canvas
      context.beginPath();
      context.moveTo(coordinates[0][0], coordinates[0][1]);

      for (let i = 1; i < coordinates.length; i++) {
        context.lineTo(coordinates[i][0], coordinates[i][1]);
      }

      context.closePath();
      context.fillStyle = "rgba(0, 0, 255, 0.2)";
      context.strokeStyle = "blue";
      context.lineWidth = 2;
      context.fill();
      context.stroke();

      // Exportar el canvas como imagen
      const imgData = canvas.toDataURL("image/png");
      setFormaFinca(imgData);
    }
  };

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
              <div className={styles.infoDivImg}>
                <h3>Forma :</h3>
                <p>
                  <img
                    src={formaFinca}
                    alt="Forma de la Finca"
                    className={styles.fincaImage}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inmueble;
