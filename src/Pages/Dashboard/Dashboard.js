import React, { useState, useEffect, useRef } from "react";
import styles from "./Dashboard.module.css";
import { Tooltip } from "react-tooltip";
import { Link } from "react-router-dom";

// Componentes y utilidades personalizados
import Card from "../../Components/Card/Card";
import MapComp from "../../Components/Map/Map";
import Forecast from "../../Components/ForecastComp/ForecastComp";
import { PopupForm } from "../../Components/Fincas/ListaFincas";

// Iconos e imágenes
import plantation from "../../Images/Icons/plantation.png";
import olive from "../../Images/Icons/oliveTree.png";
import weather from "../../Images/Icons/weather.png";
import production from "../../Images/Icons/production.png";
import video from "../../Images/Videos/weatherVideo.mp4";

// Funciones de la base de datos
import {
  fetchOliveOilPrices,
  getCoordsForMarker,
  getFincas,
  getLocations,
  getNumFincasNuevas,
  getNumOlivos,
  getProduccionPrevista,
  getTemperaturaMedia,
} from "../../Utils/Firebase/databaseFunctions";

function InformationCards() {
  const [tempMedia, setTempMedia] = useState(null);
  const [numFincas, setNumFincas] = useState(0);
  const [numOlivos, setNumOlivos] = useState(0);
  const [productionPrevista, setProduccionPrevista] = useState({
    produccionAceitunas: 0,
    produccionAceite: 0,
    ingresos: 0,
  });

  // Fetch de datos para fincas y olivos
  const fetchFincas = async () => {
    try {
      const data = await getFincas();
      const data2 = await getNumOlivos();
      setNumFincas(data.data.length);
      setNumOlivos(data2);
    } catch (error) {
      console.error("Hubo un error al obtener las fincas:", error);
    }
  };

  // Fetch de la temperatura media
  const obtenerTemperaturaMedia = async () => {
    try {
      const temperaturaMedia = await getTemperaturaMedia();
      setTempMedia(temperaturaMedia);
    } catch (error) {
      console.error("Error al obtener la temperatura media:", error);
    }
  };

  // Fetch de la producción prevista
  const fetchProduccionPrevista = async (numOlivos) => {
    try {
      const prod = await getProduccionPrevista(numOlivos);
      setProduccionPrevista(prod);
    } catch (error) {
      console.error("Error al obtener la producción prevista:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchFincas();
      await obtenerTemperaturaMedia();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (numOlivos > 0) {
      fetchProduccionPrevista(numOlivos);
    }
  }, [numOlivos]);

  return (
    <>
      {numFincas > 0 ? (
        <>
          <Card
            title={"Fincas"}
            content={numFincas}
            extra={getNumFincasNuevas() + " nuevas"}
            img={plantation}
          />
          <Card
            title={"Olivos"}
            content={numOlivos}
            extra={
              (numOlivos / numFincas).toFixed(0) + " olivos medios por finca"
            }
            img={olive}
          />
          <Card
            title={"Temperatura media"}
            content={tempMedia + "ºC"}
            img={weather}
          />
          <Card
            title={"Producción aprox"}
            content={`${productionPrevista.produccionAceitunas} kg`}
            content_extra={`${productionPrevista.produccionAceite} litros`}
            img={production}
            extra={`${productionPrevista.ingresos} €`}
          />
        </>
      ) : (
        <>Error cargando fincas</>
      )}
    </>
  );
}

function ForecastInformation({ locations, handleShowMoreForecast }) {
  return (
    <>
      <div className={styles.background}>
        {/* Video de fondo */}
        <video autoPlay loop muted className={styles.video}>
          <source src={video} type="video/mp4" />
          Tu navegador no admite el elemento de video.
        </video>
      </div>
      <div className={styles.forecastContent}>
        {locations &&
          locations.length > 0 &&
          locations.map((item, i) => <Forecast key={i} location={item} />)}
        <div className={styles.buttonMasForecast}>
          <Link to="/pronostico">
            <i
              className="fa fa-plus-circle"
              aria-hidden="true"
              data-tooltip-id="verMas"
              data-tooltip-content="Ver más"
              data-tooltip-place="right"
              style={{ color: "white", cursor: "pointer" }}
            ></i>
          </Link>
        </div>
      </div>
    </>
  );
}

const Dashboard = () => {
  const mapRef = useRef();
  const [mapReady, setMapReady] = useState(false);
  const [showAlerts, setShowAlerts] = useState(null);
  const [locations, setLocations] = useState([]);
  const [markerCoords, setMarkerCoords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fincas, setFincas] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [prices, setPrices] = useState([]);
  async function fetchFincas() {
    try {
      const dataFincas = await getFincas();
      const data = await getLocations();
      const markerData = await getCoordsForMarker();
      setFincas(dataFincas.data);
      setLocations(data);
      setMarkerCoords(markerData);
      setLoading(false);
    } catch (error) {
      console.error("Hubo un error al obtener las fincas:", error);
    }
  }

  async function fetchPrecioAceite() {
    try {
      const dataPrecios = await fetchOliveOilPrices();
      setPrices(dataPrecios);
    } catch (error) {
      console.error("Hubo un error al obtener las fincas:", error);
    }
  }

  useEffect(() => {
    setMapReady(true);
    fetchFincas();
    fetchPrecioAceite();
  }, []);

  const handleShowAlerts = () => {
    setShowAlerts(!showAlerts);
  };

  const handleShowMoreForecast = () => {
    console.log("Show more");
  };

  // Abre el formulario emergente
  const openPopup = () => {
    setIsPopupOpen(true);
  };
  // Cierra el formulario emergente
  const closePopup = () => {
    setIsPopupOpen(false);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <h2>Cargando datos...</h2>
      </div>
    );
  }

  if (!fincas || fincas.length === 0) {
    return (
      <div className={styles.noFincasContainer}>
        <h2>No hay fincas aún que gestionar</h2>
        <button onClick={openPopup} className={styles.createFincaLink}>
          Crear Finca
        </button>
        <PopupForm
          isOpen={isPopupOpen}
          onClose={closePopup}
          fetchFincas={fetchFincas}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.estadisticas}>
          <div className={styles.cardContent}>
            <InformationCards />
          </div>
          <div className={styles.mapContent}>
            {mapReady && fincas.length > 0 ? (
              <MapComp
                ref={mapRef}
                width="100%"
                height="100%"
                target={"map"}
                zoom="17"
                controls={true}
                showFincas={true}
                fincas={fincas}
              />
            ) : (
              <div>
                <h2>Cargando mapa</h2>
              </div>
            )}
          </div>
        </div>
        <div className={`${styles.estadisticas} ${styles.secundario}`}>
          <div className={`${styles.contentDiv} ${styles.smallMap}`}>
            {markerCoords && (
              <MapComp
                target={"mapaLugares"}
                ref={mapRef}
                width="100%"
                height="100%"
                zoom="5"
                markerCoords={markerCoords}
              />
            )}
          </div>
          <div className={`${styles.contentDiv} ${styles.forecast}`}>
            <ForecastInformation
              locations={locations}
              handleShowMoreForecast={handleShowMoreForecast}
            />
          </div>
          <div className={`${styles.contentDiv} ${styles.preciosDiv}`}>
            <div className={styles.preciosTabla}>
              <ul className={styles.headerRow}>
                <li className={styles.headerCell}>
                  <h5>Tipo de aceite</h5>
                </li>
                <li className={styles.headerCell}>
                  <h5>Variedad</h5>
                </li>
                <li
                  className={styles.headerCell}
                  style={{ position: "relative" }}
                >
                  <h5>Precio</h5>
                  <a
                    href="https://www.infaoliva.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.infoButton}
                  >
                    <i className="fa fa-info-circle" aria-hidden="true"></i>
                  </a>
                </li>
              </ul>
              {prices.map((price, index) => (
                <ul className={styles.dataRow} key={index}>
                  <li className={styles.dataCell}>
                    <h4>{price.tipo}</h4>
                  </li>
                  <li className={styles.dataCell}>
                    <h4>{price.variedad}</h4>
                  </li>
                  <li className={styles.dataCell}>
                    <h4>{price.precio}</h4>
                  </li>
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* TOOLTIPS */}
      <Tooltip id="verMas" style={{ zIndex: "9999" }} />
    </div>
  );
};

export default Dashboard;
