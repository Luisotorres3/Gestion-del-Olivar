import React, { useRef, useState } from "react";
import styles from "./Olivos.module.css";
import MapComp from "../../Components/Map/Map";

const Olivos = () => {
  const mapRef = useRef();
  const [showPhoto, setShowPhoto] = useState(false);

  const processImage = () => {};

  const convertToBinary = (imageData, threshold) => {
    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
      const intensity = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      const newValue = intensity > threshold ? 0 : 255;
      pixels[i] = newValue;
      pixels[i + 1] = newValue;
      pixels[i + 2] = newValue;
    }

    return imageData;
  };

  const exportMapImage = () => {
    mapRef.current.once("rendercomplete", async () => {
      const mapCanvas = document.createElement("canvas");
      const size = mapRef.current.getSize();
      mapCanvas.width = size[0];
      mapCanvas.height = size[1];
      const mapContext = mapCanvas.getContext("2d");

      Array.prototype.forEach.call(
        mapRef.current.getViewport().querySelectorAll(".ol-layer canvas"),
        (canvas) => {
          if (canvas.width > 0) {
            const opacity =
              canvas.parentNode.style.opacity || canvas.style.opacity;
            mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);
            let matrix;
            const transform = canvas.style.transform;
            if (transform) {
              matrix = transform
                .match(/^matrix\(([^\(]*)\)$/)[1]
                .split(",")
                .map(Number);
            } else {
              matrix = [
                parseFloat(canvas.style.width) / canvas.width,
                0,
                0,
                parseFloat(canvas.style.height) / canvas.height,
                0,
                0,
              ];
            }
            CanvasRenderingContext2D.prototype.setTransform.apply(
              mapContext,
              matrix
            );
            mapContext.drawImage(canvas, 0, 0);
          }
        }
      );

      mapContext.globalAlpha = 1;
      mapContext.setTransform(1, 0, 0, 1, 0, 0);

      const imageData = mapContext.getImageData(
        0,
        0,
        mapCanvas.width,
        mapCanvas.height
      );

      const binaryImageData = convertToBinary(imageData, 100);

      mapContext.putImageData(binaryImageData, 0, 0);
      setShowPhoto(mapCanvas.toDataURL());

      processImage(); // Llamada a processImage aquí
    });

    mapRef.current.renderSync();
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.insideContent}>
          <div className={`${styles.contentDiv} ${styles.images}`}>
            <div className={styles.imagesDiv}>
              <h3>Imagen original</h3>
              <MapComp
                ref={mapRef}
                id="mapSelect"
                width="100%"
                height="100%"
                target={"mapSelect"}
                zoom="17"
                controls={true}
              />
            </div>
            <div className={styles.imagesDiv}>
              <h3>Imagen procesada</h3>
              {showPhoto && <img src={showPhoto} alt="Processed image" />}
              <canvas id="canvasOutput" />
            </div>
          </div>
          <div className={`${styles.contentDiv} ${styles.actions}`}>
            <button onClick={exportMapImage}>Procesar Imagen</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Olivos;
