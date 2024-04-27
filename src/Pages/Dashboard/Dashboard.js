import React, { useState, useEffect, useRef } from "react";
import styles from "./Dashboard.module.css";
import { Tooltip } from "react-tooltip";
import Card from "../../Components/Card/Card";
import plantation from "../../Images/Icons/plantation.png";
import olive from "../../Images/Icons/oliveTree.png";
import weather from "../../Images/Icons/weather.png";
import production from "../../Images/Icons/production.png";
import MapComp from "../../Components/Map/Map";
import Forecast from "../../Components/Forecast/Forecast";
import Carousel from "../../Utils/AlertsCarrousel";
import video from "../../Images/Videos/weatherVideo.mp4";
import {
  getAlerts,
  getCoordsForMarker,
  getLocations,
  getNumFincas,
  getNumFincasNuevas,
  getNumOlivos,
  getProduccionPrevista,
  getTemperaturaMedia,
} from "../../Utils/Firebase/databaseFunctions";

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

  useEffect(() => {
    const obtenerTemperaturaMedia = async () => {
      try {
        const temperaturaMedia = await getTemperaturaMedia();
        setTempMedia(temperaturaMedia);
      } catch (error) {
        console.error("Error al obtener la temperatura media:", error);
      }
    };

    obtenerTemperaturaMedia();
  }, []);

  return (
    <>
      <Card
        title={"Fincas"}
        content={getNumFincas()}
        extra={getNumFincasNuevas() + " nuevas"}
        img={plantation}
      />
      <Card
        title={"Olivos"}
        content={getNumOlivos()}
        extra={getNumOlivos() / getNumFincas() + " olivos medios por finca"}
        img={olive}
      />
      {tempMedia !== null ? (
        <Card
          title={"Temperatura media"}
          content={tempMedia + "ºC"}
          img={weather}
        />
      ) : (
        <p>Cargando...</p>
      )}
      <Card
        title={"Producción prevista"}
        content={getProduccionPrevista()}
        img={production}
      />
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
          <i
            className="fa fa-plus-circle"
            aria-hidden="true"
            data-tooltip-id="verMas"
            data-tooltip-content="Ver más"
            data-tooltip-place="right"
            style={{ color: "white", cursor: "pointer" }}
            onClick={handleShowMoreForecast}
          ></i>
        </div>
      </div>
    </>
  );
}

const Dashboard = () => {
  const mapRef = useRef();
  const [mapReady, setMapReady] = useState(false);
  const markerCoords = getCoordsForMarker();
  const [showAlerts, setShowAlerts] = useState(null);
  const alerts = getAlerts();
  const locations = getLocations();

  useEffect(() => {
    setMapReady(true);
  }, []);

  const handleShowAlerts = () => {
    setShowAlerts(!showAlerts);
  };

  const handleShowMoreForecast = () => {
    console.log("Show more");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.estadisticas}>
          <div className={styles.cardContent}>
            <InformationCards />
          </div>
          <div className={styles.mapContent}>
            <MapComp
              ref={mapRef}
              width="100%"
              height="100%"
              target={"map"}
              zoom="17"
              controls={true}
              showFincas={true}
            />
          </div>
        </div>
        <div className={`${styles.estadisticas} ${styles.secundario}`}>
          <div className={`${styles.contentDiv} ${styles.smallMap}`}>
            <MapComp
              target={"mapaLugares"}
              ref={mapRef}
              width="100%"
              height="100%"
              zoom="5"
              markerCoords={markerCoords}
            />
          </div>
          <div className={`${styles.contentDiv} ${styles.forecast}`}>
            <ForecastInformation
              locations={locations}
              handleShowMoreForecast={handleShowMoreForecast}
            />
          </div>

          <div className={`${styles.contentDiv} ${styles.notificationsDiv}`}>
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
    </div>
  );
};

export default Dashboard;
