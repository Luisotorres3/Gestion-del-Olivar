import styles from "./ForecastComp.module.css";
import useWeather from "../../Hooks/useWeather";
import { WeatherSvg } from "weather-icons-animated"; // Asegúrate de que este paquete esté instalado

const Forecast = ({ location }) => {
  // Usa el custom hook useWeather en lugar de fetchWeather
  const { weather } = useWeather(location);

  if (!weather) {
    return <p>No weather data available</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.title}>
          <p>{location}</p> {/* Nombre de la ciudad */}
          <h2>{Math.round(weather.temperature)} ºC</h2>
          <WeatherSvg
            state={mapWeatherCodeToState(weather.weathercode, weather.is_day)}
            width={50}
            height={50}
          />
        </div>
      </div>
    </div>
  );
};

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

export default Forecast;
