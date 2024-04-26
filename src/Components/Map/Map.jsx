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
import { fromLonLat } from "ol/proj";
import { Fill, Icon, Stroke, Style } from "ol/style";
import pushpinIcon from "../../Images/Icons/pushpin.png";
import { FullScreen, defaults as defaultControls } from "ol/control.js";

const MapComp = forwardRef((props, ref) => {
  const { width, height, target, zoom, markerCoords, controls, showFincas } =
    props;
  const mapRef = useRef();
  const [mapLocation, setMapLocation] = useState([-416653.71, 4588115.81]);

  useEffect(() => {
    // Crear una capa de dibujo para los rectángulos
    const rectangleLayer = new VectorLayer({
      source: new VectorSource(),
    });

    // Definir el estilo del rectángulo
    const rectangleStyle = new Style({
      stroke: new Stroke({
        color: "red",
        width: 2,
      }),
      fill: new Fill({
        color: "rgba(255, 0, 0, 0.2)",
      }),
    });

    // Coordenadas del rectángulo centrado en Ubeda
    const rectangleCoords = [
      [mapLocation[0] - 100, mapLocation[1] - 100],
      [mapLocation[0] - 100, mapLocation[1] + 100],
      [mapLocation[0] + 100, mapLocation[1] + 100],
      [mapLocation[0] + 100, mapLocation[1] - 100],
      [mapLocation[0] - 100, mapLocation[1] - 100],
    ];

    // Crear la geometría del rectángulo
    const rectangleFeature = new Feature(new Polygon([rectangleCoords]));

    if (showFincas) {
      // Añadir el rectángulo a la capa con el estilo definido
      rectangleFeature.setStyle(rectangleStyle);
      rectangleLayer.getSource().addFeature(rectangleFeature);
    }

    // Crear una capa de marcadores
    const markerLayer = new VectorLayer({
      source: new VectorSource(),
    });

    // Definir el estilo del marcador como una chincheta
    const pinStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: "https://static.vecteezy.com/system/resources/thumbnails/011/421/138/small_2x/glossy-red-push-pin-png.png", // Aquí debes especificar la URL del icono de la chincheta
        scale: 0.05, // Escala del icono
      }),
    });

    if (markerCoords) {
      // Añadir los marcadores a la capa con el estilo de chincheta
      markerCoords.forEach((coord) => {
        const point = new Point(fromLonLat(coord));
        const marker = new Feature({
          geometry: point,
        });
        marker.setStyle(pinStyle);
        markerLayer.getSource().addFeature(marker);
      });
    }

    // Configurar el mapa de Bing Maps
    if (controls) {
      mapRef.current = new Map({
        controls: defaultControls().extend([new FullScreen()]),
        target: target || "map",
        layers: [
          new TileLayer({
            source: new BingMaps({
              key: "AjTZltKJNAFnrogNQ6CU-n90SLSLW0Y_HYbHotW3_awnrsAa5VmGJhdICmiaJNmf",
              imagerySet: "Aerial",
            }),
          }),
          markerLayer, // Añadir la capa de marcadores al mapa
          rectangleLayer,
        ],
        view: new View({
          center: mapLocation,
          zoom: zoom,
          maxZoom: 19,
        }),
      });
    } else {
      mapRef.current = new Map({
        controls: [],
        target: target || "map",
        layers: [
          new TileLayer({
            source: new BingMaps({
              key: "AjTZltKJNAFnrogNQ6CU-n90SLSLW0Y_HYbHotW3_awnrsAa5VmGJhdICmiaJNmf",
              imagerySet: "Aerial",
            }),
          }),
          markerLayer, // Añadir la capa de marcadores al mapa
        ],
        view: new View({
          center: mapLocation,
          zoom: zoom,
          minZoom: zoom,
          maxZoom: 19,
        }),
      });
    }

    return () => {
      // Limpieza al desmontar el componente
      if (mapRef.current) {
        mapRef.current.setTarget(null);
      }
    };
  }, [mapLocation, target]);

  // Pasa la referencia a través de props
  useEffect(() => {
    if (ref) {
      ref.current = mapRef.current;
    }
  }, [ref]);

  document.querySelectorAll("canvas").forEach((canvas, index) => {
    canvas.id = "canvasId";
  });

  const elements = document.getElementsByClassName("ol-viewport");

  // Iterar sobre cada elemento y aplicar estilos
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    element.style.borderRadius = "8px";
  }

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
