import React, { useEffect, useState } from "react";
import styles from "./Forecast.module.css";
import {
  fetchWeather,
  getFincas,
} from "../../Utils/Firebase/databaseFunctions";

function SelectFincas({ selectedFinca, handleChange }) {
  return (
    <select value={selectedFinca} onChange={handleChange}>
      {getFincas().map((item) => (
        <option key={item.id} value={item.localizacion.municipio}>
          {item.localizacion.municipio}
        </option>
      ))}
    </select>
  );
}
function ForecastInfoGeneral({ selectedFinca, setSelectedFinca }) {
  // Función para manejar el cambio de selección
  const handleChange = (event) => {
    setSelectedFinca(event.target.value);
  };
  return (
    <>
      <div className="d-flex justify-content-between">
        <h2>Hola Luis</h2>
        <SelectFincas
          selectedFinca={selectedFinca}
          handleChange={handleChange}
        />
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
  const [selectedFinca, setselectedFinca] = useState("");

  // Función para manejar el cambio de selección
  const handleChange = (event) => {
    setselectedFinca(event.target.value);
  };
  return (
    <>
      <div className="d-flex justify-content-between">
        <h3>Status</h3>
        <select value={selectedFinca} onChange={handleChange}>
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
      <div>A</div>
    </>
  );
}

function DayForecast({ day }) {
  return (
    <li className={styles.dayList}>
      <div className={styles.dayForecastIndividual}>
        <div className="d-flex justify-content-center align-items-center">
          <img
            src={require("../../Images/UGR.png")}
            style={{ width: "35px" }}
          />
        </div>
        <div className="d-flex flex-column justify-content-start">
          <h5>Miercoles, 24 Abril</h5>
          <p>Lluvia</p>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <p>18ºC</p>
        </div>
      </div>
    </li>
  );
}

function SecondaryDiv({ selectedFinca, setSelectedFinca }) {
  const days = [1, 2, 3, 4, 5];
  const [temperature, setTemperature] = useState(null);

  // Función para manejar el cambio de selección
  const handleChange = (event) => {
    setSelectedFinca(event.target.value);
  };

  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const data = await fetchWeather(selectedFinca);
        setTemperature(data.main.temp);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    if (selectedFinca) {
      fetchTemperature();
    }
  }, [selectedFinca]);

  return (
    <div className={styles.contentSecondaryDiv}>
      <div className="d-flex flex-column justify-content-center align-items-center h-100">
        <div>
          <img
            src={require("../../Images/UGR.png")}
            style={{ width: "100px" }}
          />
        </div>
        <h1>{temperature}ºC</h1>
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
      <div className="h-100">
        <div className="d-flex justify-content-between mt-4">
          <h2>Weather Forecast</h2>
          <select value={selectedFinca} onChange={handleChange}>
            {/* Opciones del desplegable */}
            <option value="">Selecciona una opción</option>
            <option value="opcion1">Opción 1</option>
            <option value="opcion2">Opción 2</option>
            <option value="opcion3">Opción 3</option>
          </select>
        </div>
        <div className={styles.divWeekForecast}>
          <ul className="list-group border-0">
            {days.map((number) => (
              <DayForecast day={number} key={number} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const Forecast = () => {
  const [selectedFinca, setSelectedFinca] = useState(
    getFincas()[0].localizacion.municipio
  );
  return (
    <div className={`container-fluid ${styles.container}`}>
      <div className={styles.content}>
        <div className={`d-flex ${styles.insideContent}`}>
          <div className={`${styles.info} ${styles.main}`}>
            <div className={styles.divInterior}>
              <div className={styles.interiorWithBackground}>
                <ForecastInfoGeneral
                  selectedFinca={selectedFinca}
                  setSelectedFinca={setSelectedFinca}
                />
              </div>
            </div>
            <div className={styles.divInterior}>
              <ForecastStatus />
            </div>
            <div className="d-flex w-100">
              <div className={`${styles.divInterior} w-100 h-100`}>
                <ForecastAnalysis />
              </div>
              <div className={`${styles.divInterior} w-100 h-100`}>
                <ForecastAnalysis />
              </div>
            </div>
          </div>
          <div className={`${styles.info} ${styles.secondary}`}>
            <div className={styles.secondaryInsideDiv}>
              <SecondaryDiv
                selectedFinca={selectedFinca}
                setSelectedFinca={setSelectedFinca}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecast;
