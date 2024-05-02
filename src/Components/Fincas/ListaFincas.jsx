import React, { useState, useEffect } from "react";
import styles from "./Gestion.module.css";
import { Tooltip } from "react-tooltip";

const Fincas = ({ fincas, mostrarInmuebleId, handleDelete }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.title}>
          <h1>Mis Fincas</h1>
        </div>
        {fincas && (
          <div className={styles.fincas}>
            <div className={styles.lista}>
              <div className={styles.buttons}>
                <button
                  data-tooltip-id="add"
                  data-tooltip-content="Crear Finca"
                  data-tooltip-place="top"
                >
                  <i className="fa fa-plus-square-o" aria-hidden="true"></i>
                  <Tooltip id="add" style={{ zIndex: "9999" }} />
                </button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Referencia catastral</th>
                    <th>Localización</th>
                    <th>Clase</th>
                    <th>Uso principal</th>
                    <th>Superficie construida</th>
                    <th>Año construcción</th>
                    <th>Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {fincas.map((finca, index) => (
                    <tr key={index}>
                      <td>{finca.data.referenciaCatastral}</td>
                      <td>{`${finca.data.localizacion.direccion}, ${finca.data.localizacion.municipio}, ${finca.data.localizacion.codigoPostal}, ${finca.data.localizacion.pais}`}</td>

                      <td>{finca.data.clase}</td>
                      <td>{finca.data.usoPrincipal}</td>
                      <td>{finca.data.superficieConstruida}</td>
                      <td>{finca.data.anoConstruccion}</td>
                      <td>
                        <div className={styles.acciones}>
                          <button
                            onClick={() => mostrarInmuebleId(finca.id)}
                            data-tooltip-id="open"
                            data-tooltip-content="Abrir"
                            data-tooltip-place="top"
                          >
                            <i className="fa fa-eye" aria-hidden="true"></i>
                          </button>
                          <button
                            data-tooltip-id="edit"
                            data-tooltip-content="Editar"
                            data-tooltip-place="top"
                          >
                            <i
                              className="fa fa-pencil-square-o"
                              aria-hidden="true"
                            ></i>
                          </button>
                          <button
                            data-tooltip-id="delete"
                            data-tooltip-content="Borrar"
                            data-tooltip-place="top"
                            onClick={() => handleDelete(finca.id)}
                          >
                            <i className="fa fa-trash-o" aria-hidden="true"></i>
                          </button>
                          <Tooltip id="open" style={{ zIndex: "9999" }} />
                          <Tooltip id="edit" style={{ zIndex: "9999" }} />
                          <Tooltip id="delete" style={{ zIndex: "9999" }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Fincas;
