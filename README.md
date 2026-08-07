# 🛍️ E-Commerce App (Frontend)

Una interfaz de usuario moderna, rápida y responsiva para una tienda en línea, construida con **React**, **TypeScript**, **Vite** y **Tailwind CSS**. Este proyecto forma parte de un **portafolio profesional** orientado a demostrar buenas prácticas en el cliente, manejo de estado global, consumo de APIs y testing automatizado.

---

## 🎯 Objetivo del Proyecto

Demostrar capacidades en el desarrollo Frontend con React moderno:
- Gestión del estado global del carrito de compras mediante React Context y Reducers.
- Integración y consumo de API RESTful con autenticación basada en cookies/JWT.
- Tipado estricto con TypeScript para prevención de errores y mejor mantenibilidad.
- Pruebas unitarias e integración de componentes con Vitest y React Testing Library.

---

## 🛠️ Tecnologías Utilizadas

- **React 18** & **Vite**
- **TypeScript**
- **Tailwind CSS** (estilizado ágil y responsivo)
- **React Router Dom** (rutas dinámicas y protegidas)
- **Vitest** & **Testing Library** (pruebas unitarias e integración)

---

## 📋 Requisitos e Instalación

1. **Clonar e instalar dependencias**:
   ```bash
   cd Frontend
   npm install
   ```
2. **Configurar variables de entorno (`.env`)**:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
3. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```
4. **Ejecutar pruebas unitarias**:
   ```bash
   npm run test
   ```

---

## 📌 Estado Actual y Futuras Mejoras (Out of Scope)

El desarrollo del frontend se da por **finalizado** para fines del portafolio. Cuenta con catálogo de productos, carrito persistente, autenticación y proceso de checkout. En una aplicación de producción completa se podrían agregar funcionalidades como:

- **Perfil de Usuario y Mis Ventas/Compras**: Sección para ver historial de pedidos del usuario autenticado y estado de sus órdenes.
- **CRUD y Gestión de Mis Productos (Vendedor)**: Módulo administrativo en frontend para agregar, editar o eliminar productos en la tienda.
- **Ranking de Mas Vendidos**: Visualización en la página principal de productos destacados o de mayor venta (integrado con métricas del backend).
- **Paginación y Filtros Avanzados**: Filtrado por rango de precios, categorías y ordenamiento dinámico desde el servidor.

