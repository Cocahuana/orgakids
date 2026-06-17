# OrgaKids

## Sobre el Proyecto

**OrgaKids** es una **PWA (Progressive Web App)** pensada como organizador familiar de uso personal. No se publica en Play Store ni App Store: se instala directamente desde el navegador.

- **Android (Chrome):** "Agregar a pantalla de inicio"
- **iOS (Safari):** "Agregar a pantalla de inicio"

Una vez instalada debe comportarse como una app nativa: pantalla completa, ícono propio y sin barra del navegador.

## Objetivos del Proyecto

- Tomar el HTML funcional ya existente (UI y lógica completas con `localStorage`) y convertirlo en una PWA instalable.
- Integrar Firebase (Auth + Firestore + Hosting) **sin reescribir el CSS ni la estructura de UI**.
- Migrar la persistencia de `localStorage` a Firestore, con sincronización en tiempo real entre dispositivos.
- Configurar correctamente `manifest.json` y un service worker para soporte offline.
- Dejar la app deployada en Firebase Hosting.

## Punto de partida

Ya existe un HTML base funcional completo, con toda la lógica de UI implementada usando `localStorage`. Este archivo debe usarse como referencia visual y de lógica.

> __IMPORTANTE:__ No reescribir el CSS ni la estructura de UI. El trabajo consiste en integrar Firebase por encima de lo que ya existe.

## Stack Tecnológico

- [ ] **Frontend:** HTML/CSS/JS puro (sin frameworks)
- [ ] **PWA:** `manifest.json` + Service Worker
- [ ] **Auth:** Firebase Authentication (email + contraseña, cuenta familiar única y compartida)
- [ ] **Base de datos:** Firebase Firestore (reemplaza `localStorage`, sincronización en tiempo real)
- [ ] **Hosting:** Firebase Hosting

## Modelo de Datos

### Colección `entries` (Firestore)

Cada documento representa una entrada y tiene los siguientes campos:

| Campo   | Descripción                                  |
|---------|-----------------------------------------------|
| id      | Identificador único de la entrada              |
| type    | `exam` \| `sport` \| `event` \| `recover` \| `work` |
| kid     | Hijo/a asociado a la entrada                   |
| title   | Título de la entrada                           |
| date    | Fecha                                          |
| time    | Hora                                           |
| grade   | Nota (cuando aplica)                           |
| notes   | Notas adicionales (opcional)                   |
| recur   | Indica repetición (ej: semanal)                |

### Tipos de entrada

- **exam** — Exámenes: materia, fecha, alumno
- **sport** — Deportes: actividad, club, hora, repetición semanal
- **event** — Eventos familiares: descripción, fecha, hora
- **recover** — Recuperatorios: materia, nota actual, fecha
- **work** — Entregas de trabajos: nombre, materia, fecha

## Vistas de la App

- [ ] **Resumen:** estadísticas + alertas urgentes + vista de la semana actual
- [ ] **Calendario mensual interactivo**
- [ ] **Una pestaña por cada tipo de entrada** (exam, sport, event, recover, work)

## Requerimientos mínimos

### 1. Autenticación (Firebase Auth)

- [ ] Configurar Firebase Authentication con email + contraseña
- [ ] Pantalla de login
- [ ] Sesión persistente (no pedir login en cada visita)
- [ ] Una sola cuenta familiar compartida (no es necesario soporte multi-usuario)

### 2. Migración a Firestore

- [ ] Crear la colección `entries` en Firestore
- [ ] Implementar CRUD completo (crear, leer, actualizar, eliminar)
- [ ] Reemplazar todas las llamadas a `localStorage` por llamadas a Firestore

### 3. Sincronización en tiempo real

- [ ] Implementar `onSnapshot` sobre la colección `entries`
- [ ] Validar que un cambio hecho desde un dispositivo se refleje al instante en los demás

### 4. PWA — Manifest

- [ ] Crear `manifest.json` con:
  - [ ] Nombre e ícono de la app
  - [ ] `display: standalone`
  - [ ] Color de tema

### 5. PWA — Service Worker

- [ ] Service worker básico
- [ ] Cache del shell de la app para funcionamiento offline

### 6. Deploy

- [ ] Configurar Firebase Hosting
- [ ] Deploy de la app

## Orden sugerido de trabajo

1. Configurar el proyecto en Firebase (Auth + Firestore + Hosting)
2. Agregar pantalla de login y lógica de autenticación
3. Migrar el CRUD de `localStorage` a Firestore
4. Agregar sincronización en tiempo real con `onSnapshot`
5. Agregar `manifest.json` y service worker
6. Deploy en Firebase Hosting

## Notas

- No reescribir el CSS ni la estructura de UI existente; solo integrar Firebase.
- El HTML base adjuntado funciona como referencia visual y lógica para toda la integración.
