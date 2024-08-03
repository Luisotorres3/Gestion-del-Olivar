import React, { useState, useEffect, useRef } from "react";
import styles from "./Dashboard.module.css";
import { Tooltip } from "react-tooltip";
import Card from "../../Components/Card/Card";
import plantation from "../../Images/Icons/plantation.png";
import olive from "../../Images/Icons/oliveTree.png";
import weather from "../../Images/Icons/weather.png";
import production from "../../Images/Icons/production.png";
import MapComp from "../../Components/Map/Map";
import Forecast from "../../Components/ForecastComp/ForecastComp";
import Carousel from "../../Utils/AlertsCarrousel";
import video from "../../Images/Videos/weatherVideo.mp4";
import {
  getAlerts,
  getCoordsForMarker,
  getFincas,
  getLocations,
  getNumFincas,
  getNumFincasNuevas,
  getNumOlivos,
  getProduccionPrevista,
  getTemperaturaMedia,
} from "../../Utils/Firebase/databaseFunctions";
import { Link } from "react-router-dom";

function Alertas({ alerts, showAlerts, handleShowAlerts }) {
  if (alerts.length > 0) {
    return (
      <div
        className={styles.alertas}
        style={{
          backgroundColor: showAlerts ? "whitesmoke" : "",
          boxShadow: showAlerts ? "1px 1px 7px rgba(0, 0, 0, 0.15)" : " ",
        }}
      >
        <div className={styles.navAlertas}>
          <button
            onClick={handleShowAlerts}
            data-tooltip-id="alertas"
            data-tooltip-content={
              showAlerts ? "Cerrar Alertas" : "Mostrar Alertas"
            }
            data-tooltip-place="right"
          >
            <i className="fa fa-bell" aria-hidden="true"></i>
          </button>
          {showAlerts && (
            <nav
              className={`${styles.navAlertas} ${
                showAlerts ? styles.showAlerts : ""
              }`}
              style={{
                width: showAlerts === true ? "auto" : 0,
                height: showAlerts === true ? "100%" : 0,
              }}
            >
              <ul>
                {alerts &&
                  alerts.length > 0 &&
                  alerts.map((item, i) => (
                    <li key={item.id}>{item.message}</li>
                  ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    );
  }
}

function InformationCards() {
  const [tempMedia, setTempMedia] = useState(null);
  const [numFincas, setNumFincas] = useState(0);
  const [numOlivos, setNumOlivos] = useState(0);

  const fetchFincas = async () => {
    try {
      const data = await getFincas();
      const data2 = await getNumOlivos();
      setNumFincas(data.data.length);
      setNumOlivos(data2);
    } catch (error) {
      console.error("Hubo un error al obtener las fincas:", error);
      // Manejar el error según sea necesario
    }
  };

  const obtenerTemperaturaMedia = async () => {
    try {
      const temperaturaMedia = await getTemperaturaMedia();
      setTempMedia(temperaturaMedia);
    } catch (error) {
      console.error("Error al obtener la temperatura media:", error);
    }
  };

  useEffect(() => {
    fetchFincas();
    obtenerTemperaturaMedia();
  }, []);

  return (
    <>
      {tempMedia ? (
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
            extra={numOlivos / numFincas + " olivos medios por finca"}
            img={olive}
          />
          <Card
            title={"Temperatura media"}
            content={tempMedia + "ºC"}
            img={weather}
          />
          <Card
            title={"Producción prevista"}
            content={getProduccionPrevista()}
            img={production}
          />
        </>
      ) : (
        <div>
          <h1>Cargando datos</h1>
        </div>
      )}
    </>
  );
}

function ForecastInformation({ locations, handleShowMoreForecast }) {
  return (
    <>
      <div className={styles.background}>
        {/* Aquí establece el video o GIF como fondo */}
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
  const alerts = getAlerts();
  const [locations, setLocations] = useState([]);
  const [markerCoords, setMarkerCoords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fincas, setFincas] = useState(null);

  useEffect(() => {
    setMapReady(true);
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

    fetchFincas();
  }, []);

  const handleShowAlerts = () => {
    setShowAlerts(!showAlerts);
  };

  const handleShowMoreForecast = () => {
    console.log("Show more");
  };

  return (
    <div className={styles.container}>
      {!loading ? (
        <>
          <div className={styles.content}>
            <div className={styles.estadisticas}>
              <div className={styles.cardContent}>
                {loading ? (
                  <div>
                    <h2>Cargando info</h2>
                  </div>
                ) : (
                  <InformationCards />
                )}
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

              <div
                className={`${styles.contentDiv} ${styles.notificationsDiv}`}
              >
                <Carousel alerts={alerts} />
              </div>
            </div>
          </div>

          <Alertas
            alerts={alerts}
            showAlerts={showAlerts}
            handleShowAlerts={handleShowAlerts}
          />
          {/* TOOLTIPS*/}
          <Tooltip id="alertas" style={{ zIndex: "9999" }} />
          <Tooltip id="verMas" style={{ zIndex: "9999" }} />
        </>
      ) : (
        <div>
          <h2>Cargando datos</h2>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
