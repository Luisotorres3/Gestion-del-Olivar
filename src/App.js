import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./Components/NavBar/Navbar";
import Dashboard from "./Pages/Dashboard/Dashboard";
import "font-awesome/css/font-awesome.min.css";
import { auth } from "./Components/Authentication/Firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Contact from "./Pages/Contact/Contact";
import Account from "./Pages/Account/Account";
import Fincas from "./Pages/Fincas/Fincas";
import Olivos from "./Pages/Olivos/Olivos";
import Forecast from "./Pages/Forecast/Forecast";
import LandingPage from "./Pages/LandingPage/LandingPage"; // Asegúrate de crear este componente
import { doSignOut } from "./Components/Authentication/Auth";

function RutasApp({ user }) {
  if (!user) {
    return (
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route exact path="/account" element={<Account />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route exact path="/" element={<Dashboard />} />
      <Route exact path="/account" element={<Account />} />
      <Route exact path="/finca" element={<Fincas />} />
      <Route exact path="/olivos" element={<Olivos />} />
      <Route exact path="/pronostico" element={<Forecast />} />
      <Route exact path="/about" element={<Contact />} />
    </Routes>
  );
}

function App() {
  const [user, setUser] = useState(undefined); // Cambia el estado inicial a 'undefined'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    doSignOut()
      .then(() => {
        setUser(null);
        console.log("Sesión cerrada correctamente");
      })
      .catch((error) => {
        console.error("Error al cerrar la sesión:", error);
      });
  };

  // Muestra un mensaje de "loading" o un spinner hasta que se compruebe el estado de autenticación
  if (user === undefined) {
    return <div>Cargando...</div>; // Puedes reemplazar esto con un componente de loading más estilizado
  }

  const menuItems = user
    ? [
        {
          label: "Dashboard",
          icon: <i className="fa fa-tachometer" aria-hidden="true"></i>,
          path: "/",
        },
        {
          label: "Fincas",
          icon: <i className="fa fa-home" aria-hidden="true"></i>,
          path: "/finca",
        },
        {
          label: "Olivos",
          icon: <i className="fa fa-tree" aria-hidden="true"></i>,
          path: "/olivos",
        },
        {
          label: "Pronóstico",
          icon: <i className="fa fa-sun-o" aria-hidden="true"></i>,
          path: "/pronostico",
        },
        {
          label: "Sobre el proyecto",
          icon: <i className="fa fa-info-circle" aria-hidden="true"></i>,
          path: "/about",
        },
      ]
    : [];

  return (
    <>
      <Navbar user={user} handleSignOut={handleSignOut} links={menuItems} />
      <div className="content">
        <div className="scrollable-content">
          <RutasApp user={user} />
        </div>
      </div>
    </>
  );
}

export default App;
