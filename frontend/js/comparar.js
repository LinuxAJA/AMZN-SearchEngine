// Configuración de la URL del backend y estado global con objetos de la clase Product
const BACKEND_URL = "http://localhost:3000";
let productosAComparar = [];
let opcionesCategoria = [];
let opcionesProductos = [];

// Captura de los elementos interactivos del HTML (DOM)
const tablaContenido = document.getElementById("tabla-matriz-contenido");
const selectorCategorias = document.getElementById("selector-categoria");
const loadingSpinnerComp = document.getElementById("loadingSpinnerComparar");

// Elementos del proceso de añadir producto
// Btn Añadir Producto
const openBtn = document.getElementById('open-btn');
// Modal decorativo fondo oscuro
const overlay = document.getElementById('modal-overlay');
// Modal Añadir Producto
const modalContainer = document.getElementById('modal-container');
// Btn Cerrar Modal
const closeModalBtn = document.getElementById('close-modal-btn');

const opcionesProductosGrid = document.getElementById('opciones-productos-grid');
const searchInput = document.getElementById('search-input');
const searchForm = document.getElementById('search-form');

// Función para ABRIR
function openModal() {
  // 1. Lo hacemos visible con opacidad
  overlay.classList.remove('opacity-0', 'pointer-events-none');
  overlay.classList.add('opacity-100', 'pointer-events-auto');

  // 2. Mostrar Ventana Central (Efecto Fade-In + Zoom-In suave)
  modalContainer.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
  modalContainer.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');

  // 3. Accesibilidad: indicamos que ya no está oculto
  overlay.setAttribute('aria-hidden', 'false');
}

// Función para CERRAR
function closeModal() {
  // 1. Lo desvanecemos y bloqueamos interacciones
  overlay.classList.remove('opacity-100', 'pointer-events-auto');
  overlay.classList.add('opacity-0', 'pointer-events-none');

  // 2. Ocultar Ventana Central (Efecto Fade-Out + Zoom-Out suave)
  modalContainer.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
  modalContainer.classList.add('opacity-0', 'scale-95', 'pointer-events-none');

  // 3. Accesibilidad: indicamos que vuelve a estar oculto
  overlay.setAttribute('aria-hidden', 'true');
}

/**
  * Resuelve y retorna los datos crudos del producto inicial.
  * Intenta leer desde LocalStorage; si no existe, consulta el ID 1 a la API.
  * @returns {Promise<Object>} Datos crudos del producto.
 */
async function obtenerDatosProductoInicial() {
  const productoInicialGuardado = localStorage.getItem("producto_inicial_comparar");

  // Caso A: Los datos ya existen de forma local
  if (productoInicialGuardado) {
    return JSON.parse(productoInicialGuardado);
  }

  // Caso B: Plan de respaldo (No hay datos locales, consultamos servidor)
  console.log("No hay producto en localStorage. Solicitando ID 1 a la API...");

  try {
    const productoApi = await window.FakeStoreAPI.obtenerProductoPorId(1);

    // Guardamos de inmediato en localStorage para acelerar futuras recargas
    localStorage.setItem("producto_inicial_comparar", JSON.stringify(productoApi));

    return productoApi;
  } catch (error) {
    // Relanzamos el error para que el inicializador controle la redirección visual
    throw error;
  }
}

async function cargarOpcionesDeCategoria() {
  if (loadingSpinnerComp) loadingSpinnerComp.classList.remove("hidden");
  try {
    const datos = await window.FakeStoreAPI.obtenerCategorias();
    opcionesCategoria = datos;
    llenarSelectorOpciones();
  } catch (error) {
    console.error("Error al cargar la categoría:", error);
  } finally {
    if (loadingSpinnerComp) loadingSpinnerComp.classList.add("hidden");
  }
}

/**
  * Coordina la búsqueda en la API de los productos de una categoría 
  * y gestiona los estados de carga en la interfaz.
  * @param {string} categoria - Nombre de la categoría en inglés.
*/
async function actualizarComparadorPorCategoria(categoria) {
  // Activamos un indicador de carga visual opcional mientras viajan los datos
  if (loadingSpinnerComp) loadingSpinnerComp.classList.remove("hidden");

  try {
    // Consultamos la API los productos pertenecientes a esa categoría
    // Usamos la función expuesta globalmente en tu objeto de la API
    const productosDeCategoria = await window.FakeStoreAPI.obtenerProductosPorCategoria(categoria);

    // Validación de seguridad: Verificamos que la API haya devuelto al menos un producto
    if (productosDeCategoria && productosDeCategoria.length > 0) {
      const primerProducto = productosDeCategoria[0];
      establecerNuevoProductoInicial(primerProducto, categoria);
    } else {
      alert("No se encontraron productos en la categoría seleccionada.");
    }
  } catch (error) {
    console.error("Error al cambiar el producto inicial por categoría:", error);
    alert("Ocurrió un error al obtener el producto de la categoría seleccionada.");
  } finally {
    if (loadingSpinnerComp) loadingSpinnerComp.classList.add("hidden");
  }
}

/* Llama a la API para traer todos los productos que compartan la misma categoría*/
async function cargarElementosDeMismaCategoria(categoria) {
  if (loadingSpinnerComp) loadingSpinnerComp.classList.remove("hidden");
  try {
    // Usa la función de api.js para obtener los productos por su categoría
    const datos = await window.FakeStoreAPI.obtenerProductosPorCategoria(categoria);
    opcionesProductos = datos;
    renderizarElementosAComparar()
  } catch (error) {
    console.error("Error al cargar la categoría:", error);
  } finally {
    if (loadingSpinnerComp) loadingSpinnerComp.classList.add("hidden");
  }
}

/*Envía el objeto de tipo Product por método POST al servidor de Node.js*/
async function guardarFavoritoEnNode(id) {
  const producto = productosAComparar.find(p => p.id === id);
  if (!producto) return;

  try {
    // Al enviar el objeto 'producto' en JSON.stringify(), se ejecuta automáticamente
    // el método .toJSON() interno de la clase Product.js para estructurar los datos
    const response = await fetch(`${BACKEND_URL}/product`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto)
    });

    if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);

    // Recibe la confirmación exitosa del backend
    const respuestaServidor = await response.json();
    alert(`¡Guardado Exitoso! Confirmado por el servidor: ${respuestaServidor.message || 'Objeto persistido'}`);
  } catch (error) {
    console.error("Fallo de conexión con el backend:", error);
    alert("No se pudo conectar con el servidor local de Node.js en el puerto 3000.");
  }
}

async function aplicarFiltros(categoria) {
  try {
    // Obtener la base de datos limpia llamando al objeto de api.js
    let productosBase = await window.FakeStoreAPI.obtenerProductosPorCategoria(categoria);
    // Aplicar filtro por cuadro de texto de búsqueda si contiene algo
    const termino = searchInput.value.toLowerCase().trim();
    if (termino !== "") {
      productosBase = productosBase.filter(producto =>
        producto.title.toLowerCase().includes(termino) ||
        producto.description.toLowerCase().includes(termino)
      );
    }

    // Guardamos los resultados finales, reiniciamos la paginación y renderizamos
    opcionesProductos = productosBase;

    renderizarElementosAComparar();

  } catch (error) {
    console.error(error);
    // mostrarMensajeEstado("Error al filtrar los datos", true);
  } 
}

/**
  * Recibe datos crudos, los transforma en instancia de Product 
  * y los establece en el primer índice del estado global.
  * @param {Object} datosCrudos - El objeto de producto de la API o LocalStorage.
*/
function inicializarEstadoComparador(datosCrudos) {
  const ProductoClase = window.Product;
  if (!ProductoClase) {
    console.error("La clase Product no está disponible en el entorno global.");
    return;
  }

  // Transformamos los datos en la instancia del modelo de Frontend
  const productoInicial = new ProductoClase(datosCrudos);

  // Guardamos el objeto en la primera posición de nuestro array global
  productosAComparar.push(productoInicial);
}

/*Llena el menú desplegable (<select>) con los nombres y precios de los productos*/
function llenarSelectorOpciones() {
  if (!selectorCategorias) return;

  const claseCategoria = window.Category;
  let opcionesHTML = "";

  opcionesCategoria.forEach(categoria => {
    const objetoCategoria = new claseCategoria(categoria);
    if (categoria === productosAComparar[0].category.name) {
      opcionesHTML += `<option value="${categoria}" selected>${objetoCategoria.label}</option>`;
    } else {
      opcionesHTML += `<option value="${categoria}">${objetoCategoria.label}</option>`;
    }
  });

  selectorCategorias.innerHTML = opcionesHTML;
}

/**
  * Transforma los datos crudos de la API, actualiza el estado global,
  * guarda en LocalStorage y refresca la tabla comparativa.
  * @param {Object} datosProductoCrudos - El objeto de producto devuelto por la API.
  * @param {string} categoria - Nombre de la categoría para el registro de consola.
*/
function establecerNuevoProductoInicial(datosProductoCrudos, categoria) {
  // Instanciamos la clase Product con los nuevos datos crudos
  const ProductoClase = window.Product;
  // Convertimos los datos crudos en una nueva instancia del modelo Frontend
  const nuevoProductoInicial = new ProductoClase(datosProductoCrudos);
  // Reiniciamos las Listas
  opcionesProductos = [];
  productosAComparar = [];
  // Reinsertamos el nuevo producto con index 0
  productosAComparar.push(nuevoProductoInicial);

  // Sincronizamos el LocalStorage para que si el usuario recarga la página, se mantenga este cambio
  localStorage.setItem("producto_inicial_comparar", JSON.stringify(datosProductoCrudos));

  // Re-renderizamos la tabla comparativa con el nuevo producto inicial en la pantalla
  renderizarTablaEstiloShopNova();

  console.log(`[Estado Actualizado] Producto inicial cambiado al primero de: ${categoria}`);
}

// if (productosAComparar.length >= 4) {
//   alert("¡Límite alcanzado! Solo puedes contrastar un máximo de 4 productos simultáneamente.");
//   selectorCategorias.value = "";
//   return;
// }

// Validación: Evita volver a agregar un producto que ya está en la tabla
// const yaExiste = productosAComparar.some(p => p.id === idSeleccionado);
// if (yaExiste) {
//   alert("Este producto ya se encuentra en la tabla comparativa.");
//   selectorProductos.value = "";
//   return;
// }

/**
 * Recupera el producto inicial del LocalStorage y extrae el nombre 
 * de su categoría en formato de texto plano (en inglés).
 * @returns {string|null} Nombre de la categoría o null si no existe.
 */
function obtenerCategoriaProductoGuardado() {
  const productoGuardado = localStorage.getItem("producto_inicial_comparar");

  if (!productoGuardado) {
    console.warn("No se encontró ningún producto inicial en LocalStorage.");
    return null;
  }

  try {
    const producto = JSON.parse(productoGuardado);

    // Validamos si 'category' viene como objeto (ej: { name: 'electronics' }) o como string plano
    if (producto && producto.category) {
      return (typeof producto.category === 'object')
        ? (producto.category.name || producto.category.label)
        : producto.category;
    }

    return null;
  } catch (error) {
    console.error("Error al procesar el JSON del producto para obtener la categoría:", error);
    return null;
  }
}

/**Motor de renderizado: Construye la tabla usando los Getters de las clases*/
function renderizarTablaEstiloShopNova() {
  if (!tablaContenido) return;

  const totalColumnas = productosAComparar.length;
  const anchoColumna = 85 / totalColumnas;

  // FILA 1: Contiene las imágenes, el título y el botón para eliminar de la tabla
  let html = `
    <tr class="border-b bg-slate-50/60">
      <td class="w-[15%] p-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Producto</td>
  `;
  productosAComparar.forEach(prod => {
    html += `
      <td class="p-6 relative border-l border-slate-100" style="width: ${anchoColumna}%">
        <button onclick="quitarProducto(${prod.id})" class="absolute top-3 right-3 text-slate-400 hover:text-red-500 text-sm font-bold cursor-pointer transition-colors">
          ✕
        </button>
        <div class="w-full h-36 bg-white flex items-center justify-center p-2 rounded-lg border border-slate-100 mb-3 shadow-sm">
          <img src="${prod.image}" alt="${prod.title}" class="max-h-full max-w-full object-contain" />
        </div>
        <span class="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">${prod.category.label}</span>
        <h3 class="font-semibold text-xs text-slate-800 line-clamp-2 mt-1 min-h-[32px]">${prod.title}</h3>
      </td>
    `;
  });

  if (totalColumnas < 4) {
    html += `
    <td class="w-[20%] p-4 border-l border-slate-100 bg-slate-50/20 text-center text-xs text-slate-300">
      <button id="open-btn" class="w-full aspect-square rounded-md border-2 border-dashed border-border hover:border-[var(--cta)] hover:text-[var(--cta)] transition-colors grid place-items-center text-muted-foreground">
        <div class="flex flex-col items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus" aria-hidden="true">
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
          <span class="text-xs font-medium">Añadir producto</span>
        </div>
      </button>
    </td>`;
  }
  html += `</tr>`;

  // FILA 2: Muestra los precios usando el formato monetario de la clase Product
  html += `<tr class="border-b"><td class="p-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Precio</td>`;
  productosAComparar.forEach(prod => {
    html += `
      <td class="p-4 border-l border-slate-100">
        <span class="font-bold text-base text-red-600 block">${prod.formattedPrice}</span>
        <span class="text-[10px] text-slate-400 line-through block font-normal">$${(prod.price * 1.25).toFixed(2)}</span>
      </td>
    `;
  });
  for (let i = totalColumnas; i < 3; i++) html += `<td class="border-l border-slate-100 bg-slate-50/20"></td>`;
  html += `</tr>`;

  // FILA 3: Muestra la representación de estrellas obtenida directamente del Rating
  html += `<tr class="border-b"><td class="p-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Valoración</td>`;
  productosAComparar.forEach(prod => {
    html += `
      <td class="p-4 border-l border-slate-100">
        <div class="text-amber-500 text-xs font-bold tracking-tight">${prod.rating ? prod.rating.stars : '☆☆☆☆☆'}</div>
        <span class="text-[11px] text-slate-400 block mt-0.5">${prod.rating ? prod.rating.rate : 0} de 5 estrellas</span>
      </td>
    `;
  });
  for (let i = totalColumnas; i < 3; i++) html += `<td class="border-l border-slate-100 bg-slate-50/20"></td>`;
  html += `</tr>`;

  // FILA 4: Muestra la cantidad total de opiniones usando el formato de la clase Rating
  html += `<tr class="border-b"><td class="p-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Reseñas</td>`;
  productosAComparar.forEach(prod => {
    // POO: Usamos el GETTER .rating.reviews que controla automáticamente el singular/plural
    html += `<td class="p-4 border-l border-slate-100 text-xs text-slate-600 font-medium">${prod.rating ? prod.rating.reviews : '0 reseñas'}</td>`;
  });
  for (let i = totalColumnas; i < 3; i++) html += `<td class="border-l border-slate-100 bg-slate-50/20"></td>`;
  html += `</tr>`;

  // FILA 5: Muestra la descripción del producto, recortándola a un máximo de 4 líneas
  html += `<tr class="border-b"><td class="p-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Descripción</td>`;
  productosAComparar.forEach(prod => {
    html += `
      <td class="p-4 border-l border-slate-100 select-none">
        <div class="text-xs text-slate-500 leading-relaxed line-clamp-4">
          ${prod.description}
        </div>
      </td>
    `;
  });
  for (let i = totalColumnas; i < 3; i++) html += `<td class="border-l border-slate-100 bg-slate-50/20"></td>`;
  html += `</tr>`;

  // FILA 6: Botones para enviar el objeto completo al backend de Node.js
  html += `<tr class="bg-slate-50/40"><td class="p-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Acción</td>`;
  productosAComparar.forEach(prod => {
    html += `
      <td class="p-4 border-l border-slate-100 text-center">
        <button onclick="guardarFavoritoEnNode(${prod.id})" class="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs py-2 px-3 rounded shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1">
          <span>🛒</span> Guardar Este
        </button>
      </td>
    `;
  });
  for (let i = totalColumnas; i < 3; i++) html += `<td class="border-l border-slate-100 bg-slate-50/20"></td>`;
  html += `</tr>`;

  tablaContenido.innerHTML = html; // Inserta de golpe todo el HTML generado dinámicamente
}

function renderizarElementosAComparar() {
  if (!opcionesProductosGrid) return console.log("Grid no encontrado");

  // Si no hay productos que mostrar, limpiamos el grid y avisamos
  if (opcionesProductos.length === 0) {
    opcionesProductosGrid.innerHTML = "";
    // mostrarMensajeEstado("No se encontraron productos que coincidan con el filtro.");
  }

  const claseProduct = window.Product;

  const htmlCards = opcionesProductos.map(producto => {
    const objetoProduct = new claseProduct(producto);

    // CONDICIÓN: Verificamos si este producto ya está en la tabla de comparación
    // Recorremos el array global comparando los identificadores únicos (ID)
    const yaEstaAñadido = productosAComparar.some(prod => prod.id === producto.id);
    // Definimos las clases visuales según el estado
    const clasesBoton = yaEstaAñadido
      ? "w-full flex items-center gap-3 p-2 rounded-md border text-left transition-colors opacity-50 cursor-not-allowed"
      : "w-full flex items-center gap-3 p-2 rounded-md border text-left transition-colors hover:bg-secondary cursor-pointer";

    return `
      <button ${yaEstaAñadido ? 'disabled=""' : ''} data-id="${producto.id}" class="${clasesBoton}">
        <img alt="${producto.title}" class="w-14 h-14 rounded object-cover bg-secondary" src="${producto.image}">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium line-clamp-1">${producto.title}</p>
          <p class="text-xs text-muted-foreground">${objetoProduct.formattedPrice}</p>
        </div>
        ${yaEstaAñadido
        ? '<div class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"> Añadido</div>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"     stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus text-muted-foreground" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>'
      }
      </button>
    `;
  }).join("");

  opcionesProductosGrid.innerHTML = `${htmlCards}`;
}

/* Elimina un producto de la tabla usando su ID y vuelve a actualizar la vista*/
function quitarProducto(id) {
  // Validación: Exige que quede como mínimo un producto visible en pantalla
  if (productosAComparar.length <= 1) {
    alert("Operación inválida. Debes conservar por lo menos un producto en pantalla.");
    return;
  }

  // Filtra el arreglo eliminando el objeto que coincida con el ID
  productosAComparar = productosAComparar.filter(p => p.id !== id);
  renderizarTablaEstiloShopNova();
}


/*Evento principal: Se ejecuta automáticamente cuando la página termina de cargar*/
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // PROCESO DE DATOS: Obtenemos el producto de respaldo o el guardado
    const datosCrudos = await obtenerDatosProductoInicial();
    // PROCESO DE ESTADO: Registramos el producto en la lógica de la aplicación
    inicializarEstadoComparador(datosCrudos);
    // PROCESO DE INTERFAZ: Dibujamos la tabla comparativa inicial
    renderizarTablaEstiloShopNova();
    // PROCESO DE SELECTORES: Cargamos las opciones del menú desplegable
    await cargarOpcionesDeCategoria();

  } catch (error) {
    // La clase ApiError caerá aquí automáticamente conservando su mensaje personalizado
    console.error("Error en la inicialización:", error.message);
    alert(`${error.message} Volviendo a la tienda.`);
    window.location.href = "index.html";
    return;
  }

  // 1. ESCUCHADOR EN TIEMPO REAL: Detecta cada letra que escribe el usuario
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const categoriaActual = obtenerCategoriaProductoGuardado();

      if (!categoriaActual) {
        alert("No se pudo detectar la categoría del producto actual. Por favor, recarga la página.");
        return; // Detenemos el flujo si la información está corrupta o vacía
      }
      // Llamamos al filtro directamente sin preocuparnos por recargas de página
      aplicarFiltros(categoriaActual);
    });
  }

  // 2. ESCUCHADOR DEL FORMULARIO: Evita que el Enter recargue la página
  if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Ahora sí detendrá el reinicio de forma segura

      const categoriaActual = obtenerCategoriaProductoGuardado();
      if (!categoriaActual) {
        alert("No se pudo detectar la categoría del producto actual. Por favor, recarga la página.");
        return; // Detenemos el flujo si la información está corrupta o vacía
      }

      aplicarFiltros(categoriaActual);
    });
  }

  // Dibuja la tabla en pantalla y busca los productos similares en la API
  renderizarTablaEstiloShopNova();

  await cargarOpcionesDeCategoria();
});

/*Detecta cuando el usuario selecciona una nueva categoria del menú desplegable*/
if (selectorCategorias) {
  selectorCategorias.addEventListener("change", async (event) => {
    const categoriaSeleccionada = event.target.value;
    console.log("Cambio detectado");
    if (categoriaSeleccionada) {
      actualizarComparadorPorCategoria(categoriaSeleccionada);
    }
  });
}

// ============================================================
// ESCUCHADORES DE CIERRE DE MODAL Y BOTON AÑADIR PRODUCTO
// ============================================================
document.getElementById('modal-overlay').addEventListener('click', closeModal);
closeModalBtn.addEventListener('click', closeModal);
// Delegación de eventos en la tabla
// (Asegúrate de cambiar 'tablaContenido' por el ID real de tu tabla si es necesario)
tablaContenido.addEventListener('click', (event) => {
  // Busca si el clic ocurrió en el botón o dentro de sus elementos hijos (como el SVG o el texto)
  const botonAbrir = event.target.closest('#open-btn');

  if (botonAbrir) {
    const categoriaActual = obtenerCategoriaProductoGuardado();

    if (!categoriaActual) {
      alert("No se pudo detectar la categoría del producto actual. Por favor, recarga la página.");
      return; // Detenemos el flujo si la información está corrupta o vacía
    }

    openModal();
    cargarElementosDeMismaCategoria(categoriaActual);
    renderizarElementosAComparar();
  }
});

opcionesProductosGrid.addEventListener('click', (event) => {
  // Buscamos si el clic ocurrió en un botón de producto o en cualquiera de sus elementos hijos
  const botonProducto = event.target.closest('button[data-id]');
  // Si el clic fue en un área vacía o en el botón deshabilitado que no tiene 'data-id', ignoramos el evento
  if (!botonProducto) return;
  // Extraemos el ID del producto guardado en el atributo HTML y lo convertimos a número
  const idSeleccionado = parseInt(botonProducto.getAttribute('data-id'), 10);
  // 3. Validación de límite: El comparador solo permite hasta 4 productos a la vez
  if (productosAComparar.length >= 4) {
    alert("¡Límite alcanzado! Solo puedes contrastar un máximo de 4 productos simultáneamente.");
    closeModal();
    return;
  }
  // Buscamos los datos crudos del producto seleccionado dentro del catálogo disponible en el modal
  const datosProducto = opcionesProductos.find(prod => prod.id === idSeleccionado);
  if (datosProducto) {
    // POO: Transformamos los datos sueltos de la API en una nueva instancia del modelo Product
    const ProductoClase = window.Product;
    if (!ProductoClase) {
      console.error("La clase Product no está disponible en el entorno global.");
      return;
    }

    // 5. Insertamos la instancia del producto en el estado global
    productosAComparar.push(new ProductoClase(datosProducto));

    // 6. Refrescamos la interfaz de la tabla comparativa y cerramos el modal
    renderizarTablaEstiloShopNova();
    closeModal();

    console.log(`[Delegación] Producto ID ${idSeleccionado} agregado exitosamente.`);
  }
});

// Registra las funciones en el objeto global del navegador (window) para que el HTML dinámico las lea
window.quitarProducto = quitarProducto;
window.guardarFavoritoEnNode = guardarFavoritoEnNode;