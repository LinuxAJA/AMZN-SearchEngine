# 🏗️ Estructura de Carpetas - AMZN-SearchEngine

## Árbol Completo del Proyecto

```
AMZN-SearchEngine/
│
├── 📁 frontend/                          # Aplicación frontend (HTML/CSS/JS puro)
│   ├── 📁 index.html                     # Página principal
│   ├── 📁 pages/                         # Páginas HTML
│   │   ├── buscar.html                   # Página de búsqueda
│   │   ├── resultados.html               # Página de resultados
│   │   ├── comparar.html                 # Página de comparación
│   │   ├── guardados.html                # Página de productos guardados
│   │   └── detalles.html                 # Página de detalles del producto
│   │
│   ├── 📁 css/                           # Estilos CSS
│   │   ├── main.css                      # Estilos globales
│   │   ├── variables.css                 # Variables CSS (colores, tipografía)
│   │   ├── layout.css                    # Estilos de layout/grid
│   │   ├── componentes.css               # Estilos de componentes reutilizables
│   │   ├── busqueda.css                  # Estilos de barra de búsqueda
│   │   ├── resultados.css                # Estilos de tarjetas de productos
│   │   ├── comparador.css                # Estilos de tabla comparativa
│   │   ├── guardados.css                 # Estilos de productos guardados
│   │   └── responsive.css                # Media queries responsive
│   │
│   ├── 📁 js/                            # Scripts JavaScript
│   │   ├── main.js                       # Archivo principal (inicialización)
│   │   │
│   │   ├── 📁 modules/                   # Módulos funcionales
│   │   │   ├── buscador.js               # Lógica de búsqueda
│   │   │   ├── filtros.js                # Lógica de filtrado
│   │   │   ├── categorizacion.js         # Lógica de categorización
│   │   │   ├── comparador.js             # Lógica de comparación
│   │   │   └── resultados.js             # Manejo de resultados
│   │   │
│   │   ├── 📁 storage/                   # Gestión de almacenamiento local
│   │   │   ├── localStorage.js           # Funciones de LocalStorage
│   │   │   └── sync.js                   # Sincronización de datos
│   │   │
│   │   ├── 📁 api/                       # Comunicación con backend
│   │   │   ├── client.js                 # Cliente HTTP/Fetch
│   │   │   └── endpoints.js              # URLs de endpoints
│   │   │
│   │   ├── 📁 utils/                     # Utilidades y helpers
│   │   │   ├── validador.js              # Validaciones
│   │   │   ├── formateador.js            # Formateo de datos
│   │   │   ├── manipuladorDOM.js         # Operaciones con DOM
│   │   │   └── constantes.js             # Constantes globales
│   │   │
│   │   └── 📁 ui/                        # Componentes de UI
│   │       ├── tarjeta-producto.js       # Componente tarjeta
│   │       ├── modal.js                  # Componente modal
│   │       ├── filtros-ui.js             # UI de filtros
│   │       └── tabla-comparativa.js      # Tabla de comparación
│   │
│   ├── 📁 assets/                        # Recursos estáticos
│   │   ├── 📁 images/                    # Imágenes
│   │   │   ├── logo.png
│   │   │   ├── iconos/
│   │   │   └── placeholders/
│   │   │
│   │   └── 📁 fonts/                     # Fuentes personalizadas
│   │
│   └── 📁 templates/                     # Plantillas HTML reutilizables
│       ├── producto-tarjeta.html
│       ├── modal-template.html
│       └── comparador-template.html
│
├── 📁 backend/                           # Servidor Node.js
│   ├── 📁 src/
│   │   ├── 📁 routes/                    # Rutas de API
│   │   │   ├── productos.js              # Rutas de búsqueda/filtrado
│   │   │   ├── comparador.js             # Rutas de comparación
│   │   │   ├── guardados.js              # Rutas de favoritos
│   │   │   └── categorias.js             # Rutas de categorías
│   │   │
│   │   ├── 📁 controllers/               # Controladores
│   │   │   ├── productosController.js
│   │   │   ├── comparadorController.js
│   │   │   └── categoriasController.js
│   │   │
│   │   ├── 📁 services/                  # Lógica de negocios
│   │   │   ├── amazonService.js          # Integración con API Amazon
│   │   │   ├── filtroService.js          # Filtrado de productos
│   │   │   ├── categorizacionService.js  # Categorización
│   │   │   └── comparadorService.js      # Comparación de productos
│   │   │
│   │   ├── 📁 middleware/                # Middlewares
│   │   │   ├── validacion.js             # Validación de requests
│   │   │   ├── errorHandler.js           # Manejo de errores
│   │   │   └── logging.js                # Logging
│   │   │
│   │   ├── 📁 utils/                     # Utilidades backend
│   │   │   ├── logger.js                 # Logger
│   │   │   ├── formateador.js            # Formateo de respuestas
│   │   │   └── constantes.js
│   │   │
│   │   ├── 📁 config/                    # Configuración
│   │   │   ├── database.js               # Config de BD (futura)
│   │   │   ├── amazon.js                 # Config de API Amazon
│   │   │   └── env.js                    # Variables de entorno
│   │   │
│   │   └── app.js                        # Aplicación principal Express
│   │
│   ├── 📁 tests/                         # Tests unitarios
│   │   ├── productos.test.js
│   │   ├── filtros.test.js
│   │   └── comparador.test.js
│   │
│   ├── .env.example                      # Variables de entorno ejemplo
│   ├── .env                              # Variables de entorno (no pushear)
│   ├── package.json
│   ├── package-lock.json
│   └── server.js                         # Punto de entrada del servidor
│
├── 📁 docs/                              # Documentación
│   ├── README.md                         # Documentación general
│   ├── INSTALACION.md                    # Guía de instalación
│   ├── API.md                            # Documentación de API
│   ├── ARQUITECTURA.md                   # Descripción de arquitectura
│   └── GUIA-DESARROLLO.md                # Guía para desarrolladores
│
├── 📁 database/                          # Scripts de BD (para el futuro)
│   ├── schema.sql                        # Esquema de BD
│   └── seeds.sql                         # Datos de ejemplo
│
├── .gitignore                            # Git ignore
├── .env.example                          # Variables de entorno ejemplo global
├── package.json                          # Dependencias del proyecto completo
├── README.md                             # Documentación raíz
└── LICENSE                               # Licencia del proyecto
```

---

## 📋 Descripción de Directorios Principales

### **🎨 Frontend/**
- **Código cliente vanilla (HTML/CSS/JS)**
- Consumo de API del backend
- Gestión de LocalStorage
- Interfaz de usuario responsiva

### **⚙️ Backend/**
- **Servidor Node.js con Express**
- Rutas REST API
- Integración con API Amazon
- Lógica de filtrado y categorización
- Comparación de productos

### **📚 Docs/**
- Documentación del proyecto
- Guías de uso y desarrollo

### **🗄️ Database/**
- Scripts SQL para futura implementación de BD

---

## 📊 Organización por Funcionalidades

### **1️⃣ Búsqueda y Filtrado**
```
Frontend:
  - js/modules/buscador.js
  - js/modules/filtros.js
  - css/busqueda.css

Backend:
  - routes/productos.js
  - services/filtroService.js
```

### **2️⃣ Categorización**
```
Frontend:
  - js/modules/categorizacion.js
  - css/resultados.css

Backend:
  - services/categorizacionService.js
  - routes/categorias.js
```

### **3️⃣ Guardado en LocalStorage**
```
Frontend:
  - js/storage/localStorage.js
  - pages/guardados.html
  - css/guardados.css

Backend:
  - routes/guardados.js (opcional para sincronización)
```

### **4️⃣ Comparación de Productos**
```
Frontend:
  - js/modules/comparador.js
  - pages/comparar.html
  - css/comparador.css
  - js/ui/tabla-comparativa.js

Backend:
  - routes/comparador.js
  - services/comparadorService.js
```

---

## 🚀 Puntos de Entrada

| Punto | Archivo | Descripción |
|-------|---------|-------------|
| Frontend | `frontend/index.html` | Página principal |
| Backend | `backend/server.js` | Servidor Node.js |
| Main JS | `frontend/js/main.js` | Inicialización frontend |

---

## 💾 Flujo de Datos

```
Usuario (Frontend)
    ↓
frontend/js/modules/* (Lógica)
    ↓
frontend/js/api/client.js (HTTP)
    ↓
backend/routes/* (Rutas)
    ↓
backend/services/* (Lógica)
    ↓
Amazon API
    ↓
Respuesta → LocalStorage → UI
```

---

## 📝 Próximos Pasos

1. **Crear estructura base** con todas las carpetas
2. **Configurar package.json** tanto en backend como frontend
3. **Instalar dependencias** (Express, Fetch/Axios, etc)
4. **Crear archivos de configuración** (.env, constantes)
5. **Implementar módulos** en orden de prioridad
6. **Escribir documentación** mientras se desarrolla

