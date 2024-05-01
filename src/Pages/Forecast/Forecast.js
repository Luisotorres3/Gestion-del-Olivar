import React, { useEffect, useState } from "react";
import styles from "./Forecast.module.css";
import {
  fetchWeather,
  getFincas,
} from "../../Utils/Firebase/databaseFunctions";

const iconURL = "http://openweathermap.org/img/wn/";

function SelectFincas({ selectedFinca, handleChange }) {
  const [fincas, setFincas] = useState([]);

  useEffect(() => {
    async function fetchFincas() {
      try {
        const data = await getFincas();
        setFincas(data.data);
      } catch (error) {
        console.error("Hubo un error al obtener las fincas:", error);
      }
    }

    fetchFincas();
  }, []);
  return (
    fincas && (
      <select value={selectedFinca} onChange={handleChange}>
        {fincas.map((item) => (
          <option key={item.id} value={item.data.localizacion.municipio}>
            {item.data.localizacion.municipio}
          </option>
        ))}
      </select>
    )
  );
}
function ForecastInfoGeneral({
  selectedFinca,
  setSelectedFinca,
  weatherSelectedFinca,
}) {
  // Función para manejar el cambio de selección
  const handleChange = (event) => {
    setSelectedFinca(event.target.value);
  };
  return (
    <>
      <div
        className={`d-flex justify-content-between ${styles.infoGeneralSelect}`}
      >
        <h2>Bienvenido</h2>
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
            src={`${iconURL}${weatherSelectedFinca.weather[0].icon}@4x.png`}
            style={{ width: "auto" }}
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

function SecondaryDiv({
  selectedFinca,
  setSelectedFinca,
  weatherSelectedFinca,
}) {
  const days = [1, 2, 3, 4, 5];

  // Función para manejar el cambio de selección
  const handleChange = (event) => {
    setSelectedFinca(event.target.value);
  };

  return (
    <div className={styles.contentSecondaryDiv}>
      {weatherSelectedFinca && (
        <>
          <div className="d-flex flex-column align-items-center h-100">
            <div>
              <img
                src={`http://openweathermap.org/img/wn/${weatherSelectedFinca.weather[0].icon}@2x.png`}
                style={{ width: "100px" }}
              />
            </div>
            <h1>{weatherSelectedFinca.main.temp}ºC</h1>
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
          <div className={styles.contentListDays}>
            <div className="d-flex justify-content-between">
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
        </>
      )}
    </div>
  );
}

const Forecast = () => {
  const [selectedFinca, setSelectedFinca] = useState(null);
  const [fincas, setFincas] = useState([]);
  const [weatherSelectedFinca, setWeatherSelectedFinca] = useState(null);

  useEffect(() => {
    const fetchFinca = async () => {
      try {
        const fincaData = await getFincas();
        setFincas(fincaData.data);
        setSelectedFinca(fincaData.data[0].data.localizacion.municipio);
      } catch (error) {
        console.error("Error al obtener la finca:", error);
      }
    };

    fetchFinca();
  }, []);

  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const data = await fetchWeather(selectedFinca);
        setWeatherSelectedFinca(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    if (selectedFinca) {
      fetchTemperature();
    }
  }, [selectedFinca]);

  return (
    <div className={`container-fluid ${styles.container}`}>
      {selectedFinca && (
        <div className={styles.content}>
          <div className={`d-flex ${styles.insideContent}`}>
            <div className={`${styles.info} ${styles.main}`}>
              <div className={styles.divInterior}>
                <div className={styles.interiorWithBackground}>
                  <ForecastInfoGeneral
                    selectedFinca={selectedFinca}
                    setSelectedFinca={setSelectedFinca}
                    weatherSelectedFinca={weatherSelectedFinca}
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
                  weatherSelectedFinca={weatherSelectedFinca}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forecast;
