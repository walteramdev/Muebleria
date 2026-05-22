export const categoryDefinitions = [
  {
    name: "Living",
    shortDescription: "Piezas para recibir, descansar y dar identidad al ambiente.",
    subcategories: ["Sillones", "Mesas ratonas", "Consolas"],
  },
  {
    name: "Comedor",
    shortDescription: "Mesas y sillas pensadas para compartir todos los dias.",
    subcategories: ["Mesas", "Sillas", "Bahiuts"],
  },
  {
    name: "Dormitorio",
    shortDescription: "Soluciones calidas para descansar y ordenar mejor.",
    subcategories: ["Respaldos", "Mesas de luz", "Comodas"],
  },
];

export const productTypes = categoryDefinitions.map((category) => category.name);

export const featuredProducts = [
  {
    _id: "sillon-chenille-arena",
    barcode: "779000000001",
    name: "Sillon Chenille Arena",
    category: "Living",
    subcategory: "Sillones",
    price: 480000,
    description: "Sillon de tres cuerpos con tono calido y presencia protagonista.",
    stock: 2,
    brand: "Chenille",
    supplier: "Taller Central",
    features: {
      materiales: "Madera maciza y tapizado chenille",
      medidas: "2,10 m x 0,90 m",
    },
    imagenUrl:
      "https://images.unsplash.com/photo-1759722668385-90006d9c7aa7?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
  },
  {
    _id: "consola-olmo-claro",
    barcode: "779000000002",
    name: "Consola Olmo Claro",
    category: "Living",
    subcategory: "Consolas",
    price: 268000,
    description: "Consola ligera y funcional para recibidor o apoyo decorativo.",
    stock: 4,
    brand: "Chenille",
    supplier: "Taller Central",
    features: {
      materiales: "Olmo claro con terminacion mate",
      medidas: "1,40 m x 0,38 m",
    },
    imagenUrl:
      "https://images.unsplash.com/photo-1758915753395-a5dddea1d813?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
  },
  {
    _id: "mesa-noguera-central",
    barcode: "779000000003",
    name: "Mesa Noguera Central",
    category: "Comedor",
    subcategory: "Mesas",
    price: 620000,
    description: "Mesa de madera pensada para reuniones, uso diario y larga duracion.",
    stock: 3,
    brand: "Chenille",
    supplier: "Taller Central",
    features: {
      materiales: "Noguera lustrada",
      medidas: "1,80 m x 0,90 m",
    },
    imagenUrl:
      "https://images.unsplash.com/photo-1758977405163-f2595de08dfe?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
  },
  {
    _id: "silla-nordica-roble",
    barcode: "779000000004",
    name: "Silla Nordica Roble",
    category: "Comedor",
    subcategory: "Sillas",
    price: 126000,
    description: "Silla de linea simple con respaldo curvo y presencia serena.",
    stock: 8,
    brand: "Chenille",
    supplier: "Taller Central",
    features: {
      materiales: "Roble y asiento tapizado",
      medidas: "0,48 m x 0,52 m",
    },
    imagenUrl:
      "https://images.unsplash.com/photo-1758977405163-f2595de08dfe?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
  },
  {
    _id: "respaldo-siena",
    barcode: "779000000005",
    name: "Respaldo Siena",
    category: "Dormitorio",
    subcategory: "Respaldos",
    price: 215000,
    description: "Respaldo tapizado para sumar textura, abrigo visual y caracter.",
    stock: 4,
    brand: "Chenille",
    supplier: "Tapiceria Norte",
    features: {
      materiales: "Tapizado con estructura reforzada",
      medidas: "1,60 m x 1,20 m",
    },
    imagenUrl:
      "https://images.unsplash.com/photo-1734965158024-d7419f9260b7?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
  },
  {
    _id: "mesa-luz-bruma",
    barcode: "779000000006",
    name: "Mesa de Luz Bruma",
    category: "Dormitorio",
    subcategory: "Mesas de luz",
    price: 154000,
    description: "Mesa compacta con cajon y estante abierto para uso diario.",
    stock: 5,
    brand: "Chenille",
    supplier: "Tapiceria Norte",
    features: {
      materiales: "Madera paraiso laqueada",
      medidas: "0,52 m x 0,38 m",
    },
    imagenUrl:
      "https://images.unsplash.com/photo-1734965158024-d7419f9260b7?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
  },
];
