import { React, useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import styles from "./Login.module.css";
import {
  doSendEmailVerification,
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../Auth";

const Login = () => {
  //Variables necesarias para iniciar sesión
  const [email, setEmail] = useState(""); // Estado para el correo electrónico
  const [password, setPassword] = useState(""); // Estado para la contraseña
  const [error, setError] = useState(null);

  //Método para iniciar sesión con email y contraseña
  const handleSignIn = (e) => {
    e.preventDefault();
    // Pasamos los valores de email y password al método de inicio de sesión
    doSignInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        //doSendEmailVerification();
        console.log(userCredential);
      })
      .catch((e) => {
        setError(e); // Almacenar el mensaje de error
      });
  };

  //Método para iniciar sesión con Google
  const handleSignInWithGoogle = (e) => {
    e.preventDefault();
    doSignInWithGoogle()
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((e) => {
        setError(e); // Almacenar el mensaje de error
      });
  };

  return (
    <Form className={styles.formulario} onSubmit={handleSignIn}>
      <FloatingLabel
        controlId="floatingInput"
        label="Correo Electrónico"
        className="mb-3"
      >
        <Form.Control
          type="email"
          placeholder="email@mail.com"
          value={email} // Valor del estado del correo electrónico
          onChange={(e) => setEmail(e.target.value)} // Actualizar el estado del correo electrónico
          required
        />
      </FloatingLabel>
      <FloatingLabel
        controlId="floatingPassword"
        label="Contraseña"
        className="mb-3"
      >
        <Form.Control
          type="password"
          placeholder="Password"
          value={password} // Valor del estado de la contraseña
          onChange={(e) => setPassword(e.target.value)} // Actualizar el estado de la contraseña
          required
        />
      </FloatingLabel>
      <div className={`${styles.buttons} ${"mb-3"}`}>
        <button type="submit">Iniciar Sesión</button>
        <button onClick={handleSignInWithGoogle}>
          <i className="fa fa-google" aria-hidden="true"></i>
        </button>
      </div>
    </Form>
  );
};

export default Login;
