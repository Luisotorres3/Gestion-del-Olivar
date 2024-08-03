import React, { useRef, useState } from "react";
import styles from "./Olivos.module.css";
import MapComp from "../../Components/Map/Map";
import axios from "axios";
import { Switch, FormControlLabel, Button } from "@mui/material";

const Olivos = () => {
  const mapRef = useRef();
  const [showPhoto, setShowPhoto] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("easy");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  const handleImageUpload = (file) => {
    console.log("Imagen seleccionada:", file);
  };

  const exportMapImage = async (method) => {
    setLoading(true);

    const processImage = async (imageBlob) => {
      const formData = new FormData();
      formData.append("image", imageBlob, "filename.png");

      try {
        const response = await axios.post(
          `http://localhost:5000/process_image${
            method === "easy" ? "" : method
          }`,
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
    };

    if (showPhoto && uploadedImage) {
      // Procesar imagen cargada
      const imageBlob = new Blob([uploadedImage], { type: uploadedImage.type });
      await processImage(imageBlob);
    } else {
      // Procesar imagen del mapa
      mapRef.current.once("rendercomplete", async function () {
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
        setSelectedImage(mapCanvas.toDataURL());

        mapCanvas.toBlob(async function (blob) {
          await processImage(blob);
        });
      });
      mapRef.current.renderSync();
    }
  };

  const handleButtonClick = (method) => {
    setSelectedMethod(method);
    exportMapImage(method);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.insideContent}>
          <div className={`${styles.contentDiv} ${styles.options}`}>
            <div>
              <Button
                variant={selectedMethod === "easy" ? "contained" : "outlined"}
                onClick={() => handleButtonClick("easy")}
                aria-label="Fácil"
              >
                Método Fácil (Algoritmo básico)
              </Button>
              <Button
                variant={selectedMethod === "2" ? "contained" : "outlined"}
                onClick={() => handleButtonClick("2")}
                aria-label="Medio"
              >
                Método Medio (Combinación algoritmos)
              </Button>
              <Button
                variant={selectedMethod === "3" ? "contained" : "outlined"}
                onClick={() => handleButtonClick("3")}
                aria-label="Pro"
              >
                Método PRO (META AI)
              </Button>
            </div>
            <div className={styles.flexColumna}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showPhoto}
                    onChange={() => setShowPhoto(!showPhoto)}
                  />
                }
                label="Mapa/Imagen"
              />
              {showPhoto && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              )}
            </div>
          </div>
          <div className={`${styles.contentDiv} ${styles.images}`}>
            <div className={styles.imagesDiv}>
              <h3>Imagen original</h3>
              {showPhoto ? (
                <>
                  {uploadedImage && (
                    <img
                      src={URL.createObjectURL(uploadedImage)}
                      alt="Selected"
                      style={{ width: "100%", height: "100%" }}
                    />
                  )}
                </>
              ) : (
                <MapComp
                  ref={mapRef}
                  id="mapSelect"
                  width="100%"
                  height="100%"
                  target={"mapSelect"}
                  zoom="19"
                  controls={true}
                />
              )}
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
        </div>
      </div>
    </div>
  );
};

export default Olivos;
