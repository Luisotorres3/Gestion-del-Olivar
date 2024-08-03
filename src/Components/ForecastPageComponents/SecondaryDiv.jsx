import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import styles from "../../Pages/Forecast/Forecast.module.css";
import { getCoordsForCity } from "../../Utils/Firebase/databaseFunctions";
import { WeatherSvg } from "weather-icons-animated";

// Función para capitalizar la primera letra de una cadena
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

function SecondaryDiv({ selectedFinca, setSelectedFinca }) {
  // Definir estados para el clima actual y el clima de los próximos días
  const [weatherNextDays, setWeatherNextDays] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!selectedFinca) return; // Evitar ejecución si selectedFinca es null o undefined

      try {
        const coords = await getCoordsForCity(selectedFinca);
        const params = {
          latitude: coords[0],
          longitude: coords[1],
          current_weather: true,
          daily:
            "temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode",
          timezone: "auto",
        };

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${params.latitude}&longitude=${params.longitude}&current_weather=${params.current_weather}&daily=${params.daily}&timezone=${params.timezone}`
        );
        const data = await response.json();

        // Procesar datos obtenidos y actualizar estados
        const nextDays = {
          time: data.daily.time,
          temperature_2m_max: data.daily.temperature_2m_max,
          temperature_2m_min: data.daily.temperature_2m_min,
          precipitation_sum: data.daily.precipitation_sum,
          weathercode: data.daily.weathercode,
        };

        setWeatherNextDays(nextDays);
        setCurrentWeather(data.current_weather);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      }
    };

    fetchWeatherData(); // Llamada a la función de obtención de datos
  }, [selectedFinca]); // Dependencia en selectedFinca

  // Renderizar mensaje de carga si no se ha cargado el clima
  if (!weatherNextDays || !currentWeather) return <p>Loading...</p>;

  return (
    <div className={styles.contentSecondaryDiv}>
      {/* Clima Actual */}
      <div className="d-flex flex-column align-items-center">
        <div>
          <WeatherSvg
            state={mapWeatherCodeToState(
              currentWeather.weathercode,
              currentWeather.is_day
            )}
            width={100}
            height={100}
          />
        </div>
        <h1>{currentWeather.temperature}ºC</h1>
        <h3>{mapWeatherCodeToDescription(currentWeather.weathercode)}</h3>
        <div className="weather-container w-25">
          <div className="d-flex justify-content-between align-items-center">
            <i className="fa fa-thermometer-empty" aria-hidden="true"></i>
            <div className="temperature-info d-flex align-items-center">
              <p className="separator">|</p>
              <p className="temperature-value">
                {currentWeather.temperature}ºC
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pronóstico para los próximos días */}
      <div className={styles.contentListDays}>
        {weatherNextDays.time.slice(1).map((day, index) => {
          const formattedDate = format(new Date(day), "EEEE, d MMMM", {
            locale: es,
          });
          const capitalizedDate = capitalizeFirstLetter(formattedDate);

          return (
            <div key={index} className={styles.dayContainer}>
              <div className={styles.iconContainer}>
                <WeatherSvg
                  state={mapWeatherCodeToState(
                    weatherNextDays.weathercode[index + 1],
                    true // Asume que es de día para el pronóstico
                  )}
                  width={50}
                  height={50}
                />
              </div>
              <div className={styles.infoContainer}>
                <div className={styles.date}>{capitalizedDate}</div>
                <div className={styles.weatherDescription}>
                  {mapWeatherCodeToDescription(
                    weatherNextDays.weathercode[index + 1]
                  )}
                </div>
              </div>
              <div className={styles.temperature}>
                {weatherNextDays.temperature_2m_max[index + 1]}ºC /{" "}
                {weatherNextDays.temperature_2m_min[index + 1]}ºC
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Mapea los códigos de tiempo a estados para WeatherSvg
export const mapWeatherCodeToState = (code, isDay) => {
  const weatherStates = {
    0: isDay ? "sunny" : "clear-night", // Clear sky
    1: isDay ? "partlycloudy" : "partlycloudy-night", // Mainly clear
    2: isDay ? "partlycloudy" : "partlycloudy-night", // Partly cloudy
    3: "cloudy", // Overcast
    45: "fog", // Fog
    48: "fog", // Rime fog
    51: "rainy", // Drizzle: Light
    53: "rainy", // Drizzle: Moderate
    55: "rainy", // Drizzle: Dense
    56: "hail", // Freezing Drizzle: Light
    57: "hail", // Freezing Drizzle: Dense
    61: "rainy", // Rain: Slight
    63: "rainy", // Rain: Moderate
    65: "rainy", // Rain: Heavy
    66: "hail", // Freezing Rain: Light
    67: "hail", // Freezing Rain: Heavy
    71: "snowy", // Snow fall: Slight
    73: "snowy", // Snow fall: Moderate
    75: "snowy", // Snow fall: Heavy
    77: "snowy", // Snow grains
    80: "rainy", // Rain showers: Slight
    81: "rainy", // Rain showers: Moderate
    82: "rainy", // Rain showers: Violent
    85: "snowy", // Snow showers: Slight
    86: "snowy", // Snow showers: Heavy
    95: "lightning", // Thunderstorm: Slight
    96: "lightning", // Thunderstorm: Heavy
    99: "lightning", // Thunderstorm with hail
  };

  return weatherStates[code] || (isDay ? "sunny" : "clear-night"); // Default to sunny or clear-night if code is unknown
};

// Mapea los códigos de clima a descripciones
export const mapWeatherCodeToDescription = (code) => {
  const descriptions = {
    0: "Despejado",
    1: "Mayormente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Niebla",
    48: "Niebla helada",
    51: "Llovizna ligera",
    53: "Llovizna moderada",
    55: "Llovizna densa",
    56: "Granizo",
    57: "Granizo denso",
    61: "Lluvia ligera",
    63: "Lluvia moderada",
    65: "Lluvia intensa",
    66: "Lluvia helada ligera",
    67: "Lluvia helada intensa",
    71: "Nevada ligera",
    73: "Nevada moderada",
    75: "Nevada intensa",
    77: "Granizo de nieve",
    80: "Chubascos de lluvia ligeros",
    81: "Chubascos de lluvia moderados",
    82: "Chubascos de lluvia fuertes",
    85: "Chubascos de nieve ligeros",
    86: "Chubascos de nieve fuertes",
    95: "Tormenta ligera",
    96: "Tormenta fuerte",
    99: "Tormenta con granizo",
  };

  return descriptions[code] || "Desconocido"; // Default to "Desconocido" if code is not mapped
};

export default SecondaryDiv;
