import React, { useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {
  getAuth,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styles from "./AccountDetails.module.css";
import { doSignOut } from "../Auth";

const AccountDetails = ({ user }) => {
  // Variables de estado del usuario
  const [name, setName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phoneNumber || "");
  const [address, setAddress] = useState(user.address || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(user.photoURL || "");
  const [isUpdate, setIsUpdate] = useState(false);
  const navigate = useNavigate();

  // Métodos para las acciones sobre un perfil de usuario
  const handleUpdate = () => {
    setIsUpdate(true);
  };

  const handleUpdateProfile = () => {
    // Aquí iría la lógica para actualizar el perfil
    setIsUpdate(false);
  };

  const handleCancel = () => {
    setIsUpdate(false);
    // Restablecer los campos en caso de cancelación
    setName(user.displayName);
    setEmail(user.email);
    setPhone(user.phoneNumber || "");
    setAddress(user.address || "");
    setPassword("");
    setConfirmPassword("");
    setProfilePicture(user.photoURL || "");
  };

  const handleLogout = () => {
    doSignOut();
  };

  const handleDeleteAccount = () => {
    if (
      !window.confirm(
        "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    if (user) {
      const credential = EmailAuthProvider.credential(
        user.email,
        prompt(
          "Por favor, ingresa tu contraseña para confirmar la eliminación de la cuenta:"
        )
      );

      reauthenticateWithCredential(user, credential)
        .then(() => {
          return deleteUser(user);
        })
        .then(() => {
          console.log("Cuenta eliminada correctamente.");
          navigate("/");
        })
        .catch((error) => {
          if (error.code === "auth/requires-recent-login") {
            alert("Debes volver a iniciar sesión para eliminar tu cuenta.");
          } else {
            console.error("Error al eliminar la cuenta:", error);
          }
        });
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Detalles de la Cuenta</h1>
        <div className={styles.mainContent}>
          <div className={styles.photoSection}>
            <div className={styles.card}>
              <img
                src={
                  profilePicture ||
                  require("../../../Images/default-profile.png")
                }
                alt="Foto de perfil"
                className={styles.profilePicture}
              />
              {isUpdate && (
                <FloatingLabel label="Foto de perfil">
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                  />
                </FloatingLabel>
              )}
            </div>
          </div>
          <div className={styles.dataSection}>
            <div className={styles.card}>
              <FloatingLabel label="Correo Electrónico">
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
              <FloatingLabel label="Nombre">
                <Form.Control
                  type="text"
                  placeholder="Tu Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isUpdate}
                />
              </FloatingLabel>
            </div>
            <div className={styles.card}>
              <FloatingLabel label="Número de Teléfono">
                <Form.Control
                  type="text"
                  placeholder="Número de Teléfono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isUpdate}
                />
              </FloatingLabel>
            </div>
            <div className={styles.card}>
              <FloatingLabel label="Dirección">
                <Form.Control
                  type="text"
                  placeholder="Dirección"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={!isUpdate}
                />
              </FloatingLabel>
            </div>
            {isUpdate && (
              <>
                <div className={styles.card}>
                  <FloatingLabel label="Contraseña">
                    <Form.Control
                      type="password"
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FloatingLabel>
                </div>
                <div className={styles.card}>
                  <FloatingLabel label="Repite la Contraseña">
                    <Form.Control
                      type="password"
                      placeholder="Confirmar Contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </FloatingLabel>
                </div>
              </>
            )}
          </div>
        </div>
        <div className={styles.buttons}>
          {isUpdate ? (
            <div className={styles.buttonGroup}>
              <Button variant="primary" onClick={handleUpdateProfile}>
                Guardar Cambios
              </Button>
              <Button variant="light" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          ) : (
            <Button variant="primary" onClick={handleUpdate}>
              Editar Perfil
            </Button>
          )}
          <Button
            variant="danger"
            onClick={handleLogout}
            className={styles.deleteButton}
          >
            Cerrar Sesión
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteAccount}
            className={styles.deleteButton}
          >
            Borrar Cuenta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
