# Steam Lite

> Proyecto de Software — 2025

Implementación simplificada tipo tienda Steam como caso de estudio para la materia **Proyecto de Software**.

## Cátedra

| | |
|---|---|
| **Asignatura** | Proyecto de Software |
| **Docente a cargo** | Ing. Damián Santos |
| **Docente** | Ing. Maximiliano Santos |
| **Director** | Esp. Lic. Gustavo Siciliano |

### Integrantes

- Dante Zulli
- Gianluca Pugente
- Santino Altieri
- Axel Joel Insfran
- Agustín Tambosco

## Sobre el proyecto

El objetivo de la cursada es poner en práctica herramientas de gestión y planificación de proyectos de software (product vision, is/is not, usuarios, product backlog, user stories, estimaciones, etc.) desarrollo sobre un clon de Steam a modo de práctica.

Todo el material de la parte de gestión se encuentra en el [drive de la materia](https://drive.google.com/drive/u/1/folders/1S2-5Ng6uDBsPATrKARh6ghDGlRtLOfBi).

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite 8 |
| Backend | Node.js + Express 5 |
| Base de datos | SQLite3 (better-sqlite3) |

## Arrancar

```bash
npm install       # instala dependencias (raíz, client y server)
npm run dev       # levanta server (3001) y client (5173) juntos
npm run dev:server  # solo backend
npm run dev:client  # solo frontend
```

La base de datos se crea sola con datos mock en el primer arranque. Para resetear:

```bash
npm run reset     # borra la DB, la recrea y la seedea de nuevo
```

## Licencia

UNSAM — Licenciatura en Sistemas
