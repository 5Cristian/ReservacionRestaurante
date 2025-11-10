# 🍽️ Reservación Restaurante

**Proyecto Final - Desarrollo Web**  
Sistema completo (Backend + Frontend) para la gestión de **reservas de mesas, clientes y disponibilidad** en un restaurante familiar.

---

## 🚀 Características principales

✅ Gestión de **mesas** (número, capacidad y ubicación).  
✅ Registro y administración de **reservas** con validación de horario y capacidad.  
✅ Control de **clientes** con historial de reservas.  
✅ Sistema de **autenticación y roles** (admin / staff).  
✅ Integración con **correo electrónico** para confirmación de registro.  
✅ Arquitectura modular y código limpio (NestJS + React).  

---

## 🧩 Tecnologías utilizadas

### 🖥️ **Backend**
- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT y Passport](https://docs.nestjs.com/security/authentication)
- [Nodemailer](https://nodemailer.com/) para envío de correos
- Arquitectura modular (controladores, servicios, entidades)

### 💻 **Frontend**
- [React + Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)
- [React Router](https://reactrouter.com/)
- [Context API](https://react.dev/reference/react/useContext) para autenticación global

---

## ⚙️ Instalación y ejecución

### 🧠 **Requisitos previos**
Asegúrate de tener instalado:
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)

---

### 🖥️ **1. Clonar el repositorio**

git clone https://github.com/5Cristian/ReservacionRestaurante.git
cd ReservacionRestaurante
🧩 2. Configurar el backend

cd backend
npm install

Crea un archivo .env con tus credenciales:
--------------------------------------------------
env
# === App ===
PORT=4000
OPENING_HOUR=11
CLOSING_HOUR=22
RESERVATION_DURATION_MIN=90

# === Database (PostgreSQL) ===
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=1234
DB_DATABASE=restaurant

# === Email (Gmail App Password) ===
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicación
EMAIL_FROM="Reservas Restaurante <tu_correo@gmail.com>"

# === JWT ===
JWT_SECRET=tu_secreto_seguro
JWT_EXPIRES=1d

# === Environment ===
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MAIL_ENABLED=true
-------------------------------------------------------------


Ejecuta el servidor:

npm run start:dev
El backend se ejecutará en:
👉 http://localhost:4000

💻 3. Configurar el frontend
cd ../frontend
npm install
npm run dev
El frontend se ejecutará en:
👉 http://localhost:5173

📁 Estructura del proyecto

restaurant-reservations/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── customers/
│   │   ├── reservations/
│   │   ├── tables/
│   │   ├── mail/
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── lib/
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── .gitignore
└── README.md
🧠 Arquitectura
Frontend: SPA (Single Page Application) con React y Vite.

Backend: API REST modular con NestJS.

Base de datos: PostgreSQL.

Comunicación: HTTP + JSON.

Autenticación: JWT.

### 🖥️ **4. Crear Base de datos **
BD= restaurant

👤 Autor
Desarrollado por Cristian Claudio	
📧 cristianclaudio60@gmail.com
💼 GitHub - 5Cristiano

📜 Licencia
Este proyecto fue desarrollado con fines educativos como parte del Examen Final del curso Desarrollo Web en la Universidad Mariano Gálvez de Guatemala.
