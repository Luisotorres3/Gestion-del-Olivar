import React, { useState, useEffect } from "react";
import AccountComp from "../../Components/Authentication/Account/Account";
import Dashboard from "../Dashboard/Dashboard";
import { auth } from "../../Components/Authentication/Firebase";
import AccountDetails from "../../Components/Authentication/Account/AccountDetails";

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para controlar la carga inicial

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false); // Cuando el usuario cambia, establece loading en falso para indicar que la carga ha terminado
    });

    return () => unsubscribe(); // Limpia el event listener cuando el componente se desmonta
  }, []);

  // Si aún se está cargando la información del usuario, muestra un indicador de carga
  if (loading) {
    return <p>Loading...</p>;
  }
  if (user) return <AccountDetails user={user} />;
  return <AccountComp />;
};

export default Account;
