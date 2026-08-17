# OrgaKids

## Sobre el Proyecto

**OrgaKids** es una **PWA (Progressive Web App)** pensada como organizador familiar de uso personal. No se publica en Play Store ni App Store: se instala directamente desde el navegador.

- **Android (Chrome):** "Agregar a pantalla de inicio"
- **iOS (Safari):** "Agregar a pantalla de inicio"

Una vez instalada debe comportarse como una app nativa: pantalla completa, ícono propio y sin barra del navegador.

## Objetivos del Proyecto

- Migrar el HTML/CSS/JS funcional ya existente (UI y lógica completas con `localStorage`) a una app de **React**.
- Integrar Firebase (Auth + Firestore + Hosting) sobre la nueva base de React.
- Migrar la persistencia de `localStorage` a Firestore, con sincronización en tiempo real entre dispositivos.
- Convertir la app de React en una PWA instalable (manifest + service worker).
- Dejar la app deployada en Firebase Hosting.

## Punto de partida

Ya existe un HTML base funcional completo, con toda la lógica de UI implementada usando `localStorage`. Este archivo se usa como referencia visual y de lógica para migrar a React.

> __IMPORTANTE:__ Al migrar a React, mantener el mismo diseño visual (CSS) y la misma lógica de UI ya resuelta en el HTML base. No se trata de rediseñar, sino de reorganizar esa lógica en componentes.

## Stack Tecnológico

- [ ] **Frontend:** React (Create React App o Vite)
- [ ] **PWA:** `manifest.json` + Service Worker (vía template PWA de CRA o `vite-plugin-pwa`)
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

### 1. Migración a React

- [ ] Inicializar proyecto de React (CRA o Vite)
- [ ] Pasar el HTML/CSS existente a componentes (manteniendo el diseño visual)
- [ ] Reorganizar la lógica de UI ya hecha en estado/props de React
- [ ] Armar el ruteo de las vistas (Resumen, Calendario, una pestaña por tipo de entrada)

### 2. Autenticación (Firebase Auth)

- [ ] Configurar Firebase Authentication con email + contraseña
- [ ] Pantalla/componente de login
- [ ] Sesión persistente (no pedir login en cada visita)
- [ ] Una sola cuenta familiar compartida (no es necesario soporte multi-usuario)

### 3. Migración a Firestore

- [ ] Crear la colección `entries` en Firestore
- [ ] Implementar CRUD completo (crear, leer, actualizar, eliminar) desde componentes/hooks de React
- [ ] Reemplazar todas las llamadas a `localStorage` por llamadas a Firestore

### 4. Sincronización en tiempo real

- [ ] Implementar `onSnapshot` sobre la colección `entries` (por ejemplo dentro de un `useEffect`)
- [ ] Validar que un cambio hecho desde un dispositivo se refleje al instante en los demás

### 5. PWA — Manifest

- [ ] Crear/ajustar `manifest.json` con:
  - [ ] Nombre e ícono de la app
  - [ ] `display: standalone`
  - [ ] Color de tema

### 6. PWA — Service Worker

- [ ] Service worker básico (registro vía CRA template o `vite-plugin-pwa`)
- [ ] Cache del shell de la app para funcionamiento offline

### 7. Deploy

- [ ] Configurar Firebase Hosting
- [ ] Build de producción de la app de React
- [ ] Deploy en Firebase Hosting

## Orden sugerido de trabajo

1. Migrar el HTML/CSS/JS base a componentes de React, manteniendo el diseño y la lógica de UI
2. Configurar el proyecto en Firebase (Auth + Firestore + Hosting)
3. Agregar pantalla de login y lógica de autenticación
4. Migrar el CRUD de `localStorage` a Firestore
5. Agregar sincronización en tiempo real con `onSnapshot`
6. Convertir la app a PWA (`manifest.json` + service worker)
7. Deploy en Firebase Hosting

## Notas

- Mantener el mismo diseño visual (CSS) al migrar a React; el objetivo es reorganizar en componentes, no rediseñar.
- El HTML base adjuntado funciona como referencia visual y lógica durante toda la migración.
