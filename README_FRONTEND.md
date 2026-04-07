# Frontend Handoff

Este archivo resume el estado actual del frontend de `Muebleria` para que cualquier persona o Codex que abra el repo entienda rapido que ya esta hecho, como esta organizado y que falta conectar con backend.

## Objetivo actual

Se dejo armada una base funcional del frontend para una tienda de muebles, sin depender todavia del backend.

El flujo actual es:

1. Home
2. Catalogo
3. Detalle de producto
4. Carrito

Todavia no hay conexion real con base de datos ni checkout real.

## Estado actual

El frontend ya tiene:

- Home visual funcional
- Catalogo de productos
- Menu desplegable de categorias en `Productos`
- Detalle individual de producto
- Carrito visual con cantidades
- Navegacion entre pantallas
- Datos mockeados para seguir trabajando sin backend

## Rutas del frontend

- `/` -> Home
- `/productos` -> Catalogo completo
- `/productos?categoria=Living` -> Catalogo filtrado por categoria
- `/productos?categoria=Comedor` -> Catalogo filtrado por categoria
- `/productos?categoria=Dormitorio` -> Catalogo filtrado por categoria
- `/productos/:id` -> Detalle del producto
- `/carrito` -> Carrito

## Archivos importantes

- `client/src/main.jsx`
  Arranca la app e importa estilos globales.

- `client/src/App.jsx`
  Es el cerebro del frontend. Define:
  - datos mockeados
  - rutas
  - carrito
  - navegacion
  - filtrado por categoria

- `client/src/components/Header.jsx`
  Header con:
  - logo
  - links principales
  - dropdown de `Productos`
  - acceso al carrito

- `client/src/components/Footer.jsx`
  Footer base con datos de contacto.

- `client/src/pages/HomePage.jsx`
  Portada principal.

- `client/src/pages/CatalogPage.jsx`
  Catalogo y botones de categoria.

- `client/src/pages/ProductDetailPage.jsx`
  Ficha individual del producto.

- `client/src/pages/CartPage.jsx`
  Carrito visual con cambio de cantidades y resumen.

- `client/src/index.css`
  Estilos globales de home, catalogo, detalle y carrito.

- `client/src/css/header.css`
  Estilos del header, dropdown y popup del carrito.

## Estructura de producto que hoy espera el front

Esta es la forma de producto que hoy usa el frontend mockeado:

```js
{
  id: "sillon-chenille-arena",
  name: "Sillon Chenille Arena",
  category: "Living",
  price: 480000,
  priceLabel: "$ 480.000",
  description: "Sillon de tres cuerpos con tono calido y presencia protagonista.",
  material: "Madera maciza y tapizado chenille",
  size: "2,10 m x 0,90 m",
  stock: "Disponible a pedido",
  image: heroImage
}
```

## Campos que el backend deberia contemplar

Para conectar el frontend sin rehacer logica, conviene que el backend entregue algo equivalente a:

- `id`
- `name`
- `category`
- `price`
- `description`
- `material`
- `size`
- `stock`
- `image`

Notas:

- `price` conviene que venga como numero.
- `priceLabel` no hace falta que venga desde backend; si hace falta, se puede formatear en frontend.
- `image` puede ser una URL real.

## Categorias actuales

Por ahora el frontend usa 3 categorias:

- `Living`
- `Comedor`
- `Dormitorio`

Estas categorias estan en:

- dropdown del header
- filtros del catalogo
- datos mockeados

Si cambian las categorias reales, hay que alinear frontend y backend.

## Carrito actual

El carrito hoy vive solo en frontend con `useState`.

Hace esto:

- agrega productos
- suma cantidad si ya existe
- permite bajar cantidad
- elimina producto si la cantidad llega a 0
- vacia el carrito
- calcula total estimado

No hace esto todavia:

- persistencia
- sesion de usuario
- guardado en base de datos
- orden de compra real
- checkout

## Cosas importantes que ya se limpiaron

Se removio del flujo activo:

- `PruebaPage.jsx`
- `asdasdasdasd.jsx`

Esos archivos eran pruebas o restos de otra base y no deben considerarse parte del flujo principal actual.

## Decisiones de trabajo que ya se tomaron

- Avanzar frontend sin esperar backend terminado.
- Usar datos mockeados para poder diseñar y probar el recorrido.
- Mantener una estructura de producto lo mas estable posible para facilitar la conexion posterior.
- Construir primero el flujo base de tienda antes de login/admin.

## Pendientes recomendados

Orden sugerido de trabajo:

1. Mejorar catalogo
2. Revisar imagenes reales por categoria o producto
3. Definir con backend la estructura final del producto
4. Conectar `/productos` a API real
5. Conectar detalle por id a API real
6. Evaluar login/admin
7. Definir si la compra final sera checkout, formulario o WhatsApp

## Si otro Codex toma este proyecto

Antes de tocar el frontend:

1. Revisar `client/src/App.jsx`
2. Revisar `README_FRONTEND.md`
3. No reactivar archivos de prueba viejos
4. Mantener consistencia con las categorias actuales o actualizar todo junto
5. Si cambia la forma del producto, actualizar frontend completo de forma coherente

## Comandos utiles

Dentro de `client`:

```bash
npm install
npm run dev
npm run lint
```

## Ultima observacion

El frontend ya esta util como base visual y de navegacion. Lo que falta no es estructura, sino integracion real con backend y definicion compartida de datos.
