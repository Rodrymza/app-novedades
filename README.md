# 📖 App de Libro de Novedades

Una aplicación web full-stack diseñada para digitalizar y gestionar el "libro de novedades" o bitácora de eventos de un equipo u organización. Reemplaza el libro de papel por una interfaz moderna, accesible y filtrable.

Este proyecto está construido con el stack MERN (MongoDB, Express, React, Node.js) y utiliza TypeScript en todo el desarrollo.

## ✨ Características Principales

* **Gestión de Usuarios:** Sistema de autenticación con dos roles definidos:
    * **Supervisor:** Puede crear/gestionar usuarios y administrar las categorías del sistema.
    * **Operador:** Usuario estándar que crea y consulta novedades.
* **CRUD de Novedades:** Los operadores pueden crear, leer, actualizar y eliminar (CRUD) entradas de novedades.
* **Categorización por Áreas:** Las novedades se clasifican en **Áreas** (ej. "Quirófano", "Guardia", "Soporte IT") que son creadas y gestionadas por los Supervisores para mantener la consistencia.
* **Etiquetado (Tags):** Sistema flexible de **Etiquetas** (tags) para añadir contexto específico (ej. "Urgente", "Equipo-A", "Error-505") a cada novedad.
* **Filtrado Avanzado:** Los usuarios pueden filtrar el listado de novedades por Área, por Etiqueta, por autor o por rango de fechas.
* **Seguridad:** Autenticación basada en JWT (JSON Web Tokens) y hasheo de contraseñas con `bcryptjs`.

## 🛠️ Stack Tecnológico

Este proyecto utiliza un enfoque de monorepo con dos carpetas principales: `/cliente` y `/servidor`.

**Backend (`/servidor`)**
* **Runtime:** Node.js
* **Framework:** Express
* **Lenguaje:** TypeScript
* **Base de Datos:** MongoDB
* **ODM:** Mongoose (para modelado de datos)
* **Autenticación:** JWT (jsonwebtoken) + `bcryptjs`
* **Utilidades:** `cors`, `dotenv`, `ts-node-dev`

**Frontend (`/cliente`)**
* **Framework:** React
* **Bundler:** Vite
* **Lenguaje:** TypeScript
* **Peticiones HTTP:** `axios` (o `fetch`)
* **Manejo de Estado:** React Context (o la librería que prefieras, ej. Zustand/Redux)
* **Routing:** `react-router-dom`