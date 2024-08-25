import React, { useState, useEffect, useRef } from "react";
import styles from "./Gestion.module.css";
import { Tooltip } from "react-tooltip";
import { Modal, Button, Form, FloatingLabel } from "react-bootstrap";
import {
  createFinca,
  getCoordsForCity,
  updateFinca,
} from "../../Utils/Firebase/databaseFunctions";
import { getAuth } from "firebase/auth"; // Importa getAuth de Firebase

// Componente PopupForm para crear y editar fincas
import MapComp from "../Map/Map";

export function PopupForm({ isOpen, onClose, fetchFincas, fincaToEdit }) {
  const [formData, setFormData] = useState({
    referenciaCatastral: "",
    localizacion: {
      direccion: "",
      municipio: "",
      codigoPostal: "",
      pais: "",
      latitud: "",
      longitud: "",
    },
    superficieConstruida: "",
    anoConstruccion: "",
    numOlivos: "",
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Estado para controlar la vista actual
  const [coords, setCoords] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    setCurrentUser(user ? user.uid : null);
  }, []);

  useEffect(() => {
    if (fincaToEdit) {
      setFormData(fincaToEdit.data); // Actualiza los datos del formulario con los datos de la finca a editar
    } else {
      setCurrentPage(1);
      setFormData({
        referenciaCatastral: "",
        localizacion: {
          direccion: "",
          municipio: "",
          codigoPostal: "",
          pais: "",
          latitud: "",
          longitud: "",
        },
        superficieConstruida: "",
        anoConstruccion: "",
        numOlivos: "",
      });
    }
  }, [fincaToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["direccion", "municipio", "codigoPostal", "pais"].includes(name)) {
      setFormData((prevState) => ({
        ...prevState,
        localizacion: {
          ...prevState.localizacion,
          [name]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setCoords(await getCoordsForCity(formData.localizacion.municipio));
      formData.localizacion.latitud = coords[0];
      formData.localizacion.longitud = coords[1];

      // Agregar el usuario actual a los datos del formulario
      const newFincaData = { ...formData, usuario: currentUser };
      if (fincaToEdit) {
        // Actualiza una finca existente

        await updateFinca(fincaToEdit.id, newFincaData);
      } else {
        // Crea una nueva finca
        console.log(newFincaData);
        await createFinca(newFincaData);
      }

      fetchFincas(); // Refresca la lista de fincas
      onClose(); // Cierra el formulario
      setFormData({
        referenciaCatastral: "",
        localizacion: {
          direccion: "",
          municipio: "",
          codigoPostal: "",
          pais: "",
          latitud: "",
          longitud: "",
        },
        superficieConstruida: "",
        anoConstruccion: "",
        numOlivos: "",
      });
    } catch (error) {
      console.error("Error al guardar la finca:", error);
    }
  };

  const handleMapClick = (coordinate) => {
    setFormData((prevData) => ({
      ...prevData,
      localizacion: {
        ...prevData.localizacion,
        latitud: coordinate[1],
        longitud: coordinate[0],
      },
    }));
  };

  const handlePolygonDrawn = (coordinates) => {
    setFormData((prevData) => ({
      ...prevData,
      coordenadasFinca: coordinates,
    }));
  };

  const cambiarDePagina = async (numPagina) => {
    if (numPagina == 2) {
      try {
        setCoords(await getCoordsForCity(formData.localizacion.municipio));
        setCurrentPage(numPagina);
      } catch (error) {
        console.error("Error al guardar las coordenadas:", error);
      }
    } else {
      setCurrentPage(numPagina);
    }
  };
  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton onClick={onClose}>
        <Modal.Title>
          {fincaToEdit ? "Editar Finca" : "Registrar Finca"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {currentPage === 1 ? (
          <Form onSubmit={(e) => e.preventDefault()}>
            <FloatingLabel
              controlId="floatingInput"
              label="Referencia Catastral"
              className="mb-2"
            >
              <Form.Control
                type="text"
                name="referenciaCatastral"
                placeholder="14900A081000100001FZ"
                value={formData.referenciaCatastral}
                onChange={handleChange}
                required
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="direccionInput"
              label="Dirección"
              className="mb-2"
            >
              <Form.Control
                type="text"
                name="direccion"
                value={formData.localizacion.direccion}
                onChange={handleChange}
                placeholder="Dirección"
                required
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="municipioInput"
              label="Municipio"
              className="mb-2"
            >
              <Form.Control
                type="text"
                name="municipio"
                value={formData.localizacion.municipio}
                onChange={handleChange}
                placeholder="Municipio"
                required
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="codigoPostalInput"
              label="Código Postal"
              className="mb-2"
            >
              <Form.Control
                type="text"
                name="codigoPostal"
                value={formData.localizacion.codigoPostal}
                onChange={handleChange}
                placeholder="Código Postal"
                required
              />
            </FloatingLabel>

            <FloatingLabel controlId="paisInput" label="País" className="mb-2">
              <Form.Control
                type="text"
                name="pais"
                value={formData.localizacion.pais}
                onChange={handleChange}
                placeholder="País"
                required
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="superficieInput"
              label="Superficie Construida"
              className="mb-2"
            >
              <Form.Control
                type="number"
                name="superficieConstruida"
                value={formData.superficieConstruida}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="anoInput"
              label="Año de Construcción"
              className="mb-2"
            >
              <Form.Control
                as="select"
                name="anoConstruccion"
                value={formData.anoConstruccion}
                onChange={handleChange}
              >
                <option value="">Seleccionar Año</option>
                {Array.from(
                  { length: new Date().getFullYear() - 1900 + 1 },
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
              label="Número de Olivos"
              className="mb-2"
            >
              <Form.Control
                type="number"
                name="numOlivos"
                value={formData.numOlivos}
                onChange={handleChange}
                min="0"
                required
              />
            </FloatingLabel>

            <Button
              variant="primary"
              onClick={() => cambiarDePagina(2)}
              disabled={
                !formData.referenciaCatastral ||
                !formData.localizacion.direccion ||
                !formData.localizacion.municipio ||
                !formData.localizacion.codigoPostal ||
                !formData.localizacion.pais ||
                !formData.superficieConstruida ||
                !formData.anoConstruccion ||
                !formData.numOlivos
              }
            >
              {fincaToEdit ? "Actualizar" : "Ir al Mapa"}
            </Button>
          </Form>
        ) : (
          <MapComp
            ref={mapRef}
            target={"map"}
            width="100%"
            height="500px"
            zoom="15"
            currentCoords={coords}
            editMode={true}
            onPolygonDrawn={handlePolygonDrawn}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        {currentPage === 2 && (
          <Button variant="secondary" onClick={() => setCurrentPage(1)}>
            Volver al Formulario
          </Button>
        )}
        {currentPage === 2 && (
          <Button variant="primary" onClick={handleSubmit}>
            {fincaToEdit ? "Actualizar" : "Enviar"}
          </Button>
        )}
        {currentPage === 1 && (
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

// Componente principal que muestra la lista de fincas
const Fincas = ({ fincas, mostrarInmuebleId, handleDelete, fetchFincas }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [fincaToEdit, setFincaToEdit] = useState(null);

  // Abre el formulario emergente para crear una nueva finca
  const openPopup = () => {
    setFincaToEdit(null); // No hay finca para editar
    setIsPopupOpen(true);
  };

  // Abre el formulario emergente para editar una finca existente
  const openEditPopup = (finca) => {
    setFincaToEdit(finca); // Establece la finca a editar
    setIsPopupOpen(true);
  };

  // Cierra el formulario emergente
  const closePopup = () => {
    setFincaToEdit(null);
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
            fincaToEdit={fincaToEdit}
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
                  onClick={openPopup}
                >
                  <i className="fa fa-plus-square-o" aria-hidden="true"></i>
                  <Tooltip id="add" style={{ zIndex: "9999" }} />
                </button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Referencia Catastral</th>
                    <th>Localización</th>
                    <th>Superficie Construida</th>
                    <th>Año Construcción</th>
                    <th>Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {fincas.map((finca, index) => (
                    <tr key={index}>
                      <td>{finca.data.referenciaCatastral}</td>
                      <td>{`${finca.data.localizacion.direccion}, ${finca.data.localizacion.municipio}, ${finca.data.localizacion.codigoPostal}, ${finca.data.localizacion.pais}`}</td>
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
                            onClick={() => openEditPopup(finca)}
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
