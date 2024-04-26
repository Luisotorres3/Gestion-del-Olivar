import React, { useState } from "react";
import styles from "./Forecast.module.css";

function ForecastInfoGeneral() {
  const [selectedOption, setSelectedOption] = useState("");

  // Función para manejar el cambio de selección
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <>
      <div className="d-flex justify-content-between">
        <h2>Hola Luis</h2>
        <select value={selectedOption} onChange={handleChange}>
          {/* Opciones del desplegable */}
          <option value="">Selecciona una opción</option>
          <option value="opcion1">Opción 1</option>
          <option value="opcion2">Opción 2</option>
          <option value="opcion3">Opción 3</option>
        </select>
      </div>
      <div>
        <h1>11.40</h1>
        <p>Fecha de hoy</p>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <p>Weather Forecast</p>
          <h3>Medio nublado</h3>
          <p>Precipitacion: 30%</p>
        </div>
        <div>
          <img
            src={require("../../Images/UGR.png")}
            style={{ width: "100px" }}
          />
        </div>
      </div>
    </>
  );
}

function ForecastStatus() {
  const [selectedOption, setSelectedOption] = useState("");

  // Función para manejar el cambio de selección
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <>
      <div className="d-flex justify-content-between">
        <h3>Status</h3>
        <select value={selectedOption} onChange={handleChange}>
          {/* Opciones del desplegable */}
          <option value="">Selecciona una opción</option>
          <option value="opcion1">Opción 1</option>
          <option value="opcion2">Opción 2</option>
          <option value="opcion3">Opción 3</option>
        </select>
      </div>
      <div></div>
    </>
  );
}

function ForecastAnalysis() {
  return (
    <>
      <div></div>
      <div></div>
    </>
  );
}

function DayForecast({ day }) {
  return (
    <li className="list-group-item mt-1 border-bottom w-100">
      <div className="d-flex justify-content-between">
        <div>
          <img
            src={require("../../Images/UGR.png")}
            style={{ width: "35px" }}
          />
        </div>
        <div className="d-flex flex-column justify-content-start">
          <h5>Miercoles, 24 Abril</h5>
          <p>Lluvia</p>
        </div>
        <div>
          <p>18ºC</p>
        </div>
      </div>
    </li>
  );
}

function SecondaryDiv() {
  const [selectedOption, setSelectedOption] = useState("");
  const days = [1, 2, 3, 4, 5];

  // Función para manejar el cambio de selección
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <div className="border">
      <div className="d-flex flex-column align-items-center">
        <div>
          <img
            src={require("../../Images/UGR.png")}
            style={{ width: "100px" }}
          />
        </div>
        <h1>20ºC</h1>
        <h3>Cloudy</h3>
        <div className="w-25">
          <div className="d-flex justify-content-between align-items-center">
            <i className="fa fa-thermometer-empty" aria-hidden="true"></i>
            <p>|</p>
            <p>100</p>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <i className="fa fa-thermometer-empty" aria-hidden="true"></i>
            <p>|</p>
            <p>100</p>
          </div>
        </div>
      </div>
      <div>
        <div className="d-flex justify-content-between mt-4">
          <h2>Weather Forecast</h2>
          <select value={selectedOption} onChange={handleChange}>
            {/* Opciones del desplegable */}
            <option value="">Selecciona una opción</option>
            <option value="opcion1">Opción 1</option>
            <option value="opcion2">Opción 2</option>
            <option value="opcion3">Opción 3</option>
          </select>
        </div>
        <div>
          <ul className="list-group border-0">
            {days.map((number) => (
              <DayForecast day={number} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const Forecast = () => {
  return (
    <div className={`container-fluid ${styles.container}`}>
      <div className={styles.content}>
        <div className={`d-flex ${styles.insideContent}`}>
          <div className={`${styles.info} ${styles.main}`}>
            <div className={styles.divInterior}>
              <ForecastInfoGeneral />
            </div>
            <div className={styles.divInterior}>
              <ForecastStatus />
            </div>
            <div className={styles.divInterior}>
              <ForecastAnalysis />
            </div>
          </div>
          <div className={`${styles.info} ${styles.secondary}`}>
            <SecondaryDiv />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecast;
