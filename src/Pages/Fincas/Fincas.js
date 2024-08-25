import React, { useEffect, useState } from "react";
import styles from "./Fincas.module.css"; // Importa los estilos específicos para este componente
import ListaFincas from "../../Components/Fincas/ListaFincas"; // Importa el componente para mostrar la lista de fincas
import Inmueble from "../../Components/Fincas/Inmueble"; // Importa el componente para mostrar detalles de un inmueble
import {
  deleteFincaById, // Importa la función para borrar una finca por su ID
  getFincas, // Importa la función para obtener todas las fincas
} from "../../Utils/Firebase/databaseFunctions"; // Importa las funciones de la base de datos

const Fincas = () => {
  // Estado para almacenar el ID del inmueble actualmente seleccionado
  const [idInmueble, setIdInmueble] = useState(null);

  // Estado para almacenar la lista de fincas obtenidas
  const [fincas, setFincas] = useState([]);

  // Función para obtener las fincas desde la base de datos
  const fetchFincas = async () => {
    try {
      const data = await getFincas();
      setFincas(data.data); // Actualiza el estado con las fincas obtenidas
    } catch (error) {
      console.error("Hubo un error al obtener las fincas:", error);
      // Aquí puedes manejar el error según sea necesario, por ejemplo, mostrando un mensaje de error al usuario
    }
  };

  // Efecto secundario para obtener las fincas al montar el componente
  useEffect(() => {
    fetchFincas();
  }, []); // El array vacío asegura que este efecto solo se ejecute una vez, al montar el componente

  // Función para mostrar los detalles de un inmueble dado su ID
  const mostrarInmuebleId = async (id) => {
    setIdInmueble(id); // Actualiza el estado con el ID del inmueble seleccionado
  };

  // Función para manejar la eliminación de una finca
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "¿Estás seguro de que quieres borrar esta finca?"
    );

    if (isConfirmed) {
      try {
        await deleteFincaById(id); // Intenta borrar la finca por su ID
        console.log(`Finca ${id} borrada correctamente.`);
        fetchFincas(); // Actualiza la lista de fincas después de la eliminación
      } catch (error) {
        console.log(`Finca ${id} no borrada correctamente.`);
        // Aquí puedes manejar el error según sea necesario
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Renderiza el componente Inmueble si hay un ID de inmueble seleccionado */}
        {idInmueble ? (
          <Inmueble
            idInmueble={idInmueble}
            mostrarInmuebleId={mostrarInmuebleId} // Pasar la función para actualizar el ID del inmueble
          />
        ) : (
          /* Renderiza el componente ListaFincas si no hay un ID de inmueble seleccionado */
          <ListaFincas
            fincas={fincas} // Pasa la lista de fincas al componente ListaFincas
            mostrarInmuebleId={mostrarInmuebleId} // Pasar la función para actualizar el ID del inmueble
            handleDelete={handleDelete} // Pasar la función para manejar la eliminación de fincas
            fetchFincas={fetchFincas} // Pasar la función para actualizar la lista de fincas
          />
        )}
      </div>
    </div>
  );
};

export default Fincas;
