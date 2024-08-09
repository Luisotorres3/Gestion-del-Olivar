import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LandingPage.module.css"; // Importa tu archivo CSS
import { FaTree, FaCloudSun, FaImage } from "react-icons/fa"; // Iconos
import video from "../../Images/Videos/oliveTrees.mp4"; // Asegúrate de que la ruta sea correcta

function LandingPage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/account"); // Cambia la ruta al endpoint correcto
  };

  return (
    <div className={styles.landingPage}>
      <div className={styles.heroSection}>
        {/* Añade el video de fondo */}
        <video autoPlay muted loop className={styles.videoBackground}>
          <source src={video} type="video/mp4" />
          Tu navegador no soporta la reproducción de videos.
        </video>

        <div className={styles.heroOverlay}>
          <header className={styles.landingHeader}>
            <h1>Gestión Eficiente de Fincas y Olivares</h1>
            <p>
              Optimiza cada aspecto de tu olivar con nuestra plataforma
              innovadora.
            </p>
          </header>
        </div>
      </div>

      <section className={styles.landingContent}>
        <div className={styles.feature}>
          <FaTree className={styles.icon} />
          <h2>Gestión de Fincas</h2>
          <p>
            Administra tus fincas de manera centralizada y eficiente. Nuestra
            herramienta te permite llevar un control preciso sobre la ubicación,
            tamaño, y características de cada finca.
          </p>
        </div>

        <div className={styles.feature}>
          <FaCloudSun className={styles.icon} />
          <h2>Pronóstico del Tiempo</h2>
          <p>
            Accede a pronósticos meteorológicos detallados para planificar mejor
            las actividades agrícolas. Protege tus cultivos de condiciones
            climáticas adversas.
          </p>
        </div>

        <div className={styles.feature}>
          <FaImage className={styles.icon} />
          <h2>Conteo de Olivos con Imágenes</h2>
          <p>
            Utilizamos algoritmos avanzados de procesamiento de imágenes para
            monitorear y contar tus olivos. Toma decisiones basadas en datos
            precisos sobre la salud y productividad de tu olivar.
          </p>
        </div>
      </section>

      <footer className={styles.landingFooter}>
        <button className={styles.loginButton} onClick={handleLoginClick}>
          Iniciar Sesión
        </button>
      </footer>
    </div>
  );
}

export default LandingPage;
