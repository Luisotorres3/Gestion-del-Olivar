import React, { useState } from "react";
import styles from "./Login.module.css";
import Register from "./Register";
import Login from "./Login";

const Account = () => {
  //Variables
  const [error, setError] = useState(null);

  const [loginMode, setLoginMode] = useState(true);

  const handleClick = (event) => {
    event.preventDefault(); // Evita el comportamiento predeterminado del enlace
    setLoginMode(!loginMode);
  };

  return (
    <div className={styles.loginForm}>
      <div className={styles.loginFormRectangle}>
        <div className={styles.loginLogo}>
          <h2>{loginMode == true ? "Iniciar Sesión" : "Crear cuenta"}</h2>
          <img src={require("../../../Images/UGR.png")}></img>
        </div>
        <div className={styles.floatingForm}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {loginMode ? <Login /> : <Register />}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0 10px",
              }}
            >
              {loginMode ? (
                <>
                  <a href="" target="_blank" rel="noreferrer">
                    ¿Has olvidado tu contraseña?
                  </a>
                  <p>
                    ¿No tienes cuenta?
                    <a href="" onClick={handleClick}>
                      Regístrate
                    </a>
                  </p>
                </>
              ) : (
                <a href="" onClick={handleClick}>
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
