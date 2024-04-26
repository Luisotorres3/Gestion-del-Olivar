import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Components/NavBar/Navbar";
import Dashboard from "./Pages/Dashboard/Dashboard";
import "font-awesome/css/font-awesome.min.css";
import { auth } from "./Components/Authentication/Firebase";
import { useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Contact from "./Pages/Contact/Contact";
import Account from "./Pages/Account/Account";
import Fincas from "./Pages/Fincas/Fincas";
import Olivos from "./Pages/Olivos/Olivos";
import Forecast from "./Pages/Forecast/Forecast";

function RutasApp() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/account" element={<Account />} />
      <Route path="/finca" element={<Fincas />} />
      <Route path="/olivos" element={<Olivos />} />
      <Route path="/pronostico" element={<Forecast />} />
      <Route path="/about" element={<Contact />} />
    </Routes>
  );
}

function App() {
  const [user, setUser] = useState(null);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
    } else {
      console.log("No user");
    }
  });

  // Función para cerrar sesión
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // La sesión se cerró correctamente
        setUser(null);
        console.log("Sesión cerrada correctamente");
      })
      .catch((error) => {
        // Ocurrió un error al cerrar la sesión
        console.error("Error al cerrar la sesión:", error);
      });
  };

  const menuItems = [
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
  ];

  return (
    <>
      <Navbar user={user} handleSignOut={handleSignOut} links={menuItems} />
      <div className="content">
        <div className="scrollable-content">
          <RutasApp />
        </div>
      </div>
    </>
  );
}

export default App;
