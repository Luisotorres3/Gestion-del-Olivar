import React, { useState, useEffect } from "react";
import styles from "./Gestion.module.css";
import { Tooltip } from "react-tooltip";
import { Modal, Button, Form, FloatingLabel } from "react-bootstrap";
import { createFinca } from "../../Utils/Firebase/databaseFunctions";

function PopupForm({ isOpen, onClose, fetchFincas }) {
  const [formData, setFormData] = useState({
    referenciaCatastral: "",
    localizacion: {
      direccion: "",
      municipio: "",
      codigoPostal: "",
      pais: "",
    },
    clase: "",
    usoPrincipal: "",
    superficieConstruida: "",
    anoConstruccion: "",
    numOlivos: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Si el campo que está cambiando no está dentro de localizacion, actualizamos directamente
    if (name !== "localizacion") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      // Si el campo que está cambiando está dentro de localizacion, necesitamos actualizar localizacion
      // de manera diferente ya que es un objeto anidado
      const { localizacion: prevLocalizacion, ...rest } = formData;
      setFormData({
        ...rest,
        localizacion: {
          ...prevLocalizacion,
          [e.target.name]: e.target.value,
        },
      });
    }
  };
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      localizacion: {
        ...prevState.localizacion,
        [name]: value,
      },
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes enviar los datos a la API o hacer lo que necesites con ellos
    const create = async () => {
      try {
        await createFinca(formData);
        fetchFincas();
      } catch (error) {
        console.log(error);
      }
    };
    create();
    console.log("Datos enviados:", formData);
    onClose();
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Finca</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <FloatingLabel
            controlId="floatingInput"
            label="Referencia Catastral"
            className="mb-3"
          >
            <Form.Control
              type="text"
              name="referenciaCatastral"
              placeholder="14900A081000100001FZ"
              value={formData.referenciaCatastral}
              onChange={handleChange}
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="direccionInput"
            label="Dirección"
            className="mb-3"
          >
            <Form.Control
              type="text"
              name="direccion"
              value={formData.localizacion.direccion}
              onChange={handleLocationChange}
              placeholder="Dirección"
              required
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="municipioInput"
            label="Municipio"
            className="mb-3"
          >
            <Form.Control
              type="text"
              name="municipio"
              value={formData.localizacion.municipio}
              onChange={handleLocationChange}
              placeholder="Municipio"
              required
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="codigoPostalInput"
            label="Código Postal"
            className="mb-3"
          >
            <Form.Control
              type="text"
              name="codigoPostal"
              value={formData.localizacion.codigoPostal}
              onChange={handleLocationChange}
              placeholder="Código Postal"
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="paisInput" label="País" className="mb-3">
            <Form.Control
              type="text"
              name="pais"
              value={formData.localizacion.pais}
              onChange={handleLocationChange}
              placeholder="País"
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="claseInput" label="Clase" className="mb-3">
            {" "}
            <Form.Control
              as="select"
              name="clase"
              value={formData.clase}
              onChange={handleChange}
            >
              <option value="">Seleccionar Clase</option>
              <option value="Residencial">Residencial</option>
              <option value="Comercial">Comercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Agrícola">Agrícola</option>
            </Form.Control>
          </FloatingLabel>

          <FloatingLabel
            controlId="usoInput"
            label="Uso Principal"
            className="mb-3"
          >
            <Form.Control
              as="select"
              name="usoPrincipal"
              value={formData.usoPrincipal}
              onChange={handleChange}
            >
              <option value="">Seleccionar Uso Principal</option>
              <option value="Vivienda">Vivienda</option>
              <option value="Oficina">Oficina</option>
              <option value="Almacén">Almacén</option>
              <option value="Terreno">Terreno</option>
            </Form.Control>
          </FloatingLabel>

          <FloatingLabel
            controlId="superficieInput"
            label="Superficie Construida"
            className="mb-3"
          >
            <Form.Control
              type="number"
              name="superficieConstruida"
              value={formData.superficieConstruida}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="anoInput"
            label="Año de construcción"
            className="mb-3"
          >
            <Form.Control
              as="select"
              name="anoConstruccion"
              value={formData.anoConstruccion}
              onChange={handleChange}
            >
              <option value="">Seleccionar Año</option>
              {Array.from(
                { length: new Date().getFullYear() - 1900 },
                (_, index) => (
                  <option key={index} value={1900 + index}>
                    {1900 + index}
                  </option>
                )
              )}
            </Form.Control>
          </FloatingLabel>

          <FloatingLabel
            controlId="olivosInput"
            label="Nº de Olivos"
            className="mb-3"
          >
            <Form.Control
              type="number"
              name="numOlivos"
              value={formData.numOlivos}
              onChange={handleChange}
              min="0"
            />
          </FloatingLabel>

          <Button variant="primary" type="submit">
            Enviar
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const Fincas = ({ fincas, mostrarInmuebleId, handleDelete, fetchFincas }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.title}>
          <h1>Mis Fincas</h1>
          <PopupForm
            isOpen={isPopupOpen}
            onClose={closePopup}
            fetchFincas={fetchFincas}
          />
        </div>
        {fincas && (
          <div className={styles.fincas}>
            <div className={styles.lista}>
              <div className={styles.buttons}>
                <button
                  data-tooltip-id="add"
                  data-tooltip-content="Crear Finca"
                  data-tooltip-place="top"
                  onClick={() => openPopup()}
                >
                  <i className="fa fa-plus-square-o" aria-hidden="true"></i>
                  <Tooltip id="add" style={{ zIndex: "9999" }} />
                </button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Referencia catastral</th>
                    <th>Localización</th>
                    <th>Clase</th>
                    <th>Uso principal</th>
                    <th>Superficie construida</th>
                    <th>Año construcción</th>
                    <th>Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {fincas.map((finca, index) => (
                    <tr key={index}>
                      <td>{finca.data.referenciaCatastral}</td>
                      <td>{`${finca.data.localizacion.direccion}, ${finca.data.localizacion.municipio}, ${finca.data.localizacion.codigoPostal}, ${finca.data.localizacion.pais}`}</td>

                      <td>{finca.data.clase}</td>
                      <td>{finca.data.usoPrincipal}</td>
                      <td>{finca.data.superficieConstruida}</td>
                      <td>{finca.data.anoConstruccion}</td>
                      <td>
                        <div className={styles.acciones}>
                          <button
                            onClick={() => mostrarInmuebleId(finca.id)}
                            data-tooltip-id="open"
                            data-tooltip-content="Abrir"
                            data-tooltip-place="top"
                          >
                            <i className="fa fa-eye" aria-hidden="true"></i>
                          </button>
                          <button
                            data-tooltip-id="edit"
                            data-tooltip-content="Editar"
                            data-tooltip-place="top"
                          >
                            <i
                              className="fa fa-pencil-square-o"
                              aria-hidden="true"
                            ></i>
                          </button>
                          <button
                            data-tooltip-id="delete"
                            data-tooltip-content="Borrar"
                            data-tooltip-place="top"
                            onClick={() => handleDelete(finca.id)}
                          >
                            <i className="fa fa-trash-o" aria-hidden="true"></i>
                          </button>
                          <Tooltip id="open" style={{ zIndex: "9999" }} />
                          <Tooltip id="edit" style={{ zIndex: "9999" }} />
                          <Tooltip id="delete" style={{ zIndex: "9999" }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Fincas;
