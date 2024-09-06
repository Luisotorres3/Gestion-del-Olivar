import React, { useEffect, useRef, useState } from "react";
import styles from "./Olivos.module.css";
import MapComp from "../../Components/Map/Map";
import axios from "axios";
import { Switch, FormControlLabel, Button } from "@mui/material";
import { getFincas } from "../../Utils/Firebase/databaseFunctions";

const Olivos = () => {
  const mapRef = useRef();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("1");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [numOlivosDetectados, setNumOlivosDetectados] = useState(null);
  const [fincas, setFincas] = useState(null);

  const [polygon, setPolygon] = useState(null);
  const [activeMode, setActiveMode] = useState("modoMapa");
  const [mapInitialized, setMapInitialized] = useState(false);

  const handleModeChange = (mode) => {
    if (activeMode === mode) {
      setActiveMode("modoMapa"); // Volver a modoMapa si se selecciona el mismo modo
    } else {
      setActiveMode(mode); // Cambiar al nuevo modo
      setProcessedImage(null);
      setUploadedImage(null);
      setNumOlivosDetectados(null);
    }

    if (activeMode !== "modoFinca") setPolygon(null);
  };

  const handlePolygon = (polygon) => {
    setPolygon(polygon);
  };

  // Fetch de datos para fincas y olivos
  const fetchFincas = async () => {
    try {
      const data = await getFincas();
      setFincas(data.data);
    } catch (error) {
      console.error("Hubo un error al obtener las fincas:", error);
    }
  };

  useEffect(() => {
    fetchFincas();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  // Usar un efecto para esperar a que el mapa esté completamente inicializado
  useEffect(() => {
    if (mapRef.current) {
      // Esto asegura que el mapa ha sido montado y está disponible
      setMapInitialized(true);
    } else {
      setMapInitialized(false);
    }
  }, [activeMode, polygon]);

  const exportMapImage = async () => {
    setLoading(true);

    const processImage = async (imageBlob) => {
      const formData = new FormData();
      formData.append("image", imageBlob, "filename.png");

      try {
        const endpoint = `https://us-central1-gestiondelolivar-48d30.cloudfunctions.net/process_image${
          selectedMethod === "1" ? "" : selectedMethod
        }`;
        const response = await axios.post(endpoint, formData);
        setProcessedImage(response.data.image);
        setNumOlivosDetectados(response.data.num_olivos);
        setLoading(false);

        // Crear URL de descarga
        const blob = new Blob(
          [Uint8Array.from(atob(response.data.image), (c) => c.charCodeAt(0))],
          { type: "image/png" }
        );
        setDownloadUrl(URL.createObjectURL(blob));
      } catch (error) {
        setErrorMessage("Error procesando imagen");
        setProcessedImage(null);
        setLoading(false);
        console.error("No se ha podido procesar la imagen: " + error);
      }
    };

    if (uploadedImage) {
      await processImage(uploadedImage);
    } else if (activeMode === "modoMapa") {
      if (mapInitialized && mapRef.current) {
        // Esperar hasta que el mapa esté completamente inicializado antes de interactuar con él
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

          const dataURL = mapCanvas.toDataURL();
          setSelectedImage(dataURL);

          mapCanvas.toBlob(async function (blob) {
            await processImage(blob);
          });
        });

        if (mapRef) mapRef.current.renderSync();
      } else {
        console.error("El mapa aún no está inicializado.");
        setLoading(false);
      }
    } else {
      if (polygon) await processImage(polygon);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.insideContent}>
          <div className={`${styles.contentDiv} ${styles.options}`}>
            <select
              value={selectedMethod}
              onChange={(e) => {
                setSelectedMethod(e.target.value);
                setNumOlivosDetectados(null);
                setProcessedImage(null);
                setDownloadUrl(null);
              }}
              className={styles.noPaddingSelect}
            >
              <option value="1">Método Fácil (Algoritmo HSV y LBP)</option>
              <option value="2">
                Método Medio (CLAHE y Clustering K-means)
              </option>
              <option value="3">
                Método Avanzado (HSI y K-means, Refinada con Componentes
                Conexas)
              </option>
              <option value="4">Método PRO (META AI)</option>
            </select>

            <div
              className="d-flex"
              style={{ marginTop: "10px", marginBottom: "10px" }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={exportMapImage}
                style={{ marginRight: "5px" }}
              >
                Procesar Imagen
              </Button>
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download="processed_image.png"
                  style={{ textDecoration: "none" }}
                >
                  <Button variant="contained" color="secondary">
                    Descargar Imagen Procesada
                  </Button>
                </a>
              )}
            </div>

            <div className={styles.flexColumna}>
              <FormControlLabel
                control={
                  <Switch
                    checked={activeMode === "modoFinca"}
                    onChange={() => handleModeChange("modoFinca")}
                  />
                }
                label="Detectar en Finca"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={activeMode === "modoMapa"}
                    onChange={() => handleModeChange("modoMapa")}
                  />
                }
                label="Mapa"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={activeMode === "modoImagen"}
                    onChange={() => handleModeChange("modoImagen")}
                  />
                }
                label="Imagen"
              />

              {activeMode === "modoImagen" && (
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
              {uploadedImage ? (
                <>
                  {
                    <img
                      src={URL.createObjectURL(uploadedImage)}
                      alt="Selected"
                      style={{ width: "100%", height: "100%" }}
                    />
                  }
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
                  fillFinca={false}
                  fincas={activeMode === "modoFinca" ? fincas : null}
                  setPolygon={handlePolygon}
                />
              )}
            </div>

            <div className={styles.imagesDiv}>
              <h3>
                Imagen procesada
                {numOlivosDetectados && (
                  <span> ({numOlivosDetectados} olivos detectados)</span>
                )}
              </h3>

              {loading ? (
                <div className="d-flex justify-content-center align-items-center h-100 w-100 border">
                  <h1>{"Cargando"}</h1>
                </div>
              ) : processedImage ? (
                <>
                  <img
                    className="h-100 w-100"
                    src={`data:image/png;base64,${processedImage}`}
                    alt="Processed"
                  />
                </>
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
