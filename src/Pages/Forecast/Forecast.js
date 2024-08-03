import React, { useEffect, useState } from "react";
import styles from "./Forecast.module.css";
import {
  fetchDatosForecast,
  getCoordsForCity,
} from "../../Utils/Firebase/databaseFunctions";
import ForecastInfoGeneral from "../../Components/ForecastPageComponents/ForecastInfoGeneral";
import ForecastStatus from "../../Components/ForecastPageComponents/ForecastStatus";
import SecondaryDiv from "../../Components/ForecastPageComponents/SecondaryDiv";
import useFincas from "../../Hooks/useFincas";

const Forecast = () => {
  const [selectedFinca, setSelectedFinca] = useState(null);
  const { fincas, error } = useFincas();
  const [weatherSelectedFinca, setWeatherSelectedFinca] = useState(null);
  const [datosForecast, setDatosForecast] = useState(null);

  useEffect(() => {
    if (fincas && fincas.length > 0) {
      setSelectedFinca(fincas[0].data.localizacion.municipio);
    }
  }, [fincas]);

  return (
    <div className={styles.container}>
      {selectedFinca && (
        <div className={styles.content}>
          <div className={styles.insideContent}>
            <div className={`${styles.info} ${styles.main}`}>
              <div className={styles.divInterior}>
                <div className={styles.interiorWithBackground}>
                  <ForecastInfoGeneral
                    fincas={fincas}
                    selectedFinca={selectedFinca}
                    setSelectedFinca={setSelectedFinca}
                    weatherSelectedFinca={weatherSelectedFinca}
                  />
                </div>
              </div>
              <div className={styles.divInterior}>
                <div className={styles.analysisInterior}>
                  <ForecastStatus selectedFinca={selectedFinca} />
                </div>
              </div>
              <div className={styles.divAnalysis}>
                <div className={`${styles.divInterior}`}>
                  <div className={styles.analysisInterior}>
                    {/* Placeholder for future analysis */}
                  </div>
                </div>
                <div className={`${styles.divInterior}`}>
                  <div className={styles.analysisInterior}>
                    {/* Placeholder for future analysis */}
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles.info} ${styles.secondary}`}>
              <div className={styles.secondaryInsideDiv}>
                <SecondaryDiv selectedFinca={selectedFinca} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forecast;
