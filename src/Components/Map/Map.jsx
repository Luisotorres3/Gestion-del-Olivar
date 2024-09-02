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
    return;
  }

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
    const imgData = canvas.toDataURL("image/png");
  }, 1000); // Delay to ensure the map view has finished rendering
}

const crearPol = (map, vectorLayer) => {
  if (!vectorLayer) {
    console.error("No hay capa vectorial disponible.");
    return;
  }

  const vectorSource = vectorLayer.getSource();
  if (!vectorSource) {
    console.error("No hay fuente vectorial disponible.");
    return;
  }

  const features = vectorSource.getFeatures();
  if (features.length === 0) {
    console.error("No hay características en la capa vectorial.");
    return;
  }

  // Crear un canvas
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // Obtener la geometría del primer polígono dibujado
  const polygon = features[0].getGeometry();
  const extent = polygon.getExtent();

  // Configurar el tamaño del canvas basado en la extensión del polígono
  const width = extent[2] - extent[0];
  const height = extent[3] - extent[1];
  canvas.width = width;
  canvas.height = height;

  // Dibujar el contenido del mapa en el canvas
  const mapCanvas = map.getViewport().querySelector("canvas");
  const mapContext = mapCanvas.getContext("2d");

  // Escalar y traducir el contexto para ajustarlo al polígono
  context.scale(
    canvas.width / mapCanvas.width,
    canvas.height / mapCanvas.height
  );
  context.translate(-extent[0], -extent[1]);

  // Dibujar el mapa en el canvas
  context.drawImage(mapCanvas, 0, 0, mapCanvas.width, mapCanvas.height);

  // Volver a la escala original
  context.setTransform(1, 0, 0, 1, 0, 0);

  // Obtener las coordenadas del polígono y normalizarlas
  const coordinates = polygon.getCoordinates()[0].map((coord) => {
    const x = (coord[0] - extent[0]) * (canvas.width / width);
    const y = (extent[3] - coord[1]) * (canvas.height / height);
    return [x, y];
  });

  // Dibujar el polígono en el canvas de mapa
  context.beginPath();
  context.moveTo(coordinates[0][0], coordinates[0][1]);

  for (let i = 1; i < coordinates.length; i++) {
    context.lineTo(coordinates[i][0], coordinates[i][1]);
  }

  context.closePath();
  context.fillStyle = "rgba(0, 0, 255, 0.2)";
  context.strokeStyle = "blue";
  context.lineWidth = 2;
  context.fill();
  context.stroke();

  // Exportar el canvas como imagen
  const imgData = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = imgData;
  link.download = "map_polygon.png";
  link.click();
};

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
    setSelectedFinca,
  } = props;

  const mapRef = useRef();
  const [vectorSource, setVectorSource] = useState(null);
  const [drawInteraction, setDrawInteraction] = useState(null);
  const [vectorLayer, setVectorLayer] = useState(null);
  const [polygon, setPolygon] = useState(false);

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
    /*
    mapRef.current.on("loadstart", function () {
      mapRef.current.getTargetElement().classList.add("spinner");
    });
    mapRef.current.on("loadend", function () {
      mapRef.current.getTargetElement().classList.remove("spinner");
    });
    */

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
            setPolygon(polygon);

            // Ahora puedes usar `polygon` como necesites, por ejemplo, para calcular el centroide
            const centroid = polygon.getInteriorPoint().getCoordinates();
            flyTo(centroid, function () {}, mapRef.current.getView());
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
  }, [ref]);

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
