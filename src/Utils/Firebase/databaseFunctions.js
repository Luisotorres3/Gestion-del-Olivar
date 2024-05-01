import axios from "axios";

export const getFincas = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/gestiondelolivar-48d30/us-central1/app/api/fincas"
    );
    return response;
  } catch (error) {
    console.error(error);
  }

  return [];
};

export const getNumFincas = async () => {
  try {
    const fincas = await getFincas();
    return fincas.data.length;
  } catch (error) {
    console.error("Error al contar las fincas:", error);
    throw error;
  }
};

export const getNumFincasNuevas = () => {
  return Math.floor(0);
};

export const getNumOlivos = () => {
  let count = 0;
  return count;
};

export const getProduccionPrevista = () => {
  return getFincas().length;
};

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
export const getCoordsForMarker = async () => {
  try {
    const limit = 1; // Limitamos a 1 resultado por municipio
    const municipios = await getLocations(false);
    const countryCode = "ES";
    const apiKey = "10febab50520dc67582eed976e016d80";

    const coordenadasPromesas = municipios.map(async (municipio) => {
      try {
        const response = await axios.get(
          `http://api.openweathermap.org/geo/1.0/direct?q=${municipio},${countryCode}&limit=${limit}&appid=${apiKey}`
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

export const fetchAllTemps = async (locations) => {
  let tempMedia = 0;

  for (const item of locations) {
    const data = await fetchWeather(item);
    tempMedia += Math.round(data.main.temp);
  }
  return tempMedia;
};

export const getTemperaturaMedia = async () => {
  const getData = async () => {
    try {
      const locations = await getLocations();
      return (await fetchAllTemps(locations)) / locations.length;
    } catch (error) {
      console.error("Error al obtener la finca por ID:", error);
      throw error;
    }
  };

  return getData();
};

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

export const fetchWeather = async (city) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},es&appid=10febab50520dc67582eed976e016d80&units=metric`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
};
