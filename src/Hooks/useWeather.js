import { useEffect, useState, useCallback } from "react";
import { getCoordsForCity } from "../Utils/Firebase/databaseFunctions";

const useWeather = (selectedFinca) => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWeatherData = useCallback(async () => {
    if (!selectedFinca) return;

    setLoading(true); // Inicia el estado de carga

    try {
      const coords = await getCoordsForCity(selectedFinca);

      if (!coords || coords.length < 2) {
        throw new Error("Coordenadas no válidas");
      }

      const [latitude, longitude] = coords;

      // Configura los parámetros para la solicitud
      const params = new URLSearchParams({
        latitude,
        longitude,
        current: [
          "temperature_2m",
          "relative_humidity_2m",
          "precipitation",
          "wind_speed_10m",
          "weathercode",
          "is_day",
        ],
        hourly: [
          "temperature_2m",
          "relative_humidity_2m",
          "precipitation",
          "wind_speed_10m",
        ],
        timezone: "auto",
      });

      const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

      // Realiza la solicitud a la API
      const response = await fetch(url);

      if (!response.ok) {
        const errorBody = await response.text(); // Obtiene el cuerpo del error
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorBody}`
        );
      }

      const data = await response.json();

      // Verifica que los datos necesarios estén presentes
      if (!data.current || !data.hourly) {
        throw new Error("Datos de clima no disponibles");
      }

      // Extrae los datos actuales
      const current = data.current;
      const {
        temperature_2m: temperature,
        relative_humidity_2m: humidity,
        precipitation,
        wind_speed_10m: windSpeed,
        weathercode,
        is_day,
      } = current;

      // Extrae los datos horarios
      const {
        time: hourlyTime,
        temperature_2m: hourlyTemperature,
        relative_humidity_2m: hourlyHumidity,
        precipitation: hourlyPrecipitation,
        wind_speed_10m: hourlyWindSpeed,
      } = data.hourly;

      // Establece el estado del clima
      setWeather({
        temperature,
        humidity,
        precipitation,
        windSpeed,
        weathercode,
        is_day,
        hourly: {
          time: hourlyTime,
          temperature: hourlyTemperature,
          humidity: hourlyHumidity,
          precipitation: hourlyPrecipitation,
          windSpeed: hourlyWindSpeed,
        },
      });

      setError(null); // Limpia el error si la solicitud fue exitosa
    } catch (error) {
      console.error("Error fetching weather data:", error.message); // Depuración: imprime el error
      setError(error); // Establece el error en caso de fallo
      setWeather(null); // Limpia los datos de clima en caso de fallo
    } finally {
      setLoading(false); // Termina el estado de carga
    }
  }, [selectedFinca]);

  useEffect(() => {
    fetchWeatherData(); // Llama a la función al montarse el componente

    const intervalId = setInterval(fetchWeatherData, 60000); // Actualiza cada minuto
    return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonte
  }, [fetchWeatherData]); // Dependencia de la función de callback

  return { weather, error, loading };
};

export default useWeather;
