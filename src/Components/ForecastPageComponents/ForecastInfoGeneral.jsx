import React, { useEffect, useState } from "react";
import styles from "../../Pages/Forecast/Forecast.module.css";
import SelectFincas from "./SelectFincas";
import useWeather from "../../Hooks/useWeather";
import { getCoordsForCity } from "../../Utils/Firebase/databaseFunctions";
import { WeatherSvg } from "weather-icons-animated";
import {
  mapWeatherCodeToDescription,
  mapWeatherCodeToState,
} from "./SecondaryDiv";

// Función para formatear la fecha
const formatDate = (dateString, showYear = true) => {
  if (!dateString) return "";
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: showYear ? "numeric" : undefined,
  };
  return new Date(dateString).toLocaleDateString("es-ES", options);
};

// Función para formatear la hora
const formatTime = (dateString) => {
  if (!dateString) return "";
  const options = {
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleTimeString("es-ES", options);
};

function ForecastInfoGeneral({ fincas, selectedFinca, setSelectedFinca }) {
  const [selectedDate, setSelectedDate] = useState("");
  const { weather, error, loading } = useWeather(selectedFinca);

  const fetchCurrentDate = async () => {
    try {
      const coords = await getCoordsForCity(selectedFinca);
      const response = await fetch(
        `http://api.geonames.org/timezoneJSON?formatted=true&lat=${coords[0]}&lng=${coords[1]}&username=luisotorres`
      );
      const data = await response.json();
      setSelectedDate(data.time); // Date time should be in ISO format
    } catch (error) {
      console.error("Error fetching current date:", error);
    }
  };

  useEffect(() => {
    if (selectedFinca) {
      fetchCurrentDate(); // Fetch date initially
      const intervalId = setInterval(fetchCurrentDate, 60000); // Update every minute
      return () => clearInterval(intervalId); // Cleanup on component unmount
    }
  }, [selectedFinca]);

  useEffect(() => {
    fetchCurrentDate(); // Ensure date is fetched when the component mounts
  }, []);

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
          fincas={fincas}
          selectedFinca={selectedFinca}
          handleChange={handleChange}
        />
      </div>

      {loading && <p>Cargando datos del clima...</p>}

      {weather && !loading && (
        <>
          <div>
            <h1>{formatTime(selectedDate)}</h1>
            <p>{formatDate(selectedDate)}</p>
          </div>
          <div className={styles.forecastInfoGeneral}>
            <div>
              <p>Pronóstico Actual</p>
              <h3>{weather.temperature}°C</h3>
              <p>
                {mapWeatherCodeToDescription(weather.weathercode)},
                precipitación:{" "}
                {weather.precipitation
                  ? `${weather.precipitation} mm/h`
                  : "0 mm/h"}
              </p>
              <p>
                Humedad:{" "}
                {weather.humidity !== undefined
                  ? `${weather.humidity}%`
                  : "Desconocido"}
              </p>
              <p>
                Viento:{" "}
                {weather.windSpeed !== undefined
                  ? `${weather.windSpeed} km/h`
                  : "Desconocido"}
              </p>
            </div>
            <div>
              <WeatherSvg
                state={mapWeatherCodeToState(
                  weather.weathercode,
                  weather.is_day
                )}
                width={150}
                height={150}
              />
            </div>
          </div>
        </>
      )}

      {error && <p>Error al obtener el clima: {error.message}</p>}
    </>
  );
}

export default ForecastInfoGeneral;
