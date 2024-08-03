import React from "react";
import styles from "../../Pages/Forecast/Forecast.module.css";

const iconURL = "http://openweathermap.org/img/wn/";

const formatDate = (dateString, mostrarAño = true) => {
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: mostrarAño ? "numeric" : undefined,
  };
  return new Date(dateString).toLocaleDateString("es-ES", options);
};

function DayForecast({ dayWeather }) {
  return (
    <li className={styles.dayList}>
      <div className={styles.dayForecastIndividual}>
        <div className={styles.imgDayForecast}>
          <img
            src={`${iconURL}${dayWeather.icon}@2x.png`}
            style={{ width: "35px" }}
          />
        </div>
        <div
          className="d-flex flex-column justify-content-start"
          style={{ width: "33%" }}
        >
          <h5>{formatDate(dayWeather.fecha, false)}</h5>
          <p>Lluvia</p>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <p>{dayWeather.temperatura.maxima} ºC</p>
        </div>
      </div>
    </li>
  );
}

export default DayForecast;
