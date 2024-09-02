# Gestión del Olivar

Este proyecto es una aplicación web diseñada para la gestión de olivares, permitiendo a los usuarios registrar, monitorear y analizar sus fincas a través de una interfaz interactiva y fácil de usar. La aplicación está construida utilizando React para el frontend y dos APIs backend separadas implementadas en Google Cloud Functions y Firebase Functions.

## Características

- **Gestión de Fincas**: Los usuarios pueden agregar, editar y eliminar fincas en su cuenta.
- **Procesamiento de Imágenes**: El sistema permite subir imágenes aéreas de olivares y procesarlas para contar la cantidad de olivos.
- **Previsión Meteorológica**: Los usuarios pueden consultar la previsión meteorológica para sus fincas.
- **Autenticación de Usuarios**: Integración con Firebase Authentication para gestionar el registro e inicio de sesión de usuarios.

## Tecnologías Utilizadas

- **Frontend**: React
- **Backend**:
  - API de Gestión de Fincas y Usuarios: Firebase Functions, Node.js
  - API de Procesamiento de Imágenes: Google Cloud Functions, Python, OpenCV
- **Base de Datos**: Firebase Realtime Database
- **Autenticación**: Firebase Authentication
- **Mapas Interactivos**: OpenLayers

## Estructura del Proyecto

### Frontend

El código fuente del frontend se encuentra en el directorio `src`. Aquí se organiza en las siguientes carpetas:

- **Components**: Componentes reutilizables de la interfaz de usuario.
- **Pages**: Páginas principales de la aplicación (e.g., Dashboard, Fincas, Olivos).
- **Hooks**: Hooks personalizados para lógica reutilizable.
- **Utils**: Configuración y utilidades, como la integración con Firebase.
- **Images**: Recursos gráficos utilizados en la aplicación.

### Backend

El backend se compone de dos APIs:

- **API de Gestión de Fincas y Usuarios**: Implementada en Firebase Functions, maneja las operaciones CRUD sobre fincas y la autenticación de usuarios.
- **API de Procesamiento de Imágenes**: Implementada en Google Cloud Functions, permite el análisis de imágenes aéreas para contar olivos.

## Despliegue

- **Frontend**: Desplegado en GitHub Pages para un fácil acceso a través del navegador.
- **API de Gestión de Fincas y Usuarios**: Desplegada en Firebase Functions.
- **API de Procesamiento de Imágenes**: Desplegada en Google Cloud Functions.

## Instalación y Configuración

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/Luisotorres3/Gestion-del-Olivar.git
   cd Gestion-del-Olivar
   ```
