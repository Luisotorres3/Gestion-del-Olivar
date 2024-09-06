import axios from "axios";
import { load } from "cheerio";
import { fetchWeatherApi } from "openmeteo";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getAuth } from "firebase/auth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const baseURLDatabase =
  "https://us-central1-gestiondelolivar-48d30.cloudfunctions.net/app";

//GET FINCAS
export const getFincas = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user.uid;
  try {
    const response = await axios.get(`${baseURLDatabase}/api/fincas`, {
      params: { userId },
    });
    return response;
  } catch (error) {
    console.error(error);
  }

  return [];
};

//GET NUM FINCAS
export const getNumFincas = async () => {
  try {
    const fincas = await getFincas();
    return fincas.data.length;
  } catch (error) {
    console.error("Error al contar las fincas:", error);
    throw error;
  }
};

//GET NUM FINCAS NUEVAS
export const getNumFincasNuevas = () => {
  return Math.floor(0);
};

//GET FINCA BY ID
export const getFincaById = (id) => {
  const getFincaData = async (id) => {
    try {
      const fincas = await getFincas();
      const finca = fincas.data.find((finca) => finca.id === id);
      return finca.data;
    } catch (error) {
      console.error("Error al obtener la finca por ID:", error);
      throw error;
    }
  };

  return getFincaData(id);
};

//DELETE FINCA BY ID
export const deleteFincaById = async (id) => {
  try {
    const response = await axios(`${baseURLDatabase}/api/fincas/${id}`, {
      method: "DELETE",
    });

    if (response.status != 200) {
      throw new Error("Failed to delete finca");
    }
  } catch (error) {
    console.log(error);
  }
};

// ----------------------------------------------

//CREATE FINCA
export const createFinca = async (finca) => {
  try {
    const response = await axios.post(`${baseURLDatabase}/api/fincas/`, finca);

    if (response.status != 204) {
      throw new Error("Failed to create finca");
    }
  } catch (error) {
    console.log(error);
  }
};

//UPDATE FINCA
/**
 * Actualiza los datos de una finca en el backend.
 * @param {string} fincaId - ID de la finca a actualizar.
 * @param {object} fincaData - Datos actualizados de la finca.
 */
export const updateFinca = async (fincaId, fincaData) => {
  try {
    const response = await axios.put(
      `${baseURLDatabase}/api/fincas/${fincaId}`,
      fincaData
    );

    if (response.status !== 200) {
      throw new Error("Error al actualizar la finca");
    }
  } catch (error) {
    console.error("Error al actualizar la finca:", error);
    throw error;
  }
};

// ----------------------------------------------

//GET LOCATIONS
export const getLocations = (cap = true) => {
  const getData = async () => {
    try {
      const fincas = await getFincas();
      const municipios = fincas.data.map(
        (finca) => finca.data.localizacion.municipio
      );
      if (cap) return municipios.slice(0, 5);
      return municipios;
    } catch (error) {
      console.error("Error al obtener la finca por ID:", error);
      throw error;
    }
  };

  return getData();
};

//GET COORDS POR CIUDAD
export const getCoordsForCity = async (cityName) => {
  try {
    const limit = 1; // Limitamos a 1 resultado por ciudad
    const countryCode = "ES"; // Código del país, en este caso España
    const apiKey = "10febab50520dc67582eed976e016d80"; // Tu clave de API de OpenWeatherMap

    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${cityName},${countryCode}&limit=${limit}&appid=${apiKey}`
    );

    const data = response.data;
    if (data.length > 0) {
      const coordinates =
        data[0].lat && data[0].lon ? [data[0].lat, data[0].lon] : null;
      return coordinates;
    } else {
      throw new Error(
        `No se encontraron coordenadas para la ciudad ${cityName}`
      );
    }
  } catch (error) {
    console.error(
      `Error al obtener las coordenadas para la ciudad ${cityName}:`,
      error
    );
    throw error;
  }
};

//GET COORDS FOR ALL CITIES
export const getCoordsForMarker = async () => {
  try {
    const limit = 1; // Limitamos a 1 resultado por municipio
    const municipios = await getLocations(false);
    const countryCode = "ES";
    const apiKey = "10febab50520dc67582eed976e016d80";

    const coordenadasPromesas = municipios.map(async (municipio) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${municipio},${countryCode}&limit=${limit}&appid=${apiKey}`
        );
        const data = response.data;
        if (data.length > 0) {
          const coordenadas =
            data[0].lat && data[0].lon ? [data[0].lat, data[0].lon] : null;
          return { municipio, coordenadas };
        } else {
          throw new Error(
            `No se encontraron coordenadas para el municipio ${municipio}`
          );
        }
      } catch (error) {
        console.error(
          `Error al obtener las coordenadas para el municipio ${municipio}:`,
          error
        );
        throw error;
      }
    });

    const coordenadas = await Promise.all(coordenadasPromesas);
    return coordenadas;
  } catch (error) {
    console.error("Error al obtener las coordenadas de los municipios:", error);
    throw error;
  }
};

// ----------------------------------------------

//GET NUM DE OLIVOS
export const getNumOlivos = async () => {
  try {
    let count = 0;
    const fincas = await getFincas();

    fincas.data.forEach((item) => {
      count += parseInt(item.data.numOlivos);
    });
    return count;
  } catch (error) {
    console.error("Error al contar las fincas:", error);
    throw error;
  }
};

// ----------------------------------------------

//FETCH WEATHER BY CITY
export const fetchWeather = async (city) => {
  /*
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},es&appid=10febab50520dc67582eed976e016d80&units=metric&lang=es`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
  */
  try {
    const coords = await getCoordsForCity(city);
    if (!coords || coords.length < 2) {
      throw new Error("Coordenadas no válidas");
    }

    const [latitude, longitude] = coords;
    const params = new URLSearchParams({
      latitude,
      longitude,
      current: ["temperature_2m"],
      timezone: "auto",
    });

    const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.current.temperature_2m;
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    throw error;
  }
};

//FETCH WEATHER FOR ALL LOCATIONS
export const fetchAllTemps = async (locations) => {
  let tempMedia = 0;

  for (const item of locations) {
    const data = await fetchWeather(item);
    tempMedia += Math.round(data);
  }
  const media = tempMedia / locations.length;
  return parseFloat(media.toFixed(2));
};

//GET TEMP MEDIA
export const getTemperaturaMedia = async () => {
  const getData = async () => {
    try {
      const locations = await getLocations(false);
      return await fetchAllTemps(locations);
    } catch (error) {
      console.error("Error al obtener la finca por ID:", error);
      throw error;
    }
  };

  return getData();
};

// ----------------------------------------------
//FETCH WEATHER FORECAST
export const fetchDatosForecast = async (params) => {
  try {
    const url = "https://api.open-meteo.com/v1/forecast";
    const response = await axios.get(url, { params });

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error retrieving weather data: ", error);
    throw error;
  }
};

//GET ALERTAS
export const getAlerts = () => {
  const alerts = [
    { id: 1, message: "Alerta 1: Este es el primer mensaje de alerta." },
    { id: 2, message: "Alerta 2: Aquí va el segundo mensaje de alerta." },
    { id: 3, message: "Alerta 3: Este es el tercer mensaje de alerta." },
    { id: 4, message: "Alerta 4: Cuarto mensaje de alerta, cuidado." },
    { id: 5, message: "Alerta 5: Último mensaje de alerta." },
  ];
  return alerts;
};

// ----------------------------------------------

// GET PRODUCCION PREVISTA
export const getProduccionPrevista = async (
  numOlivos = 100,
  rendimientoPorOlivo = 20,
  rendimientoAceite = 0.18
) => {
  try {
    const dataPrecios = await fetchOliveOilPrices();
    if (dataPrecios && dataPrecios.length > 0) {
      // Convertir el precio a un número y eliminar caracteres no numéricos
      const precioVenta = parseFloat(
        dataPrecios[0].precio.replace("€", "").replace(",", ".").trim()
      );

      // 1. Cálculo de la producción de aceitunas (kg)
      const produccionAceitunas = numOlivos * rendimientoPorOlivo;

      // 2. Cálculo de la producción de aceite (litros)
      const produccionAceite = produccionAceitunas * rendimientoAceite;

      // 3. Cálculo del beneficio
      const ingresos = produccionAceite * precioVenta;

      // Devolver todos los valores calculados
      return {
        produccionAceitunas,
        produccionAceite,
        ingresos,
      };
    } else {
      // Retorna 0 o algún valor predeterminado si no se pueden obtener los precios
      return {
        produccionAceitunas: 0,
        produccionAceite: 0,
        ingresos: 0,
      };
    }
  } catch (error) {
    console.error("Error al calcular la producción prevista:", error);
    // Retorna 0 o algún valor predeterminado en caso de error
    return {
      produccionAceitunas: 0,
      produccionAceite: 0,
      ingresos: 0,
      beneficio: 0,
    };
  }
};

// FETCH PRECIO ACEITE DE OLIVA
export const fetchOliveOilPrices = async () => {
  try {
    // Realiza la solicitud a Infaoliva
    const { data } = await axios.get(`${baseURLDatabase}/api/precio_aceite`);
    return data;
  } catch (error) {
    console.error("Error al obtener los precios:", error.message);
    return [];
  }
};
