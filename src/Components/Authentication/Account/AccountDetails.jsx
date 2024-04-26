import React, { useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import styles from "./AccountDetails.module.css";

const AccountDetails = ({ user }) => {
  //Variables de estado del usuario
  const [name, setName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);

  //Métodos para las acciones sobre un perfil de usuario
  const handleUpdate = () => {
    setIsUpdate(true);
  };
  const handleUpdateProfile = () => {
    setIsUpdate(true);
  };
  const handleCancel = () => {
    setIsUpdate(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.title}>
          <h1>Detalles de la cuenta</h1>
        </div>
        <div className={styles.card}>
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
              disabled
            />
          </FloatingLabel>
        </div>

        <div className={styles.card}>
          <FloatingLabel id="floatingInput" label="Nombre" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Tu Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isUpdate}
            />
          </FloatingLabel>
        </div>
        {isUpdate && (
          <>
            <div className={styles.card}>
              <FloatingLabel
                id="floatingPassword"
                label="Contraseña"
                className="mb-3"
              >
                <Form.Control
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!isUpdate}
                />
              </FloatingLabel>
            </div>
            <div className={styles.card}>
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
                  disabled={!isUpdate}
                />
              </FloatingLabel>
            </div>
          </>
        )}
        <div className={styles.buttons}>
          {isUpdate ? (
            <div className={styles.buttonsEditar}>
              <Button variant="primary" onClick={handleUpdateProfile}>
                Guardar Cambios
              </Button>
              <Button variant="light" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          ) : (
            <div className={styles.buttonsEditar}>
              <Button variant="primary" onClick={handleUpdate}>
                Editar Perfil
              </Button>
            </div>
          )}
          <div className={styles.buttonsDelete}>
            <Button variant="danger">Borrar Cuenta</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
