import React, { useRef, useState } from "react";
import styles from "./Olivos.module.css";
import MapComp from "../../Components/Map/Map";
import axios from "axios";

const Olivos = () => {
  const mapRef = useRef();
  const [showPhoto, setShowPhoto] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const exportMapImage = () => {
    setLoading(true);
    mapRef.current.once("rendercomplete", function () {
      const mapCanvas = document.createElement("canvas");
      const size = mapRef.current.getSize();
      mapCanvas.width = size[0];
      mapCanvas.height = size[1];
      const mapContext = mapCanvas.getContext("2d");
      Array.prototype.forEach.call(
        mapRef.current
          .getViewport()
          .querySelectorAll(".ol-layer canvas, canvas.ol-layer"),
        function (canvas) {
          if (canvas.width > 0) {
            const opacity =
              canvas.parentNode.style.opacity || canvas.style.opacity;
            mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);
            let matrix;
            const transform = canvas.style.transform;
            if (transform) {
              // Get the transform parameters from the style's transform matrix
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
            // Apply the transform to the export map context
            CanvasRenderingContext2D.prototype.setTransform.apply(
              mapContext,
              matrix
            );
            const backgroundColor = canvas.parentNode.style.backgroundColor;
            if (backgroundColor) {
              mapContext.fillStyle = backgroundColor;
              mapContext.fillRect(0, 0, canvas.width, canvas.height);
            }
            mapContext.drawImage(canvas, 0, 0);
          }
        }
      );
      mapContext.globalAlpha = 1;
      mapContext.setTransform(1, 0, 0, 1, 0, 0);
      setShowPhoto(mapCanvas.toDataURL());
      setSelectedImage(mapCanvas.toDataURL());

      mapCanvas.toBlob(async function (blob) {
        const formData = new FormData();
        formData.append("image", blob, "filename.png");

        try {
          const response = await axios.post(
            "http://localhost:5000/gestiondelolivar-48d30/us-central1/process_image",
            formData
          );
          setProcessedImage(response.data);
          setLoading(false);
        } catch (error) {
          setErrorMessage("Error procesando imagen");
          setProcessedImage(null);
          setLoading(false);
          console.error("No se ha podido procesar la imagen: " + error);
        }
      });

      //console.log(selectedImage);
    });
    mapRef.current.renderSync();
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.insideContent}>
          <select></select>
          <div className={`${styles.contentDiv} ${styles.images}`}>
            <div className={styles.imagesDiv}>
              <h3>Imagen original</h3>
              <MapComp
                ref={mapRef}
                id="mapSelect"
                width="100%"
                height="100%"
                target={"mapSelect"}
                zoom="19"
                controls={true}
              />
            </div>

            <div className={styles.imagesDiv}>
              <h3>Imagen procesada</h3>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center h-100 w-100 border">
                  <h1>{"Cargando"}</h1>
                </div>
              ) : processedImage ? (
                <img
                  className="h-100 w-100"
                  src={`data:image/png;base64,${processedImage}`}
                  alt="Processed"
                />
              ) : (
                <div className="d-flex justify-content-center align-items-center h-100 w-100 border">
                  <h1>{errorMessage}</h1>
                </div>
              )}
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
