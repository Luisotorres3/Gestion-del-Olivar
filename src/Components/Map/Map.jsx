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

const MapComp = forwardRef((props, ref) => {
  const { width, height, target, zoom, markerCoords, controls, showFincas } =
    props;
  const mapRef = useRef();

  useEffect(() => {
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
        center: [-416653.71, 4588115.81],
        zoom: zoom,
        maxZoom: 19,
      }),
    });

    mapRef.current = map;

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
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(null);
      }
    };
  }, [target, zoom, controls]);

  useEffect(() => {
    if (mapRef.current && showFincas) {
      const overlay = new Overlay({
        element: null, // El elemento se establecerá dinámicamente
        positioning: "center-center", // Posicionamiento del popup
        autoPan: true, // Permitir el auto-ajuste del popup
        autoPanAnimation: {
          duration: 250, // Duración de la animación de auto-ajuste
        },
      });

      mapRef.current.addOverlay(overlay);
      const rectangleCoords = [
        [-416753.71, 4588015.81],
        [-416753.71, 4588215.81],
        [-416553.71, 4588215.81],
        [-416553.71, 4588015.81],
        [-416753.71, 4588015.81],
      ];

      const features = [];
      const rectangleFeature = new Feature({
        geometry: new Polygon([rectangleCoords]),
        fincaName: "Finca",
      });
      features.push(rectangleFeature);

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

      mapRef.current.on("pointermove", function (evt) {
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
