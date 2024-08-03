import React, { useState, useEffect } from "react";
import styles from "../../Pages/Forecast/Forecast.module.css";
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
  Filler,
} from "chart.js";
import {
  fetchDatosForecast,
  getCoordsForCity,
} from "../../Utils/Firebase/databaseFunctions";

// Registramos los componentes de Chart.js y el plugin Filler
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function ForecastStatus({ selectedFinca }) {
  const [datosForecast, setDatosForecast] = useState(null);

  const [opcionChart, setOpcionChart] = useState("temperatura");

  useEffect(() => {
    const fetchForecast = async () => {
      if (!selectedFinca) return;

      const coords = await getCoordsForCity(selectedFinca);
      let params;

      if (opcionChart === "precipitacion") {
        params = {
          latitude: coords[0],
          longitude: coords[1],
          daily: ["precipitation_sum"],
          timezone: "auto",
        };
      } else {
        params = {
          latitude: coords[0],
          longitude: coords[1],
          daily: ["temperature_2m_max", "temperature_2m_min"],
          timezone: "auto",
        };
      }

      try {
        const data = await fetchDatosForecast(params);
        const weatherData = {
          labels: data.daily.time.map((t) =>
            new Date(t).toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })
          ),
          datasets:
            opcionChart === "precipitacion"
              ? [
                  {
                    label: "Precipitaciones (mm)",
                    data: data.daily.precipitation_sum,
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    fill: true,
                  },
                ]
              : [
                  {
                    label: "Temperatura Máxima",
                    data: data.daily.temperature_2m_max,
                    borderColor: "rgba(255, 99, 132, 1)",
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    fill: true,
                  },
                  {
                    label: "Temperatura Mínima",
                    data: data.daily.temperature_2m_min,
                    borderColor: "rgba(54, 162, 235, 1)",
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    fill: true,
                  },
                ],
        };
        setDatosForecast(weatherData);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      }
    };

    fetchForecast();
  }, [selectedFinca, opcionChart]);

  const handleChange = (event) => {
    setOpcionChart(event.target.value);
  };

  const getSuggestedMinMax = () => {
    if (!datosForecast || !datosForecast.datasets.length)
      return { suggestedMin: 0, suggestedMax: 0 };
    const data = datosForecast.datasets.flatMap((dataset) => dataset.data);
    const min = Math.min(...data);
    const max = Math.max(...data);
    const rangePadding = opcionChart === "precipitacion" ? 0.1 : 5; // Ajusta el padding según el tipo de datos

    return {
      suggestedMin: min - rangePadding,
      suggestedMax: max + rangePadding,
    };
  };

  const { suggestedMin, suggestedMax } = getSuggestedMinMax();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: false,
        suggestedMin,
        suggestedMax,
      },
    },
  };

  return (
    <>
      <div className={styles.forecastStatus}>
        <h3>Status</h3>
        <select value={opcionChart} onChange={handleChange}>
          <option value="temperatura">Máximas y Mínimas</option>
          <option value="precipitacion">Precipitaciones</option>
          <option value="opcion3">Opción 3</option>
        </select>
      </div>
      {datosForecast && (
        <div className={styles.chartHourly}>
          <div style={{ height: "100%", width: "100%" }}>
            <Line data={datosForecast} options={options} />
          </div>
        </div>
      )}
    </>
  );
}

export default ForecastStatus;
