import React, { useEffect, useState } from "react";
import styles from "./Contact.module.css";
import Card from "react-bootstrap/Card";
import axios from "axios";

function AboutMe() {
  return (
    <div className={styles.aboutMe}>
      <img src={require("../../Images/UGR.png")} alt="Profile"></img>
      <div className={styles.infoAboutMe}>
        <h1 className={styles.h3Contact}>
          TFG Grado de Ingeniería Informática
        </h1>
        <p>Luis Soto Torres</p>
      </div>
    </div>
  );
}

function LinksSocial() {
  return (
    <ul>
      <li>
        <a href="https://www.ugr.es" target="_blank" rel="noreferrer">
          UGR
          <i
            className="fa fa-long-arrow-right"
            aria-hidden="true"
            style={{ transform: "rotate(-45deg)", color: "#bbb" }}
          ></i>
        </a>
      </li>
      <li>
        <a
          href="https://github.com/Luisotorres3"
          target="_blank"
          rel="noreferrer"
        >
          Mi GitHub
          <i
            className="fa fa-long-arrow-right"
            aria-hidden="true"
            style={{ transform: "rotate(-45deg)", color: "#bbb" }}
          ></i>
        </a>
      </li>
      <li>
        <a href="" target="_blank" rel="noreferrer">
          Link 3
          <i
            className="fa fa-long-arrow-right"
            aria-hidden="true"
            style={{ transform: "rotate(-45deg)", color: "#bbb" }}
          ></i>
        </a>
      </li>
    </ul>
  );
}

function CardHerramienta({ title, img }) {
  return (
    <div className={styles.cardHerramienta}>
      <img src={img} alt={title} />
      <h1>{title}</h1>
    </div>
  );
}

function CardTechs() {
  const herramientas = [
    {
      nombre: "React",
      imagen:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/240px-React-icon.svg.png",
    },
    {
      nombre: "JavaScript",
      imagen:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/240px-JavaScript-logo.png",
    },
    {
      nombre: "GitHub",
      imagen:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/240px-Octicons-mark-github.svg.png",
    },
    {
      nombre: "Flask",
      imagen:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Flask_logo.svg/460px-Flask_logo.svg.png",
    },
    {
      nombre: "Firebase",
      imagen:
        "https://upload.wikimedia.org/wikipedia/commons/c/cf/Firebase_icon.svg",
    },
    {
      nombre: "HTML/CSS",
      imagen:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/HTML5_Badge.svg/240px-HTML5_Badge.svg.png",
    },
    {
      nombre: "Bootstrap",
      imagen:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Bootstrap_logo.svg/240px-Bootstrap_logo.svg.png",
    },
  ];
  return (
    <>
      {herramientas.map((item, i) => (
        <CardHerramienta
          key={i}
          className={styles.cardTools}
          title={item.nombre}
          img={item.imagen}
        />
      ))}
    </>
  );
}

function TechUsed() {
  return (
    <>
      <CardTechs />
    </>
  );
}

function ToolsUsed() {
  return <></>;
}

const Contact = () => {
  const [titt, setTitt] = useState("");

  /* 
    useEffect(() => {
    axios
      .get(
        `https://us-central1-gestiondelolivar-48d30.cloudfunctions.net/app/api/fincas/1`
      )
      .then((response) => {
        // La solicitud se completó correctamente
        setTitt(response.data.name);
        console.log(response.data);
      })
      .catch((error) => {
        // Ocurrió un error en la solicitud
        console.error("!Correct", error);
      });
  }, []); // Ejecutar el efecto solo una vez al montar el componente
  */

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <div className={styles.content}>
          <AboutMe />
          <div className={styles.aboutProject}>
            <div className={`${styles.aboutContent} ${styles.links}`}>
              <LinksSocial />
            </div>
            <div className={styles.aboutContent}>
              <h3 className={styles.h3Contact}>
                Proyecto de gestión del olivar
              </h3>
              <p>
                La transformación digital está implicando cambios significativos
                en la gestión de procesos clave para cualquier organización y/o
                empresa. Esto se debe, entre otras cosas, a que la tecnología
                nos brinda numerosas ventajas en términos de eficiencia,
                productividad y optimización de recursos. Por otro lado,
                sectores tradicionales, como son el agroalimentario, se ven
                beneficiados por estos nuevos avances, generándose nuevas
                oportunidades para modernizar sus procesos. Este proyecto
                pretende ahondar en el uso de las nuevas tecnologías en la
                gestión del olivar, tratando de responder a una serie de retos
                reales indicados por trabajadores del sector. Concretamente, se
                propone aplicar técnicas de procesamiento y análisis de imágenes
                aprovechando la oportunidad que brindan tanto el uso de drones
                como las vistas áreas accesibles a través de herramientas como
                GoogleMaps.
              </p>
            </div>
            <div className={styles.aboutContent}>
              <div>
                <h3 className={styles.h3Contact}>Agradecimientos</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Vestibulum eget ex sed nulla condimentum tincidunt. Integer
                  tincidunt purus vel felis scelerisque, at pharetra lorem
                  finibus. Pellentesque auctor laoreet felis, at scelerisque
                  urna viverra eu. Sed efficitur est id enim scelerisque, quis
                  convallis neque suscipit. Suspendisse potenti. Aenean
                  fermentum, libero nec blandit ultrices, dui augue venenatis
                  elit, nec faucibus quam velit eu nulla. Vestibulum vel metus
                  ut mi tristique dignissim. Integer nec velit ut libero
                  efficitur ullamcorper. Vivamus eget orci at felis interdum
                  condimentum eget eget ante. Nam convallis dui ut ex gravida,
                  non ultricies urna tincidunt.
                </p>
              </div>
              <hr />
              <div>
                <p className={styles.TFGOwner}>TFG de Luis Soto Torres</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.content}>
          <div className={styles.contentTarjetas}>
            <h1>A{titt ? titt : " b"}</h1>
            <div className={styles.tecnologias}>
              <TechUsed />
            </div>
            <div className={styles.herramientas}>
              <ToolsUsed />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
