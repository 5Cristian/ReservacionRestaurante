# Restaurant Reservations — Full Stack App (Backend + Frontend)

Sistema completo para gestionar mesas, reservas y clientes de un restaurante familiar.

## 🧩 Tecnologías
- **Backend:** Node.js, Express, Prisma ORM, SQLite (por defecto) — fácil de cambiar a MySQL/PostgreSQL.
- **Frontend:** React + Vite, Axios, TailwindCSS.
- **Extras opcionales:** Nodemailer (confirmaciones por correo), node-cron (recordatorios), reportes simples.

> Por simplicidad, las reservas duran **90 minutos**. El horario laboral por defecto es **11:00–22:00** (configurable).

---

## 🚀 Ejecución Rápida

### 1) Backend
```bash
cd backend
cp .env.example .env   # Opcional editar SMTP y DB
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```
- Servidor por defecto en: **http://localhost:4000**
- Documentación mínima de endpoints al final del README.

### 2) Frontend
```bash
cd ../frontend
npm install
npm run dev
```
- UI por defecto en: **http://localhost:5173**

> La app asume el backend en `http://localhost:4000/api`. Puedes cambiarlo en `frontend/src/lib/api.js`.

---

## 🗄️ Base de Datos
Prisma usa SQLite por defecto (archivo `dev.db`). Para **MySQL** o **PostgreSQL**:
1. Cambia `DATABASE_URL` en `.env` del backend. Ejemplos:
   - MySQL: `mysql://user:pass@localhost:3306/restaurant`
   - Postgres: `postgresql://user:pass@localhost:5432/restaurant?schema=public`
2. Ejecuta:
```bash
npx prisma migrate deploy
npx prisma db seed
```

---

## 🔐 Validaciones Clave
- No permitir doble reserva para **la misma mesa** y **horario solapado** (ventana = 90 minutos).
- Validar **capacidad** de la mesa vs **número de personas**.
- Bloquear reservas fuera de **horarios laborales** (11:00–22:00).
- Cambios de estado: `CONFIRMED | CANCELLED`.

---

## 📊 Consultas Especiales (API)
- Disponibilidad de mesas por fecha/hora: `GET /api/availability?date=YYYY-MM-DD&time=HH:mm`
- Reservas del día: `GET /api/reports/reservations/today?date=YYYY-MM-DD`
- Historial de cliente: `GET /api/customers/:id/history`
- Ocupación (día/semana): `GET /api/reports/occupancy?range=day|week&date=YYYY-MM-DD`

---

## 🔔 Notificaciones (Opcional)
Configura SMTP en `.env` para que `reservations.controller` envíe confirmación.
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`

Recordatorios automáticos (previos a la reserva) usan `node-cron` si `ENABLE_CRON=true`.

---

## 📦 Postman
Importa `./postman/RestaurantReservations.postman_collection.json`.

---

## 📚 Endpoints (resumen)
- **Mesas**
  - `GET /api/tables`
  - `POST /api/tables`
  - `PUT /api/tables/:id`
  - `DELETE /api/tables/:id`
- **Clientes**
  - `GET /api/customers`
  - `POST /api/customers`
  - `GET /api/customers/:id/history`
- **Reservas**
  - `GET /api/reservations`
  - `POST /api/reservations` (crea + valida reglas)
  - `PUT /api/reservations/:id`
  - `POST /api/reservations/:id/cancel`
- **Consultas**
  - `GET /api/availability?date=YYYY-MM-DD&time=HH:mm`
  - `GET /api/reports/reservations/today?date=YYYY-MM-DD`
  - `GET /api/reports/occupancy?range=day|week&date=YYYY-MM-DD`

---

## 📝 Notas de Diseño
- Duración de reserva configurable (`RESERVATION_DURATION_MIN=90`).
- Horario laboral configurable (`OPENING_HOUR=11`, `CLOSING_HOUR=22`).
- Frontend actualiza datos cada 10s (polling sencillo).
- Sin autenticación por defecto, fácilmente extensible con JWT.
