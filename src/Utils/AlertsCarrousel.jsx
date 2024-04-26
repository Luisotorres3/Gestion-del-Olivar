import React, { useState, useEffect, useRef } from "react";
import styles from "./AlertsCarrousel.module.css"; // Importa los estilos CSS para el carrusel

const Carousel = ({ alerts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimationActive, setIsAnimationActive] = useState(true);
  const listRef = useRef(null);

  const [vector, setVector] = useState([alerts]);

  useEffect(() => {
    // Función para cambiar automáticamente las alertas cada cierto intervalo de tiempo
    const interval = setInterval(() => {
      if (isAnimationActive) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % alerts.length);
      }
    }, 5000); // Cambia de alerta cada 5 segundos

    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
  }, [alerts.length, isAnimationActive]); // Ejecuta este efecto cuando cambie la longitud de la lista de alertas o el estado de animación

  const handleDivClick = () => {
    if (!isAnimationActive) {
      setCurrentIndex(0); // Reinicia el índice actual al principio si la animación se activa
      setVector(alerts);
      if (listRef.current) {
        listRef.current.scrollTop = 0; // Hacer scroll hasta arriba del ul
      }
    }
    setIsAnimationActive(!isAnimationActive); // Cambia el estado de la animación
  };

  return (
    <div
      className={`${styles.notifications} ${
        isAnimationActive ? "" : styles.apagado
      }`}
      onClick={handleDivClick}
    >
      <ul
        ref={listRef}
        style={{
          transform: `translateY(-${currentIndex * 100}%)`,
          height: "100%",
        }}
      >
        {/* Muestra solo una alerta a la vez */}
        {vector.map((item, index) => (
          <li key={index} className={styles.alert}>
            {item.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Carousel;
