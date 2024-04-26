import React, { useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";

function NavbarLinkItem({ item, isCollapsed, setSelectedLink }) {
  return (
    <Link
      className={`${styles.navLink} ${
        isCollapsed ? styles.navLinkCollapsed : ""
      } `}
      to={item.path}
      onClick={() => setSelectedLink(item.path)}
      data-tooltip-id={item.label}
      data-tooltip-content={item.label}
      data-tooltip-place="right"
    >
      {isCollapsed && <Tooltip id={item.label} style={{ zIndex: "9999" }} />}

      {item.icon}
      {!isCollapsed && (
        <li
          key={item.path}
          style={{
            display: "inline-flex",
          }}
        >
          {item.label}
        </li>
      )}
    </Link>
  );
}

function NavbarLinks({ links, isCollapsed, selectedLink, setSelectedLink }) {
  return (
    <ul>
      {links &&
        links.length > 0 &&
        links.map((item) => (
          <div
            key={item.label}
            className={`${styles.linksNavbar} ${
              isCollapsed ? styles.linksNavbarCollapsed : ""
            } ${selectedLink === item.path ? styles.selectedLink : ""}`}
            style={{
              paddingLeft: isCollapsed === false ? "27px" : "0",
            }}
          >
            <NavbarLinkItem
              item={item}
              isCollapsed={isCollapsed}
              setSelectedLink={setSelectedLink}
            />
          </div>
        ))}
    </ul>
  );
}

function UserDetails({ user, isCollapsed, handleSignOut }) {
  if (!isCollapsed) {
    return (
      <>
        <div className={styles.divUserDetails}>
          {user ? (
            <>
              <span>{user.displayName}</span>
              <span>{user.email}</span>
            </>
          ) : (
            <div
              className={`${styles.linksNavbar} ${
                isCollapsed ? styles.linksNavbarCollapsed : ""
              }`}
              style={{
                paddingLeft: isCollapsed === false ? "27px" : "0",
              }}
            >
              <Link
                className={`${styles.navLink} ${
                  isCollapsed ? styles.navLinkCollapsed : ""
                }`}
                to="/account"
              >
                Login<i className="fa fa-sign-in" aria-hidden="true"></i>
              </Link>
            </div>
          )}
        </div>
        {user && (
          <Link
            className={`${styles.navLink} ${
              isCollapsed ? styles.navLinkCollapsed : styles.logoutLink
            }`}
            data-tooltip-id="tooltipSignOut"
            data-tooltip-content="Cerrar Sesión"
            data-tooltip-place="top"
          >
            <i
              className="fa fa-sign-out"
              aria-hidden="true"
              onClick={handleSignOut}
            ></i>{" "}
          </Link>
        )}
      </>
    );
  }
}

function CloseNav({ isCollapsed, showNavbar }) {
  return (
    <div
      className={`${styles.toggleButton} ${
        isCollapsed ? styles.navLinkCollapsed : ""
      }`}
      onClick={() => showNavbar(!isCollapsed)}
      data-tooltip-id="closeNav"
      data-tooltip-content={
        !isCollapsed ? "Cerrar barra lateral" : "Abrir barra lateral"
      }
      data-tooltip-place="right"
    >
      <span>&#9776;</span>
    </div>
  );
}

function NavbarLogo({ isCollapsed, showNavbar }) {
  return (
    <>
      {!isCollapsed && (
        <Link className={`${styles.navbarLogo}`} to="/">
          <img
            src={require("../../Images/favicon.ico")}
            alt="Gestión del Olivar"
          />
          <h3 className="mt-3 mb-4 fs-5" style={{ width: "max-content" }}>
            Gestión del Olivar
          </h3>
        </Link>
      )}
      <CloseNav isCollapsed={isCollapsed} showNavbar={showNavbar} />
    </>
  );
}

const Navbar = ({ links, user, handleSignOut }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);

  function addToolTips() {
    return (
      <>
        <Tooltip id="tooltipSignOut" style={{ zIndex: "9999" }} />
        <Tooltip id="closeNav" style={{ zIndex: "9999" }} />
        <Tooltip id="user" style={{ zIndex: "9999" }} />
      </>
    );
  }

  return (
    <nav
      className={`${styles.navbar} ${isCollapsed ? styles.collapsed : ""}`}
      style={{
        width: isCollapsed === false ? 260 : 60,
      }}
      id="navbarId"
    >
      <div className={styles.navbarLogo}>
        <NavbarLogo
          isCollapsed={isCollapsed}
          showNavbar={() => setIsCollapsed(!isCollapsed)}
        />
      </div>
      <div className={styles.navbarContent}>
        <div className={styles.navbarContentLinks}>
          <NavbarLinks
            links={links}
            isCollapsed={isCollapsed}
            selectedLink={selectedLink}
            setSelectedLink={setSelectedLink}
          />
        </div>
        <hr></hr>
        <div className={styles.navbarContentAccount}>
          {!isCollapsed ? (
            <Link to="/account">
              <img
                src={user ? user.photoURL : require("../../Images/UGR.png")}
                alt="Gestión del Olivar"
              />
            </Link>
          ) : (
            <Link
              className={`${styles.navLink} ${
                isCollapsed ? styles.navLinkCollapsed : ""
              }`}
              to="/account"
              data-tooltip-id="user"
              data-tooltip-content="Mi Cuenta"
              data-tooltip-place="right"
            >
              <i className="fa fa-user-circle" aria-hidden="true"></i>
            </Link>
          )}
          <UserDetails
            user={user ? user : null}
            isCollapsed={isCollapsed}
            handleSignOut={handleSignOut}
          />
        </div>
      </div>
      {addToolTips()}
    </nav>
  );
};

export default Navbar;
