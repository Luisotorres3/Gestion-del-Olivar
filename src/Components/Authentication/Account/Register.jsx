import React, { useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import styles from "./Login.module.css";
import { handleRegister, registerUser } from "../Auth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  //const [imagen, setImagen] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false); // Estado para controlar el proceso de registro
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    validatePassword();
    if (error != null && error != true) {
      registerUser(name, email, password);
    }
  };

  const validatePassword = () => {
    var password = document.getElementById("password"),
      confirm_password = document.getElementById("confirmPassword");
    if (password.value != confirm_password.value) {
      confirm_password.setCustomValidity("Las contraseñas no coinciden");
      setError(true);
    } else {
      confirm_password.setCustomValidity("");
      setError(false);
    }
    password.onchange = validatePassword;
    confirm_password.onkeyup = validatePassword;
  };

  return (
    <Form className={styles.formulario} onSubmit={handleSignIn}>
      {/*
      <FloatingLabel
        id="floatingImage"
        label="Imagen de Perfil"
        className="mb-3"
      >
        <Form.Control
          type="file"
          placeholder="Imagen de Perfil"
          accept="image/*"
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            setImagen(selectedFile);
            console.log(selectedFile);
          }}
          required
        />
      </FloatingLabel>
      */}

      <FloatingLabel id="floatingInput" label="Nombre" className="mb-3">
        <Form.Control
          type="text"
          placeholder="Tu Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </FloatingLabel>

      <FloatingLabel
        id="floatingInput"
        label="Correo Electrónico"
        className="mb-3"
      >
        <Form.Control
          type="email"
          placeholder="email@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </FloatingLabel>

      <FloatingLabel id="floatingPassword" label="Contraseña" className="mb-3">
        <Form.Control
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </FloatingLabel>

      <FloatingLabel
        id="floatingConfirmPassword"
        label="Repite la contraseña"
        className="mb-3"
      >
        <Form.Control
          id="confirmPassword"
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </FloatingLabel>

      <div className={`${styles.buttons} ${"mb-3"}`}>
        <Button type="submit" disabled={registering}>
          {registering ? "Registrando..." : "Crear cuenta"}
        </Button>
      </div>
    </Form>
  );
};

export default Register;
