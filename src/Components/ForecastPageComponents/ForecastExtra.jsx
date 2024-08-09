import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import { getCoordsForCity } from "../../Utils/Firebase/databaseFunctions";
import styles from "../../Pages/Forecast/Forecast.module.css";

function ForecastExtra({ selectedFinca }) {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      if (!selectedFinca) return;

      const coords = await getCoordsForCity(selectedFinca);
      const params = {
        latitude: coords[0],
        longitude: coords[1],
        hourly: [
          "temperature_2m",
          "relative_humidity_2m",
          "precipitation",
          "evapotranspiration",
          "wind_speed_10m",
          "soil_moisture_0_to_1cm",
        ].join(","),
        daily: ["sunshine_duration", "uv_index_max"].join(","),
        timezone: "auto",
      };

      try {
        const response = await axios.get(
          "https://api.open-meteo.com/v1/forecast",
          { params }
        );
        const data = response.data;

        const processedData = {
          hourly: {
            temperature_2m: data.hourly.temperature_2m,
            relative_humidity_2m: data.hourly.relative_humidity_2m,
            precipitation: data.hourly.precipitation,
            evapotranspiration: data.hourly.evapotranspiration,
            wind_speed_10m: data.hourly.wind_speed_10m,
            soil_moisture_0_to_1cm: data.hourly.soil_moisture_0_to_1cm,
          },
          daily: {
            sunshine_duration: data.daily.sunshine_duration,
            uv_index_max: data.daily.uv_index_max,
          },
        };

        setWeatherData(processedData);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      }
    };

    fetchForecast();
  }, [selectedFinca]);

  if (!weatherData) {
    return <div>Cargando datos meteorológicos...</div>;
  }

  const {
    hourly: {
      temperature_2m,
      relative_humidity_2m,
      precipitation,
      evapotranspiration,
      wind_speed_10m,
      soil_moisture_0_to_1cm,
    },
    daily: { sunshine_duration, uv_index_max },
  } = weatherData;

  return (
    <div className={styles.analysisInteriorExtra}>
      <div className={styles.divInteriorExtra}>
        <h2>Datos Meteorológicos Horarios</h2>
        <ul>
          <li>
            Temperatura (°C): {temperature_2m[0]}{" "}
            <i
              className="fa fa-info-circle"
              aria-hidden="true"
              data-tooltip-id="temperature-tooltip"
              data-tooltip-content="La temperatura afecta el crecimiento de las plantas. Temperaturas extremas pueden causar estrés térmico."
              data-tooltip-place="top"
            >
              <Tooltip id="temperature-tooltip" style={{ zIndex: "9999" }} />
            </i>
          </li>
          <li>
            Humedad Relativa (%): {relative_humidity_2m[0]}{" "}
            <i
              className="fa fa-info-circle"
              aria-hidden="true"
              data-tooltip-id="humidity-tooltip"
              data-tooltip-content="La humedad relativa alta puede favorecer enfermedades fúngicas, mientras que la baja puede causar deshidratación."
              data-tooltip-place="top"
            >
              <Tooltip id="humidity-tooltip" style={{ zIndex: "9999" }} />
            </i>
          </li>
          <li>
            Precipitación (mm): {precipitation[0]}{" "}
            <i
              className="fa fa-info-circle"
              aria-hidden="true"
              data-tooltip-id="precipitation-tooltip"
              data-tooltip-content="La cantidad de precipitación afecta el riego. Exceso o falta puede dañar las plantas o requerir ajustes en el riego."
              data-tooltip-place="top"
            >
              <Tooltip id="precipitation-tooltip" style={{ zIndex: "9999" }} />
            </i>
          </li>
          <li>
            Evapotranspiración (mm): {evapotranspiration[0]}{" "}
            <i
              className="fa fa-info-circle"
              aria-hidden="true"
              data-tooltip-id="evapotranspiration-tooltip"
              data-tooltip-content="Indica la pérdida de agua a través de la evaporación y transpiración de las plantas. Es crucial para ajustar el riego."
              data-tooltip-place="top"
            >
              <Tooltip
                id="evapotranspiration-tooltip"
                style={{ zIndex: "9999" }}
              />
            </i>
          </li>
          <li>
            Velocidad del Viento (km/h): {wind_speed_10m[0]}{" "}
            <i
              className="fa fa-info-circle"
              aria-hidden="true"
              data-tooltip-id="wind-speed-tooltip"
              data-tooltip-content="Vientos fuertes pueden dañar las plantas y aumentar la pérdida de humedad."
              data-tooltip-place="top"
            >
              <Tooltip id="wind-speed-tooltip" style={{ zIndex: "9999" }} />
            </i>
          </li>
          <li>
            Humedad del Suelo (m³/m³): {soil_moisture_0_to_1cm[0]}{" "}
            <i
              className="fa fa-info-circle"
              aria-hidden="true"
              data-tooltip-id="soil-moisture-tooltip"
              data-tooltip-content="Es importante para el desarrollo de las raíces. Baja humedad puede requerir riego adicional."
              data-tooltip-place="top"
            >
              <Tooltip id="soil-moisture-tooltip" style={{ zIndex: "9999" }} />
            </i>
          </li>
        </ul>
      </div>

      <div className={styles.divInteriorExtra}>
        <h2>Datos Meteorológicos Diarios</h2>
        <ul>
          <li>
            Horas de Sol (s): {sunshine_duration[0]}{" "}
            <i
              className="fa fa-info-circle"
              aria-hidden="true"
              data-tooltip-id="sunshine-duration-tooltip"
              data-tooltip-content="Las horas de sol afectan la fotosíntesis y el crecimiento de las plantas. Menos horas pueden reducir la productividad."
              data-tooltip-place="top"
            >
              <Tooltip
                id="sunshine-duration-tooltip"
                style={{ zIndex: "9999" }}
              />
            </i>
          </li>
          <li>
            Índice UV Máximo: {uv_index_max[0]}{" "}
            <i
              className="fa fa-info-circle"
              aria-hidden="true"
              data-tooltip-id="uv-index-tooltip"
              data-tooltip-content="Altos niveles de radiación UV pueden dañar las plantas y afectar su crecimiento."
              data-tooltip-place="top"
            >
              <Tooltip id="uv-index-tooltip" style={{ zIndex: "9999" }} />
            </i>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ForecastExtra;
