import React, { useState } from "react";
import styles from "./Login.module.css";
import Register from "./Register";
import Login from "./Login";

const Account = () => {
  const [error, setError] = useState(null);
  const [loginMode, setLoginMode] = useState(true);

  const handleClick = (event) => {
    event.preventDefault(); // Evita el comportamiento predeterminado del enlace
    setLoginMode(!loginMode);
  };

  return (
    <div className={styles.accountContainer}>
      <div className={styles.formWrapper}>
        <div className={styles.logoColumn}>
          <img
            src={require("../../../Images/UGR.png")}
            alt="Logo"
            className={styles.logo}
          />
        </div>
        <div className={styles.formColumn}>
          <h2 className={styles.header}>
            {loginMode ? "Iniciar Sesión" : "Crear cuenta"}
          </h2>
          <div className={styles.floatingForm}>
            {loginMode ? <Login /> : <Register />}
            <div className={styles.formFooter}>
              {loginMode ? (
                <>
                  <a href="" className={styles.forgotPassword}>
                    ¿Has olvidado tu contraseña?
                  </a>
                  <p>
                    ¿No tienes cuenta?
                    <a
                      href=""
                      className={styles.switchModeLink}
                      onClick={handleClick}
                    >
                      Regístrate
                    </a>
                  </p>
                </>
              ) : (
                <a
                  href=""
                  className={styles.switchModeLink}
                  onClick={handleClick}
                >
                  ¿Ya tienes cuenta?
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
