import React, { useEffect, useState } from "react";
import styles from "./Forecast.module.css";
import {
  fetchWeather,
  fetchWeatherAEMET,
  getCoordsForCity,
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
  const [selectedDate, setSelectedDate] = useState("");

  const fetchCurrentDate = async () => {
    try {
      const coords = await getCoordsForCity(selectedFinca);
      const response = await fetch(
        `http://api.geonames.org/timezoneJSON?formatted=true&lat=${coords[0]}&lng=${coords[1]}&username=luisotorres`
      );
      const data = await response.json();
      setSelectedDate(data.time);
    } catch (error) {
      console.error("Error fetching current date:", error);
    }
  };

  useEffect(() => {
    if (selectedFinca) {
      fetchCurrentDate();

      // Establecer intervalo para actualizar la fecha y hora cada minuto
      const intervalId = setInterval(fetchCurrentDate, 60000);

      // Limpiar intervalo al desmontar el componente
      return () => clearInterval(intervalId);
    }
  }, [selectedFinca]);

  // Función para manejar el cambio de selección
  const handleChange = (event) => {
    setSelectedFinca(event.target.value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const daysOfWeek = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayOfWeek}, ${dayOfMonth} ${month}, ${year}`;
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
      {weatherSelectedFinca && (
        <>
          <div>
            <h1>{selectedDate.split(" ")[1]}</h1>
            <p>{formatDate(selectedDate.split(" ")[0])}</p>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p>Weather Forecast</p>
              <h3>{weatherSelectedFinca.weather[0].main}</h3>
              <p>
                {weatherSelectedFinca.weather[0].description}, precipitacion:{" "}
                {weatherSelectedFinca.rain && weatherSelectedFinca.rain["1h"]
                  ? `${weatherSelectedFinca.rain["1h"]} mm/h`
                  : "0%"}
              </p>
            </div>
            <div>
              <img
                src={`${iconURL}${weatherSelectedFinca.weather[0].icon}@4x.png`}
                style={{ width: "auto" }}
              />
            </div>
          </div>
        </>
      )}
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

function DayForecast({ dayWeather }) {
  return (
    <li className={styles.dayList}>
      <div className={styles.dayForecastIndividual}>
        <div className={styles.imgDayForecast}>
          <img
            src={`${iconURL}${dayWeather.weather[0].icon}@2x.png`}
            style={{ width: "35px" }}
          />
        </div>
        <div className="d-flex flex-column justify-content-start">
          <h5>Miercoles, 24 Abril</h5>
          <p>Lluvia</p>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <p>{dayWeather.main.temp} ºC</p>
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
                  <DayForecast dayWeather={weatherSelectedFinca} key={number} />
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

  const [datosAEMET, setDatosAEMET] = useState(null); // Estado para almacenar el texto de carga

  useEffect(() => {
    const solicitar = async () => {
      try {
        //const data = await fetchWeatherAEMET(selectedFinca);
        //setDatosAEMET(data);
      } catch (error) {}
    };

    solicitar();
  }, []);

  return (
    <div className={styles.container}>
      {selectedFinca && (
        <div className={styles.content}>
          <div className={styles.insideContent}>
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
                <div className={styles.analysisInterior}>
                  <ForecastStatus />
                </div>
              </div>
              <div className={styles.divAnalysis}>
                <div className={`${styles.divInterior}`}>
                  <div className={styles.analysisInterior}>
                    <ForecastAnalysis />
                  </div>
                </div>
                <div className={`${styles.divInterior}`}>
                  <div className={styles.analysisInterior}>
                    <ForecastAnalysis />
                  </div>
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
