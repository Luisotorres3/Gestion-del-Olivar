import axios from "axios";

export const getFincas = () => {
  const fincas = [
    {
      id: "14900A081000100000FZ",
      localizacion: {
        municipio: "LOS VILLARES",
        provincia: "CÓRDOBA",
        codigoPostal: "14029",
        direccion: "DS SIERRA Polígono 81 Parcela 10",
      },
      clase: "Rústico",
      usoPrincipal: "Agrario",
      superficieConstruida: "2.886 m2",
      anoConstruccion: 2013,
      numOlivos: 50, // Número estático de olivos para esta finca
    },
    {
      id: "24900A081000100000FZ",
      localizacion: {
        municipio: "VILLANUEVA DE CÓRDOBA",
        provincia: "CÓRDOBA",
        codigoPostal: "14100",
        direccion: "Calle Mayor, 23",
      },
      clase: "Urbano",
      usoPrincipal: "Residencial",
      superficieConstruida: "1.200 m2",
      anoConstruccion: 2005,
      numOlivos: 30, // Número estático de olivos para esta finca
    },
    {
      id: "34900A081000100000FZ",
      localizacion: {
        municipio: "LUCENA",
        provincia: "CÓRDOBA",
        codigoPostal: "14900",
        direccion: "Calle Real, 10",
      },
      clase: "Urbano",
      usoPrincipal: "Comercial",
      superficieConstruida: "800 m2",
      anoConstruccion: 1998,
      numOlivos: 40, // Número estático de olivos para esta finca
    },
    {
      id: "44900A081000100000FZ",
      localizacion: {
        municipio: "FUENTE PALMERA",
        provincia: "CÓRDOBA",
        codigoPostal: "14120",
        direccion: "Avenida Andalucía, 5",
      },
      clase: "Urbano",
      usoPrincipal: "Industrial",
      superficieConstruida: "3.500 m2",
      anoConstruccion: 2000,
      numOlivos: 60, // Número estático de olivos para esta finca
    },
    {
      id: "54900A081000100000FZ",
      localizacion: {
        municipio: "PUENTE GENIL",
        provincia: "CÓRDOBA",
        codigoPostal: "14500",
        direccion: "Calle San Francisco, 12",
      },
      clase: "Urbano",
      usoPrincipal: "Residencial",
      superficieConstruida: "2.000 m2",
      anoConstruccion: 2010,
      numOlivos: 70, // Número estático de olivos para esta finca
    },
  ];

  return fincas;
};

export const getNumFincas = () => {
  return getFincas().length;
};

export const getNumFincasNuevas = () => {
  return Math.floor(getFincas().length / 2);
};

export const getNumOlivos = () => {
  let count = 0;
  getFincas().forEach((finca) => {
    count += finca.numOlivos;
  });
  return count;
};

export const getProduccionPrevista = () => {
  return getFincas().length;
};

export const getFincaById = (id) => {
  const finca = getFincas().find((finca) => finca.id === id);
  return finca;
};

export const getCoordsForMarker = () => {
  const markerCoords = [
    [-3.7038, 40.4168], // Madrid
    [-4.4903, 36.7202], // Sevilla
    [-0.9061, 41.6488], // Bilbao
    [-0.8809, 41.9812], // San Sebastián
    [-3.7492, 43.4623], // Santander
    [-2.9337, 35.2873], // Málaga
    [2.6502, 39.5696], // Tarragona
    [-0.1276, 38.5411], // Valencia
    [-6.2685, 36.5449], // Cádiz
    [3.7038, 42.3601], // Barcelona
  ];
  return markerCoords;
};

export const getLocations = () => {
  const locations = [
    { id: 1, location: "Madrid" },
    { id: 2, location: "Barcelona" },
    { id: 3, location: "Murcia" },
    { id: 4, location: "Granada" },
    { id: 5, location: "Jaén" },
  ];
  return locations.slice(0, 5);
};

export const fetchAllTemps = async (locations) => {
  let tempMedia = 0;

  for (const item of locations) {
    const data = await fetchWeather(item.location);
    tempMedia += Math.round(data.main.temp);
  }
  return tempMedia;
};

export const getTemperaturaMedia = async () => {
  const locations = getLocations();
  return (await fetchAllTemps(locations)) / locations.length;
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
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=10febab50520dc67582eed976e016d80&units=metric`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
};
