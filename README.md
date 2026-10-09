# 🗳️ Institutional Digital Voting Platform (Google Apps Script)

> **Secure, serverless election management and digital polling platform** designed for institutional school elections (Personería, Contraloría, Cabildante). Built with **Google Apps Script**, **Bootstrap 5**, **Chart.js**, and reactive **Google Sheets**.

---

## 🇺🇸 English Version

### 📸 Screenshots & UI Showcase

| Interactive Digital Ballot (*Tarjetón*) | Real-Time Electoral Analytics |
| :---: | :---: |
| ![Digital Ballot](screenshot_tarjeton.png) | ![Admin Dashboard](screenshot_admin.png) |

| Juror & Polling Booth Station | Role-Based Authentication Flow |
| :---: | :---: |
| ![Juror Station](screenshot_jurado.png) | ![Login View](screenshot_login.png) |

---

### 🚀 Overview
Conceived to modernize school democracy and institutional voting processes. It replaces traditional paper ballots with a touch-friendly, intuitive digital voting terminal, ensuring immediate vote tallying, strict auditability, and zero hosting costs by leveraging the Google Workspace serverless ecosystem.

### ✨ Key Features
- **Role-Based Access Control (RBAC):**
  - **Polling Table Jurors:** Search and verify students against the digital voter census, filter rosters by grade, and authorize private voting sessions.
  - **Administration / Rectorate:** Real-time scrutiny, live turnout metrics, and automated final results.
- **Dynamic Ballot Generation (*Tarjetón Digital*):**
  - Context-aware candidate rendering that adapts dynamically based on the student's grade level (e.g., Primary vs. Secondary School candidates).
  - Built-in URL resolution engine converting Google Drive share links into direct, high-performance image CDN URLs.
- **Anti-Fraud & Audit Trails:**
  - Instant census invalidation upon vote submission to strictly prevent duplicate voting.
  - Granular vote indexing recording timestamp, ballot role, candidate, grade, and specific polling station (*Mesa*).
- **Executive Results Dashboard:**
  - Live voter turnout percentages and vote distributions rendered with **Chart.js** and data labels.
  - Detailed breakdown by grade level, candidate, and polling table.
- **One-Click Automated Provisioning:**
  - Built-in schema generation that formats, colors, and seeds all required database sheets (`Jurados`, `Configuracion`, `Candidatos`, `Censo`, `Votos`).

### 🛠️ Architecture & Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript (ES6+), Bootstrap 5, Material Icons, Chart.js.
- **Serverless Backend:** Google Apps Script (V8 Engine).
- **Database:** Google Sheets (Relational-style tables).
- **Media Engine:** Google Drive API (Candidate portrait resolution).

---

## 🇪🇸 Versión en Español

### 🚀 Descripción General
Plataforma electoral digital diseñada para modernizar elecciones democráticas escolares e institucionales (Personería, Contraloría, Cabildante). Sustituye los tarjetones físicos en papel por una estación de votación digital táctil, rápida y transparente, garantizando escrutinio inmediato y cero costos de servidor.

### ✨ Funcionalidades Principales
- **Control de Acceso Basado en Roles (RBAC):**
  - **Jurados de Mesa:** Verificación de estudiantes en el censo electoral digital por curso y habilitación segura de la sesión de votación.
  - **Administración / Rectoría:** Monitoreo en vivo de participación, tendencias y escrutinio final de la jornada.
- **Tarjetones Electorales Dinámicos:**
  - Renderizado contextual de candidatos según el nivel educativo del elector (filtro automático Primaria vs. Bachillerato).
  - Algoritmo de resolución de enlaces de Google Drive que convierte fotos compartidas en URLs optimizadas para visualización rápida.
- **Garantías Antifraude y Auditoría:**
  - Bloqueo instantáneo en el censo para impedir doble votación.
  - Trazabilidad completa con registro de fecha/hora, cargo, mesa electoral y curso.
- **Dashboard de Resultados en Tiempo Real:**
  - Gráficos interactivos con **Chart.js** y etiquetas de datos para visualizar porcentajes de participación y resultados por mesa y candidato.
- **Inicialización Automatizada:**
  - Función de configuración que crea y estructura automáticamente todas las hojas de cálculo necesarias en un solo clic.

### 🛠️ Tecnologías Utilizadas
- **Frontend:** HTML5, Bootstrap 5, JavaScript (ES6+), Chart.js, Material Icons.
- **Backend:** Google Apps Script (Motor V8).
- **Base de Datos y Almacenamiento:** Google Sheets API, Google Drive API.

---

## 👨‍💻 Author
Developed by **FORGARJUAN** — *Full-Stack Software Engineer & AI Systems Architect.*
