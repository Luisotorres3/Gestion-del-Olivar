import axios from "axios";

const baseURLDatabase =
  "http://localhost:5000/gestiondelolivar-48d30/us-central1/app";

//GET FINCAS
export const getFincas = async () => {
  try {
    const response = await axios.get(`${baseURLDatabase}/api/fincas`);
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
      `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${countryCode}&limit=${limit}&appid=${apiKey}`
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

// ----------------------------------------------

//GET NUM DE OLIVOS
export const getNumOlivos = async () => {
  try {
    let count = 0;
    const fincas = await getFincas();

    fincas.data.forEach((item) => {
      console.log(item);
      count += item.data.numOlivos;
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
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},es&appid=10febab50520dc67582eed976e016d80&units=metric&lang=es`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
};

//FETCH WEATHER FOR ALL LOCATIONS
export const fetchAllTemps = async (locations) => {
  let tempMedia = 0;

  for (const item of locations) {
    const data = await fetchWeather(item);
    tempMedia += Math.round(data.main.temp);
  }
  return tempMedia;
};

//GET TEMP MEDIA
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

//FETCH WEATHER AEMET
export const fetchWeatherAEMET = async (finca) => {
  try {
    // Definir la API Key
    const AK =
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsdWlzLnMudG9ycmVzM0BnbWFpbC5jb20iLCJqdGkiOiJlMWZhOWE3Ni1jYWNjLTRkNjMtOGUwYy0yM2U5NjRiNDhmODQiLCJpc3MiOiJBRU1FVCIsImlhdCI6MTcxNDU5MzU4MywidXNlcklkIjoiZTFmYTlhNzYtY2FjYy00ZDYzLThlMGMtMjNlOTY0YjQ4Zjg0Iiwicm9sZSI6IiJ9.kmPsx02v15MOS_usg3oBS-nXXO_PnY3e3_EIdHLktmw";

    // Definir URLs de solicitud
    const URL1 =
      "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/28079";
    let URL2 = "";

    // Hacer la primera solicitud
    const response1 = await fetch(`${URL1}?api_key=${AK}`);
    const data1 = await response1.json();

    // Obtener el campo "datos"
    URL2 = data1.datos;

    // Hacer la segunda solicitud
    const response2 = await fetch(URL2);
    const data2 = await response2.json();

    // Obtener la longitud del objeto JSON
    const registros = data2.length;

    // Obtener la fecha del primer registro
    let fechaini = new Date(data2[0].fint);
    fechaini =
      fechaini.toLocaleDateString() + " " + fechaini.toLocaleTimeString();

    // Obtener la fecha del último registro
    let fechafin = new Date(data2[data2.length - 1].fint);
    fechafin =
      fechafin.toLocaleDateString() + " " + fechafin.toLocaleTimeString();

    // Construir el texto a mostrar
    const newTexto = `Se han descargado ${registros} registros desde el ${fechaini} hasta el ${fechafin}. `;
  } catch (error) {
    console.error("Error al obtener datos:", error);
  }
};

// ----------------------------------------------

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

//GET PRODUCCION PREVISTA
export const getProduccionPrevista = () => {
  return getFincas().length;
};
