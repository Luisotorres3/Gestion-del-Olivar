import React from "react";
import styles from "./Gestion.module.css";
import { Tooltip } from "react-tooltip";
const Inmueble = ({ finca, mostrarInmuebleId }) => {
  return (
    <div className={styles.container}>
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
          <h1>Mis Fincas</h1>
        </div>
        <div className={styles.fincas}>
          <div className={styles.infoFinca}>
            <h2>Información Finca</h2>
            <div className={styles.infoDiv}>
              <h3>Referencia Catastral:</h3>
              <p>{finca.id}</p>
            </div>
            <div className={styles.infoDiv}>
              <h3>Localización:</h3>
              <p>
                {" "}
                {finca.localizacion.direccion}, {finca.localizacion.municipio},{" "}
                {finca.localizacion.provincia},{" "}
                {finca.localizacion.codigoPostal}
              </p>
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
          </div>
          <div className={styles.infoFinca}>
            <h2>Información Olivar</h2>
            <div className={styles.infoDiv}>
              <h3>Número de Olivos</h3>
              <p>{finca.numOlivos}</p>
            </div>
            <div className={styles.infoDiv}>
              <h3>Localización:</h3>
              <p>
                {" "}
                {finca.localizacion.direccion}, {finca.localizacion.municipio},{" "}
                {finca.localizacion.provincia},{" "}
                {finca.localizacion.codigoPostal}
              </p>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inmueble;
