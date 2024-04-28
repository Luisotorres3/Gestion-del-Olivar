import React, { useState, useEffect } from "react";
import styles from "./ForecastComp.module.css";
import { fetchWeather } from "../../Utils/Firebase/databaseFunctions";

const Forecast = ({ location }) => {
  const [city, setCity] = useState(location);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const handleFetchWeather = async () => {
      const data = await fetchWeather(city);
      setWeatherData(data);
    };

    handleFetchWeather();
  }, [city]); // Ejecutar el efecto cada vez que cambie la ubicación

  return (
    <>
      {weatherData && (
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.title}>
              <p>{weatherData.name}</p>
              <h2>{Math.round(weatherData.main.temp)} ºC</h2>
              <img
                src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
                alt="Weather icon"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Forecast;
