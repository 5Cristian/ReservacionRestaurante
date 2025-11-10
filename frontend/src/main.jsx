// src/main.jsx
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import AppLayout from "./pages/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";

// Lazy
const Dashboard        = lazy(() => import("./pages/Dashboard"));
const ReservationsPage = lazy(() => import("./pages/ReservationsPage"));
const TablesPage       = lazy(() => import("./pages/TablesPage"));
const CustomersPage    = lazy(() => import("./pages/CustomersPage"));
const LoginRegister    = lazy(() => import("./pages/LoginRegister"));
const VerifyEmail      = lazy(() => import("./pages/VerifyEmail"));
const OAuthCallback    = lazy(() => import("./pages/OAuthCallback"));
const Empleados        = lazy(() => import("./pages/Empleados"));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div style={{ padding: 24 }}>Cargando…</div>}>
          <Routes>
            {/* ====== PÚBLICAS ====== */}
            <Route path="/login" element={<LoginRegister />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />

            {/* ====== PRIVADAS (con AppLayout) ====== */}
            <Route element={<AppLayout />}>
              {/* customer, staff, admin */}
              <Route
                index
                element={
                  <ProtectedRoute roles={['customer','staff','admin']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reservar"
                element={
                  <ProtectedRoute roles={['customer','staff','admin']}>
                    <ReservationsPage />
                  </ProtectedRoute>
                }
              />

              {/* solo staff y admin */}
              <Route
                path="/clientes"
                element={
                  <ProtectedRoute roles={['staff','admin']}>
                    <CustomersPage />
                  </ProtectedRoute>
                }
              />

              {/* solo admin */}
              <Route
                path="/mesas"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <TablesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/empleados"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <Empleados />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* ====== CATCH-ALL ====== */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

