import React, { useEffect, useRef, useState } from "react";
import styles from "./Olivos.module.css";
import MapComp from "../../Components/Map/Map";
import axios from "axios";
import { Switch, FormControlLabel, Button } from "@mui/material";
import { getFincas } from "../../Utils/Firebase/databaseFunctions";

const Olivos = () => {
  const mapRef = useRef();
  const [showPhoto, setShowPhoto] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("1");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [numOlivosDetectados, setNumOlivosDetectados] = useState(null);
  const [fincas, setFincas] = useState(null);

  const [selectedFinca, setSelectedFinca] = useState(null);

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

    if (showPhoto && uploadedImage) {
      // Procesar imagen cargada
      await processImage(uploadedImage);
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

        // Convertir el canvas a data URL y establecerlo como imagen seleccionada
        const dataURL = mapCanvas.toDataURL();
        setSelectedImage(dataURL);

        // Convertir el canvas a Blob y procesar la imagen
        mapCanvas.toBlob(async function (blob) {
          await processImage(blob);
        });
      });

      mapRef.current.renderSync();
    }
  };

  function exportPolygonMap(map, polygon) {
    if (!polygon) {
      console.error("No polygon selected.");
      return;
    }
    const imgData = null;

    // Fit the view to the polygon's extent
    const extent = polygon.getExtent();
    map.getView().fit(extent, { size: map.getSize(), maxZoom: 19 });

    // Once the view is fitted, we need to wait until the map renders the new view
    setTimeout(() => {
      // Create a canvas to draw the map onto
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Calculate the size of the canvas based on the polygon's extent
      const resolution = map.getView().getResolution();
      const width = Math.round((extent[2] - extent[0]) / resolution);
      const height = Math.round((extent[3] - extent[1]) / resolution);
      canvas.width = width;
      canvas.height = height;

      // Get the map's canvas
      const mapCanvas = map.getViewport().querySelector("canvas");
      if (!mapCanvas) {
        console.error("No map canvas found.");
        return;
      }

      // Draw the map onto our canvas
      context.drawImage(
        mapCanvas,
        (extent[0] - map.getView().getCenter()[0]) / resolution +
          mapCanvas.width / 2,
        (map.getView().getCenter()[1] - extent[3]) / resolution +
          mapCanvas.height / 2,
        width,
        height,
        0,
        0,
        width,
        height
      );

      // Normalize the polygon coordinates to the canvas dimensions
      const coordinates = polygon.getCoordinates()[0].map((coord) => {
        const x =
          ((coord[0] - extent[0]) / (extent[2] - extent[0])) * canvas.width;
        const y =
          ((extent[3] - coord[1]) / (extent[3] - extent[1])) * canvas.height;
        return [x, y];
      });

      // Clear the area outside the polygon
      context.save();

      // Draw the inverse polygon
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(canvas.width, 0);
      context.lineTo(canvas.width, canvas.height);
      context.lineTo(0, canvas.height);
      context.closePath();

      // Draw the polygon on top of the full canvas
      context.moveTo(coordinates[0][0], coordinates[0][1]);
      for (let i = 1; i < coordinates.length; i++) {
        context.lineTo(coordinates[i][0], coordinates[i][1]);
      }
      context.closePath();

      // Clear the area outside the polygon
      context.fillStyle = "white"; // Set to the color you want for the outside
      context.fill();
      context.restore();

      // Draw the polygon border again if needed
      context.beginPath();
      context.moveTo(coordinates[0][0], coordinates[0][1]);
      for (let i = 1; i < coordinates.length; i++) {
        context.lineTo(coordinates[i][0], coordinates[i][1]);
      }
      context.closePath();
      context.strokeStyle = "blue";
      context.lineWidth = 2;
      context.stroke();

      // Export the canvas as an image
      imgData = canvas.toDataURL("image/png");
    }, 1000); // Delay to ensure the map view has finished rendering

    return imgData;
  }

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
              className={styles.noPaddingSelect} // Aplica la clase CSS
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
                style={{ marginRight: "5px" }} // Ajuste correcto de estilo
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
                  fillFinca={false}
                  fincas={fincas}
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
