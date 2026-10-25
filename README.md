# 🥓 Charcutería — Sistema de Ventas

Sistema web de ventas para una charcutería. Incluye dos roles (**administrador** y **vendedor**), gestión de productos por peso o unidad, categorías dinámicas, cierre de caja diario y mensual, y autenticación real con Supabase.

---

## 📋 ¿Qué hace?

- **Login único** que detecta el rol del usuario y redirige al panel correspondiente.
- **Vendedor**: registra ventas con productos por **gramos** o **unidad**, cobra en Bs. calculando automáticamente según la tasa BCV del día.
- **Administrador**: gestiona productos, categorías, usuarios, ve cierres diarios y mensuales con ganancias estimadas.
- **Control de stock** automático: se descuenta al vender y se devuelve al cancelar.
- **Métodos de pago**: Efectivo Bs., Pago Móvil, Punto de Venta y Fiado.
- **Tasa BCV** obtenida desde APIs públicas con caché y respaldo.
- **Optimizado para móvil**: tablas se convierten en cards apilables, botones táctiles.

---

## 👥 Roles

### 🧑‍💼 Vendedor

- Ve solo los productos **disponibles y con stock**.
- Agrega productos al carrito en **gramos** (jamo, queso) o **unidades** (aceitunas).
- Autocompleta el nombre del cliente al escribir su cédula (si ya compró antes).
- Elige método de pago y registra la venta.
- Puede **editar una venta** ya hecha (revierte y vuelve a aplicar el stock).
- Ve las **ventas del día** en tiempo real.

### ⚙️ Administrador

- **Productos**: crear, editar, activar/desactivar, eliminar. Maneja `precioCompra`, `precioVenta`, `stock` y `tipoVenta`.
- **Categorías**: crear, editar, activar/desactivar, eliminar.
- **Usuarios**: crear nuevos usuarios (admin o vendedor), activar/desactivar, cambiar rol.
- **Ventas**: filtrar por estado, método de pago, fecha y cédula. Cobrar fiados, cancelar ventas (devuelve stock).
- **Cierre de Caja**:
  - Ventas del día en Bs. y USD.
  - Ganancia estimada (ingreso − costo).
  - Fiado pendiente.
  - Producto más vendido.
  - Productos con stock bajo.
  - Detalle venta por venta.
- **Cierre Mensual**: selecciona un mes y ve totales, ganancia, fiado, promedio por venta y detalle día por día.

---

## 🛠️ Tecnologías

| Capa | Tecnología |
|------|-----------|
| Lenguaje | TypeScript |
| Frontend | HTML5, CSS3, Bootstrap 5 |
| Backend / DB | **Supabase** (PostgreSQL + Auth + RLS) |
| Tasa BCV | `ve.dolarapi.com`, `pydolarve.org`, `open.er-api.com` (fallbacks) |
| Deploy | Vercel |
| Arquitectura | **MVC estricto** (Modelos, Vistas, Controladores) |

---

## 🏗️ Arquitectura MVC
