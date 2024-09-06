import React, { useEffect, useRef, forwardRef, useState } from "react";
import "ol/ol.css";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import BingMaps from "ol/source/BingMaps";
import Map from "ol/Map";
import Feature from "ol/Feature";
import { Point, Polygon } from "ol/geom";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { fromLonLat, toLonLat, transform } from "ol/proj";
import { Fill, Icon, Stroke, Style } from "ol/style";
import Overlay from "ol/Overlay";
import { FullScreen, defaults as defaultControls } from "ol/control";
import { Draw } from "ol/interaction";
import { getCenter } from "ol/extent";
import styles from "./Map.module.css";
import { Tooltip } from "bootstrap";

function exportPolygonMap(map, polygon) {
  if (!polygon) {
    console.error("No polygon selected.");
    return Promise.reject("No polygon selected.");
  }

  return new Promise((resolve, reject) => {
    // Ajustar la vista al área del polígono
    const extent = polygon.getExtent();
    map.getView().fit(extent, { size: map.getSize(), maxZoom: 19 });

    setTimeout(() => {
      try {
        // Obtener el tamaño del canvas del mapa
        const mapCanvas = map.getViewport().querySelector("canvas");
        if (!mapCanvas) {
          console.error("No map canvas found.");
          return reject("No map canvas found.");
        }

        // Crear un nuevo canvas del mismo tamaño que el mapa visible
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const mapSize = map.getSize();
        canvas.width = mapSize[0];
        canvas.height = mapSize[1];

        // Dibujar la imagen completa del mapa en el nuevo canvas
        context.drawImage(mapCanvas, 0, 0);

        // Obtener las coordenadas del polígono (sin normalizar)
        const coordinates = polygon.getCoordinates()[0];

        // Normalizar las coordenadas del polígono con respecto al nuevo canvas
        const normalizedCoords = coordinates.map((coord) => {
          const pixel = map.getPixelFromCoordinate(coord);
          return [pixel[0], pixel[1]]; // Devuelve las coordenadas de píxeles en el canvas
        });

        // Crear la máscara de recorte usando las coordenadas del polígono
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.beginPath();

        normalizedCoords.forEach((coord, index) => {
          if (index === 0) {
            context.moveTo(coord[0], coord[1]);
          } else {
            context.lineTo(coord[0], coord[1]);
          }
        });
        context.closePath();

        // Aplicar el recorte para que solo el área dentro del polígono sea visible
        context.clip();

        // Redibujar la imagen dentro del área del polígono
        context.drawImage(mapCanvas, 0, 0);

        context.restore();

        // Exportar el canvas como imagen en base64 sin el prefijo
        const imgData = canvas.toDataURL();
        canvas.toBlob(async function (blob) {
          resolve(blob);
        });
      } catch (error) {
        reject(error);
      }
    }, 1000); // Esperar a que el mapa se renderice completamente
  });
}

function flyTo(location, done, view) {
  const duration = 4000;
  const zoom = 15;
  let parts = 2;
  let called = false;
  function callback(complete) {
    --parts;
    if (called) {
      return;
    }
    if (parts === 0 || !complete) {
      called = true;
      done(complete);
    }
  }
  view.animate(
    {
      center: location,
      duration: duration,
    },
    callback
  );
  view.animate(
    {
      zoom: zoom - 10,
      duration: duration / 2,
    },
    {
      zoom: zoom,
      duration: duration / 2,
    },
    callback
  );
}

const MapComp = forwardRef((props, ref) => {
  const {
    width,
    height,
    target,
    zoom,
    markerCoords,
    controls,
    showFincas = true,
    fincas,
    currentCoords,
    editMode = false,
    onPolygonDrawn,
    fillFinca = true,
    setPolygon,
  } = props;

  const mapRef = useRef();
  const [vectorSource, setVectorSource] = useState(null);
  const [drawInteraction, setDrawInteraction] = useState(null);
  const [vectorLayer, setVectorLayer] = useState(null);

  const [polygonUsed, setPolygonUsed] = useState(null);

  const handlePolygon = (polygon) => {
    exportPolygonMap(mapRef.current, polygon)
      .then((imgData) => {
        setPolygon(imgData); // Guardar la imagen procesada
      })
      .catch((error) => {
        console.error("Error al exportar el polígono:", error);
      });
  };

  useEffect(() => {
    let coordinates = [-416653.71, 4588115.81];
    if (currentCoords) {
      coordinates = fromLonLat([currentCoords[1], currentCoords[0]]);
    } else {
      if (fincas && fincas.length > 0) {
        const firstFinca = fincas[0];
        if (firstFinca.data.coordenadasFinca) {
          // Convertir coordenadasFinca en un array de coordenadas
          const coordenadasArray = JSON.parse(firstFinca.data.coordenadasFinca);

          // Crear un polígono con las coordenadas
          const polygon = new Polygon([coordenadasArray]);
          const extent = polygon.getExtent();
          coordinates = getCenter(extent); // Obtener el centro del polígono
        } else {
          // Si no hay coordenadasFinca, usa las coordenadas de localizacion
          coordinates = fromLonLat([
            firstFinca.data.localizacion.longitud,
            firstFinca.data.localizacion.latitud,
          ]);
        }
      }
    }

    const fullScreenControl = new FullScreen({ tipLabel: "Pantalla Completa" });
    const map = new Map({
      controls: controls ? defaultControls().extend([fullScreenControl]) : [],
      target: target || "map",
      layers: [
        new TileLayer({
          source: new BingMaps({
            key: "AjTZltKJNAFnrogNQ6CU-n90SLSLW0Y_HYbHotW3_awnrsAa5VmGJhdICmiaJNmf",
            imagerySet: "Aerial",
          }),
        }),
      ],
      view: new View({
        center: coordinates,
        zoom: zoom,
        maxZoom: 19,
      }),
    });

    mapRef.current = map;

    fullScreenControl.on("enterfullscreen", () => {
      const tooltipElements = document.querySelectorAll(".ol-full-screen-true");
      tooltipElements.forEach((el) => {
        const tooltip = Tooltip.getInstance(el);
        if (tooltip) {
          tooltip.setContent({
            ".tooltip-inner": "Salir de pantalla completa",
          });
          el.addEventListener("mouseleave", () => {
            tooltip.hide();
          });
        }
      });
    });

    fullScreenControl.on("leavefullscreen", () => {
      const tooltipElements = document.querySelectorAll(
        ".ol-full-screen-false"
      );
      tooltipElements.forEach((el) => {
        const tooltip = Tooltip.getInstance(el);
        if (tooltip) {
          tooltip.setContent({ ".tooltip-inner": "Pantalla Completa" });
          el.removeEventListener("mouseleave", () => {
            tooltip.hide();
          });
        }
      });
    });

    if (controls) {
      document
        .querySelectorAll(
          ".ol-zoom-in, .ol-zoom-out, .ol-rotate-reset, .ol-full-screen-false,.ol-full-screen-true"
        )
        .forEach(function (el) {
          new Tooltip(el);
        });

      if (fincas && fincas.length > 0) {
        const select = document.createElement("select");

        const optionElements = fincas.map((finca) => {
          const option = document.createElement("option");
          option.text = finca.data.localizacion.municipio;
          option.value = JSON.stringify(finca.data);
          return option;
        });

        optionElements.forEach((option) => select.add(option));

        select.className = styles.selectStyle;

        mapRef.current.getViewport().appendChild(select);

        select.addEventListener("change", function (event) {
          const selectedOption = event.target.value;
          const selectedFinca = JSON.parse(selectedOption);

          const coordinates = JSON.parse(selectedFinca.coordenadasFinca);
          if (coordinates) {
            const polygon = new Polygon([coordinates]);

            // Ahora puedes usar `polygon` como necesites, por ejemplo, para calcular el centroide
            const centroid = polygon.getInteriorPoint().getCoordinates();

            flyTo(centroid, function () {}, mapRef.current.getView());
            if (setPolygon) handlePolygon(polygon);
          }
        });
      }
    }

    if (editMode) {
      const vectorSource = new VectorSource();
      setVectorSource(vectorSource);

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          stroke: new Stroke({
            color: "blue",
            width: 2,
          }),
          fill: new Fill({
            color: "rgba(0, 0, 255, 0.2)",
          }),
        }),
      });

      map.addLayer(vectorLayer);
      setVectorLayer(vectorLayer);

      const draw = new Draw({
        source: vectorSource,
        type: "Polygon",
      });

      draw.on("drawend", (event) => {
        const feature = event.feature;
        const coordinates = feature.getGeometry().getCoordinates();
        if (onPolygonDrawn) {
          onPolygonDrawn(coordinates);
        }
        map.removeInteraction(draw);
        setDrawInteraction(null);
      });

      setDrawInteraction(draw);
      map.addInteraction(draw);
    }

    if (fincas && fincas.length > 0) {
      const firstFinca = fincas[0];
      if (firstFinca.data.coordenadasFinca) {
        // Convertir coordenadasFinca en un array de coordenadas
        const coordenadasArray = JSON.parse(firstFinca.data.coordenadasFinca);

        // Crear un polígono con las coordenadas
        const polygon = new Polygon([coordenadasArray]);
        const extent = polygon.getExtent();
        coordinates = getCenter(extent); // Obtener el centro del polígono
        setPolygonUsed(polygon);
        if (setPolygon) handlePolygon(polygonUsed);
      } else {
        // Si no hay coordenadasFinca, usa las coordenadas de localizacion
        coordinates = fromLonLat([
          firstFinca.data.localizacion.longitud,
          firstFinca.data.localizacion.latitud,
        ]);
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(null);
      }
    };
  }, [target, zoom, controls, editMode, fincas, currentCoords]);

  useEffect(() => {
    if (
      mapRef.current &&
      showFincas &&
      Array.isArray(fincas) &&
      fincas.length > 0
    ) {
      const vectorSource = new VectorSource();
      setVectorSource(vectorSource);
      const overlay = new Overlay({
        element: null,
        positioning: "center-center",
        autoPan: true,
        autoPanAnimation: {
          duration: 250,
        },
      });

      mapRef.current.addOverlay(overlay);

      const features = [];
      fincas.forEach((finca) => {
        if (
          finca.data &&
          finca.data.coordenadasFinca &&
          finca.data.coordenadasFinca.length > 0
        ) {
          // Usar coordenadas directamente
          const coords = finca.data.coordenadasFinca;
          const coordenadasArray = JSON.parse(coords);
          const polygonFeature = new Feature({
            geometry: new Polygon([coordenadasArray]),
            fincaName: "Finca",
          });
          features.push(polygonFeature);
        }
      });
      let rectangleLayer;
      if (fillFinca) {
        rectangleLayer = new VectorLayer({
          source: new VectorSource({
            features: features,
          }),
          style: new Style({
            stroke: new Stroke({
              color: "red",
              width: 2,
            }),
            fill: new Fill({
              color: "rgba(255, 0, 0, 0.5)",
            }),
          }),
        });
      } else {
        rectangleLayer = new VectorLayer({
          source: new VectorSource({
            features: features,
          }),
          style: new Style({
            stroke: new Stroke({
              color: "red",
              width: 2,
            }),
          }),
        });
      }

      mapRef.current.addLayer(rectangleLayer);

      mapRef.current.on("click", function (evt) {
        const container = document.createElement("div");
        const content = document.createElement("div");
        container.className = styles.olPopup2;
        container.appendChild(content);

        overlay.setElement(container);
        const feature = mapRef.current.forEachFeatureAtPixel(
          evt.pixel,
          function (feature) {
            return feature;
          }
        );
        if (feature) {
          content.innerHTML = feature.get("fincaName");
          const geometry = feature.getGeometry();

          if (geometry instanceof Polygon) {
            const extent = geometry.getExtent();
            const center = getCenter(extent);
            overlay.setPosition(center);
          } else {
            overlay.setPosition(evt.coordinate);
          }
        } else {
          overlay.setPosition(undefined);
        }
      });
    }
  }, [showFincas, fincas]);

  useEffect(() => {
    if (
      mapRef.current &&
      Array.isArray(markerCoords) &&
      markerCoords.length > 0
    ) {
      const overlay = new Overlay({
        element: null,
        positioning: "center-center",
        autoPan: {
          animation: {
            duration: 250,
          },
        },
      });

      mapRef.current.addOverlay(overlay);

      const features = [];
      markerCoords.forEach((coord) => {
        const [lat, lon] = coord.coordenadas;
        const point = new Point(fromLonLat([lon, lat]));
        const marker = new Feature({
          geometry: point,
          municipio: coord.municipio,
        });
        features.push(marker);
      });

      const markerLayer = new VectorLayer({
        source: new VectorSource({
          features: features,
        }),
        style: new Style({
          image: new Icon({
            anchor: [0.5, 1],
            anchorXUnits: "fraction",
            anchorYUnits: "fraction",
            src: "https://static.vecteezy.com/system/resources/thumbnails/011/421/138/small_2x/glossy-red-push-pin-png.png",
            scale: 0.05,
          }),
        }),
      });

      mapRef.current.addLayer(markerLayer);
      mapRef.current.getView().setMinZoom(5);
      mapRef.current.getView().setCenter(fromLonLat([-3.703582, 40.416705]));

      mapRef.current.on("pointermove", function (evt) {
        const content = document.createElement("div");
        const container = document.createElement("div");
        container.className = styles.olPopup;
        container.appendChild(content);
        container.onmouseleave = function () {
          overlay.setPosition(undefined);
          return false;
        };
        overlay.setElement(container);
        const feature = mapRef.current.forEachFeatureAtPixel(
          evt.pixel,
          function (feature) {
            return feature;
          }
        );
        function toTitleCase(str) {
          return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
        }

        if (feature) {
          const coordinates = feature.getGeometry().getCoordinates();
          content.innerHTML = toTitleCase(feature.get("municipio"));
          overlay.setPosition(coordinates);
        } else {
          overlay.setPosition(undefined);
        }
      });
    }
  }, [markerCoords]);

  useEffect(() => {
    if (ref) {
      ref.current = mapRef.current;
    }
  }, [ref, setPolygon]);

  return (
    <div
      ref={mapRef}
      id={target}
      style={{
        width: width,
        height: height,
      }}
    ></div>
  );
});

export default MapComp;
