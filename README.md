# Juguetería Arcoíris 🧸

Aplicación web de una **juguetería** que funciona como pequeña tienda online/ecommerce
y, a la vez, como sistema básico de **inventario y ventas**. Todo se ejecuta en el
navegador: no hay backend, base de datos ni servicios externos. Los datos se guardan en
`localStorage`.

> Proyecto listo para ejecutar localmente y subir a GitHub con CI/CD incluido.

---

## ✨ Características

- **Tienda online** con catálogo de 21 productos de ejemplo en 7 categorías.
- **Búsqueda por nombre** y **filtros funcionales**: categoría, rango de precio y
  ordenamiento (precio y nombre).
- **Carrito de compras** persistente (localStorage): agregar, quitar, sumar/restar
  unidades, subtotal y total. Respeta el stock disponible.
- **Checkout / venta**: datos del cliente, método de pago (Efectivo, Tarjeta,
  Yape/Plin), número de pedido, resumen de compra y actualización automática de stock.
- **Panel de inventario**: indicadores (total de productos, stock bajo, agotados, valor
  estimado), tabla con estado por producto y **ventas recientes**.
- **Administración básica**: crear, editar, eliminar productos, modificar stock y precio
  (con confirmación antes de eliminar).
- **Navegación**: `/` (Tienda), `/inventario` y `/ventas` con indicación de sección activa.
- **Diseño responsive** (desktop, tablet, móvil), moderno y amigable con la paleta
  azul / amarillo / rosa / verde de una juguetería.

---

## 🛠️ Tecnologías

| Área          | Tecnología                              |
| ------------- | --------------------------------------- |
| Framework     | React 19                                |
| Lenguaje      | TypeScript                              |
| Build         | Vite 6                                  |
| Estilos       | Tailwind CSS 4                          |
| Iconos        | Lucide React                            |
| Enrutado      | React Router 7                          |
| Tests         | Vitest + Testing Library                |
| Linting       | ESLint 9 (flat config) + typescript-eslint |
| CI/CD         | GitHub Actions                          |
| Persistencia  | localStorage                            |

---

## 📦 Instalación

Requisitos: **Node.js 22 LTS** (o superior) y **npm**.

```bash
# 1. Instalar dependencias
npm install

# 2. (Alternativa en CI, si ya existe package-lock.json)
npm ci
```

## ▶️ Ejecutar en desarrollo

```bash
npm run dev
```

Abre http://localhost:5173 en el navegador. Incluye recarga en caliente.

## ✅ Tests

```bash
npm test          # ejecuta los tests una sola vez
npm run test:watch
```

Los tests cubren la lógica importante:

- Filtrado de productos (`src/utils/__tests__/products.test.ts`)
- Cálculo del carrito y validación de stock (`src/utils/__tests__/cart.test.ts`)
- Total de una venta, número de pedido y descuento de stock (`src/utils/__tests__/sale.test.ts`)
- Persistencia en localStorage (`src/utils/__tests__/storage.test.ts`)

## 🔍 Lint

```bash
npm run lint
```

## 📦 Build de producción

```bash
npm run build        # valida TypeScript y genera la carpeta dist/
npm run preview      # sirve el build localmente para probarlo
```

---

## 🧩 Cómo funciona la aplicación

### El carrito

- Desde la tienda, cada producto tiene el botón **Agregar al carrito**.
- El contador del header muestra el total de artículos; el carrito se abre en un panel
  lateral desde cualquier página.
- Se pueden sumar/restar unidades y eliminar productos. El botón "+" se deshabilita
  cuando se alcanza el stock disponible y nunca se permite superarlo.
- El carrito persiste en `localStorage`: al recargar la página no se pierde.

### El checkout / venta

- En **/ventas** se completan los datos del cliente (nombre, teléfono, email, dirección)
  y se elige el método de pago.
- Al confirmar: se genera un número de pedido (ej. `V-20260615-4321`), se muestra el
  resumen de la compra, se descuenta el stock, se vacía el carrito y la venta se guarda
  en `localStorage`.

### El inventario

- En **/inventario** se ven los indicadores y la tabla de productos con su estado:
  - 🟢 **Disponible**: stock mayor al mínimo.
  - 🟡 **Stock bajo**: stock entre 1 y el mínimo (`minStock`, por defecto 6).
  - 🔴 **Agotado**: sin stock.
- Las acciones por fila permiten **editar** el producto, **ajustar stock** (sumar/quitar)
  y **eliminar** (con confirmación). También se pueden crear productos nuevos.
- Al final de la página se muestran las **ventas recientes**.

### El almacenamiento local

Las claves en `localStorage` usan el prefijo `arcoiris.`:

- `arcoiris.products` → catálogo de productos
- `arcoiris.cart` → carrito de compras
- `arcoiris.sales` → historial de ventas

Para limpiar los datos de prueba: DevTools → Application → Local Storage → borrar.

---

## 🤖 GitHub Actions (CI)

El pipeline `.github/workflows/ci.yml` se ejecuta automáticamente en cada `push` y
`pull_request` a la rama `main`:

1. Corre sobre **Ubuntu** con **Node.js 22 LTS** (con caché de npm).
2. Instala dependencias con `npm ci`.
3. Ejecuta **lint**, **tests** y **build de producción**.
4. El pipeline **falla** si cualquiera de esos pasos falla.

No se usan secretos.

---

## 🚀 Subir a GitHub

```bash
# 1. Inicializar el repositorio (si no existe)
git init
git add .
git commit -m "Initial commit"
git branch -M main

# 2. Conectar el repositorio remoto (reemplaza la URL)
git remote add origin https://github.com/TU_USUARIO/jugueteria-arcoiris.git

# 3. Subir
git push -u origin main
```

Al hacer el push, el workflow de **GitHub Actions** se ejecutará automáticamente.
Puedes ver el estado en la pestaña **Actions** del repositorio.

---

## 📁 Estructura del proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── cart/            # Carrito y fila de producto
│   ├── checkout/        # Formulario de pago y resumen
│   ├── inventory/       # Tabla, indicadores y modales de administración
│   ├── layout/          # Header, footer y layout general
│   ├── product/         # Tarjeta e imagen de producto
│   ├── sales/           # Historial de ventas
│   └── ui/              # Botones, modales, toasts, inputs, etc.
├── context/             # Estado global (StoreProvider + useStore)
├── data/                # Datos mock: categorías, productos, métodos de pago
├── hooks/               # Hook useLocalStorage
├── pages/               # Tienda, Inventario y Ventas
├── test/                # Setup de testing
├── types/               # Tipos TypeScript (Product, CartItem, Sale, ...)
└── utils/               # Lógica pura: carrito, filtros, ventas, storage (+ tests)
```

## 📝 Notas

- Las imágenes de los productos usan **emojis como placeholder**. Cada producto tiene la
  propiedad `image` (vacía por defecto): basta con asignar una URL para mostrar la
  fotografía real (ver `src/data/products.ts`).
- Los precios se muestran en **soles peruanos (S/)**.
- No se incluye autenticación, backend, base de datos ni pagos reales a propósito; es
  una versión simple y fácil de ampliar.
