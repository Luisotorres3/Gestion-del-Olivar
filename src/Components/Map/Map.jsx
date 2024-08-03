import React, { useEffect, useRef, forwardRef, useState } from "react";
import "ol/ol.css";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import BingMaps from "ol/source/BingMaps";
import Map from "ol/Map";
import Feature from "ol/Feature.js";
import { Point, Polygon } from "ol/geom.js";
import { Vector as VectorLayer } from "ol/layer.js";
import { Vector as VectorSource } from "ol/source.js";
import { fromLonLat, toLonLat } from "ol/proj";
import { Fill, Icon, Stroke, Style } from "ol/style";
import Overlay from "ol/Overlay";
import { FullScreen, defaults as defaultControls } from "ol/control.js";
import { Tooltip } from "bootstrap";
import styles from "./Map.module.css";
import { toStringHDMS } from "ol/coordinate";
import { getCenter } from "ol/extent";

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
    showFincas,
    fincas,
  } = props;
  const mapRef = useRef();

  useEffect(() => {
    let coordinates = [-416653.71, 4588115.81];
    if (fincas && fincas.length > 0) {
      coordinates = fromLonLat([
        fincas[0].data.localizacion.longitud,
        fincas[0].data.localizacion.latitud,
      ]);
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

    mapRef.current.on("loadstart", function () {
      mapRef.current.getTargetElement().classList.add("spinner");
    });
    mapRef.current.on("loadend", function () {
      mapRef.current.getTargetElement().classList.remove("spinner");
    });

    fullScreenControl.on("enterfullscreen", () => {
      // Cambiar el contenido del tooltip cuando se entra en pantalla completa
      const tooltipElements = document.querySelectorAll(".ol-full-screen-true");
      tooltipElements.forEach((el) => {
        const tooltip = Tooltip.getInstance(el);
        if (tooltip) {
          tooltip.setContent({
            ".tooltip-inner": "Salir de pantalla completa",
          });
          // Agregar evento para ocultar el tooltip cuando el cursor sale del botón
          el.addEventListener("mouseleave", () => {
            tooltip.hide();
          });
        }
      });
    });

    fullScreenControl.on("leavefullscreen", () => {
      // Restaurar el contenido original del tooltip cuando se sale de pantalla completa
      const tooltipElements = document.querySelectorAll(
        ".ol-full-screen-false"
      );
      tooltipElements.forEach((el) => {
        const tooltip = Tooltip.getInstance(el);
        if (tooltip) {
          tooltip.setContent({ ".tooltip-inner": "Pantalla Completa" });
          // Eliminar el evento 'mouseleave' para evitar que se oculte el tooltip cuando el cursor sale del botón
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
        //Añadir Selector de Fincas
        // Crear el elemento select
        const select = document.createElement("select");

        // Crear un array de elementos option usando map
        const optionElements = fincas.map((finca) => {
          const option = document.createElement("option");
          option.text = finca.data.localizacion.municipio;
          option.value = JSON.stringify(finca.data);
          return option;
        });

        // Agregar los elementos option al select
        optionElements.forEach((option) => select.add(option));

        // Establecer estilos para el select
        select.className = styles.selectStyle;

        // Añadir el select al contenedor del mapa
        mapRef.current.getViewport().appendChild(select);

        // Agregar evento de cambio al select
        select.addEventListener("change", function (event) {
          const selectedOption = event.target.value; // Obtener el valor de la opción seleccionada
          // Obtener las coordenadas correspondientes a la opción seleccionada
          const selectedFinca = JSON.parse(selectedOption);

          const coordinates = fromLonLat([
            selectedFinca.localizacion.longitud,
            selectedFinca.localizacion.latitud,
          ]);
          console.log(coordinates);
          // Animar la vista del mapa hacia las coordenadas
          if (coordinates) {
            flyTo(coordinates, function () {}, mapRef.current.getView());
          }
        });
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(null);
      }
    };
  }, [target, zoom, controls]);

  useEffect(() => {
    if (mapRef.current && showFincas && fincas.length > 0) {
      const overlay = new Overlay({
        element: null, // El elemento se establecerá dinámicamente
        positioning: "center-center", // Posicionamiento del popup
        autoPan: true, // Permitir el auto-ajuste del popup
        autoPanAnimation: {
          duration: 250, // Duración de la animación de auto-ajuste
        },
      });

      mapRef.current.addOverlay(overlay);
      // Obtener el centro de la localización

      const features = [];
      fincas.forEach((finca) => {
        if (
          finca.data.localizacion.longitud !== undefined &&
          finca.data.localizacion.latitud !== undefined
        ) {
          const center = fromLonLat([
            finca.data.localizacion.longitud,
            finca.data.localizacion.latitud,
          ]);

          // Calcular el ancho y el largo del rectángulo a partir del área
          const area = parseFloat(
            finca.data.superficieConstruida.replace(/[^\d.-]/g, "")
          ); // Convertir la superficie a un número
          const ancho = Math.sqrt(area); // Calcular la raíz cuadrada del área para obtener el ancho
          const largo = ancho; // Calcular el largo dividiendo el área por el ancho

          // Calcular los vértices del rectángulo
          const v1 = [center[0] - ancho / 2, center[1] - largo / 2]; // Esquina superior izquierda
          const v2 = [center[0] - ancho / 2, center[1] + largo / 2]; // Esquina inferior izquierda
          const v3 = [center[0] + ancho / 2, center[1] + largo / 2]; // Esquina inferior derecha
          const v4 = [center[0] + ancho / 2, center[1] - largo / 2]; // Esquina superior derecha

          const rectangleCoords = [v1, v2, v3, v4, v1];
          const rectangleFeature = new Feature({
            geometry: new Polygon([rectangleCoords]),
            fincaName: "Finca",
          });
          features.push(rectangleFeature);
        }
      });

      const rectangleLayer = new VectorLayer({
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

      mapRef.current.addLayer(rectangleLayer);

      mapRef.current.on("click", function (evt) {
        const container = document.createElement("div");
        const content = document.createElement("div");
        container.className = styles.olPopup2;
        container.appendChild(content);

        // Agregar evento para ocultar el popup cuando el cursor sale del marcador

        overlay.setElement(container);
        const feature = mapRef.current.forEachFeatureAtPixel(
          evt.pixel,
          function (feature) {
            return feature;
          }
        );
        if (feature) {
          content.innerHTML = feature.get("fincaName");
          // Obtener la geometría del feature
          const geometry = feature.getGeometry();

          if (geometry instanceof Polygon) {
            // Obtener la extensión de la geometría
            const extent = geometry.getExtent();

            // Calcular el centro de la extensión
            const center = getCenter(extent);

            // Establecer la posición del overlay en el centro de la geometría
            overlay.setPosition(center);
          } else {
            // Si la geometría no es un polígono, usar la coordenada del evento
            overlay.setPosition(evt.coordinate);
          }
        } else {
          // Si no hay ningún marcador bajo el cursor, ocultar el popup
          overlay.setPosition(undefined);
        }
      });
    }
  }, [showFincas]);

  useEffect(() => {
    if (mapRef.current && markerCoords) {
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
        // Agregar evento para ocultar el popup cuando el cursor sale del marcador
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
          // Si no hay ningún marcador bajo el cursor, ocultar el popup
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
