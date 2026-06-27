// URL de nuestro backend nativo en Node.js para guardar los favoritos.
const BACKEND_URL = "http://localhost:3000";

let productosCargados = []; // Almacena el total de productos obtenidos del servicio
let limiteActual = 6;       // Cantidad de productos visibles inicialmente
const INCREMENTO = 6;       // Cuántos productos adicionales se muestran al pulsar "Ver más"


//  REFERENCIAS A LOS ELEMENTOS DEL DOM
const productsGrid = document.getElementById("products-grid");
const loadingSpinner = document.getElementById("loadingSpinner");
const loadMoreButton = document.getElementById("loadMoreButton");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const statusMessage = document.getElementById("status");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const topNavCategories = document.getElementById("topNavCategories");
const asideCategories = document.getElementById("asideCategories");


// 3. FUNCIONES DE CONTROL DE INTERFAZ (UI)

/**
 * Muestra u oculta el círculo de carga animado (Spinner).
 * @param {boolean} visible - true para mostrar, false para ocultar.
 */
function toggleSpinner(visible) {
  if (visible) {
    loadingSpinner.classList.remove("hidden");
  } else {
    loadingSpinner.classList.add("hidden");
  }
}

/**
 * Controla si el botón de "Ver más" */
function actualizarBotonVerMas() {
  if (productosCargados.length === 0 || limiteActual >= productosCargados.length) {
    loadMoreButton.classList.add("hidden");
  } else {
    loadMoreButton.classList.remove("hidden");
  }
}

/**
 * Muestra un mensaje informativo o de error en la pantalla para el usuario.
 */
function mostrarMensajeEstado(mensaje, esError = false) {
  statusMessage.textContent = mensaje;
  statusMessage.classList.remove("hidden");
  if (esError) {
    statusMessage.className = "text-sm font-semibold text-red-600 bg-red-50 p-3 rounded-md cols-span-full";
  } else {
    statusMessage.className = "text-sm font-medium text-muted-foreground cols-span-full";
  }
}

/**
 * Limpia los mensajes informativos del DOM.
 */
function limpiarMensajeEstado() {
  statusMessage.textContent = "";
  statusMessage.classList.add("hidden");
}


// 4. FUNCIONES DE RENDERIZADO (DIBUJAR EN PANTALLA)
/*
 * Toma el arreglo global de productos cargados y dibuja en el HTML
 * únicamente los elementos que estén dentro de nuestro límite actual.
 */
function renderizarProductos() {
  // Si no hay productos que mostrar, limpiamos el grid y avisamos
  if (productosCargados.length === 0) {
    productsGrid.innerHTML = "";
    mostrarMensajeEstado("No se encontraron productos que coincidan con los filtros.");
    actualizarBotonVerMas();
    return;
  }

  limpiarMensajeEstado();
  // Cortamos el arreglo desde la posición 0 hasta el límite actual (ej: de 0 a 6)
  const productosVisibles = productosCargados.slice(0, limiteActual);

  // Mapeamos los productos a plantillas HTML de tarjetas dinámicas
  const htmlCards = productosVisibles.map(producto => {
    // Generar estrellas visuales según la calificación (Rating)
    const ratingStars = "★".repeat(Math.round(producto.rating?.rate || 0)) + "☆".repeat(5 - Math.round(producto.rating?.rate || 0));

    return `
      <article class="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col overflow-hidden group">
        <div class="relative bg-white p-4 pt-[100%] shrink-0 overflow-hidden">
          <img src="${producto.image}" alt="${producto.title}" 
            class="absolute top-0 left-0 w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105" />
        </div>
        <div class="p-4 flex flex-col flex-1 gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">${producto.category}</span>
          <h2 class="font-display font-bold text-sm line-clamp-2 h-10 group-hover:text-[var(--primary)] transition-colors">
            ${producto.title}
          </h2>
          <div class="flex items-center gap-1.5 mt-1">
            <span class="text-[var(--rating)] text-sm">${ratingStars}</span>
            <span class="text-xs text-muted-foreground">(${producto.rating?.count || 0})</span>
          </div>
          <p class="text-xs text-muted-foreground line-clamp-2 mt-1 flex-1">
            ${producto.description}
          </p>
          <div class="flex items-baseline gap-1 mt-2">
            <span class="text-xs font-semibold text-[var(--price)]">$</span>
            <span class="text-xl font-bold font-display text-[var(--price)]">${producto.price.toFixed(2)}</span>
          </div>
          
          <button onclick="irAComparar(${producto.id})"
            class="inline-flex items-center justify-center gap-2 font-sans whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[var(--cta)] text-[var(--cta-foreground)] shadow-sm hover:brightness-95 h-9 rounded-md px-3 mt-3 w-full cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18 3v6"/>
              <path d="M15 6h6"/>
            </svg>
            Comparar Producto
          </button>
        </div>
      </article>
    `;
  }).join("");

  productsGrid.innerHTML = htmlCards;
  
  // Evaluamos si el botón de Ver más debe permanecer o desaparecer
  actualizarBotonVerMas();
}

// 5. CONTROLADORES DE CARGA DE DATOS Y FILTROS (CORREGIDO)

/**
 * Carga el catálogo base llamando a la función desde el objeto FakeStoreAPI
 */
async function inicializarCatalogo() {
  toggleSpinner(true);
  try {
    // CORRECCIÓN: Se llama a través del objeto global expuesto en api.js
    const datos = await window.FakeStoreAPI.obtenerProductos(); 
    productosCargados = datos;
    limiteActual = 6; // Reseteamos la paginación inicial
    renderizarProductos();
  } catch (error) {
    console.error(error);
    mostrarMensajeEstado("Ocurrió un error al cargar el catálogo de FakeStore. Revisa tu conexión de red.", true);
  } finally {
    toggleSpinner(false);
  }
}

/**
 * Filtra el catálogo en base al texto de búsqueda y la categoría seleccionada
 */
async function aplicarFiltros(categoriaSeleccionada = "all") {
  toggleSpinner(true);
  limpiarMensajeEstado();
  
  try {
    // 1. Obtener la base de datos limpia llamando al objeto de api.js
    let productosBase = [];
    if (categoriaSeleccionada === "all") {
      // CORRECCIÓN: Se usa window.FakeStoreAPI
      productosBase = await window.FakeStoreAPI.obtenerProductos();
    } else {
      // CORRECCIÓN: Se usa window.FakeStoreAPI y se corrige la ruta interna
      productosBase = await window.FakeStoreAPI.obtenerProductosPorCategoria(categoriaSeleccionada);
    }

    // 2. Aplicar filtro secundario por cuadro de texto de búsqueda si contiene algo
    const termino = searchInput.value.toLowerCase().trim();
    if (termino !== "") {
      productosBase = productosBase.filter(producto => 
        producto.title.toLowerCase().includes(termino) || 
        producto.description.toLowerCase().includes(termino)
      );
    }

    // 3. Aplicar filtro por rango de precio máximo
    const precioMaximo = parseFloat(priceRange.value);
    productosBase = productosBase.filter(producto => producto.price <= precioMaximo);

   // Guardamos los resultados finales, reiniciamos la paginación y renderizamos
    productosCargados = productosBase;
    limiteActual = 6;
    renderizarProductos();

  } catch (error) {
    console.error(error);
    mostrarMensajeEstado("Error al filtrar los datos de la tienda online.", true);
  } finally {
    toggleSpinner(false);
  }
}

// ============================================================
// 6. ACCIÓN DE COMPARACIÓN Y REDIRECCIÓN
// ============================================================

/**
 * Busca el producto seleccionado, lo guarda en el localStorage del navegador
 * y redirige al usuario a la vista comparar.html
 * @param {number} id - Identificador del producto seleccionado
 */
function irAComparar(id) {
  const productoSeleccionado = productosCargados.find(p => p.id === id);
  if (!productoSeleccionado) return;

  // Guardamos el objeto completo convirtiéndolo a texto
  localStorage.setItem("producto_inicial_comparar", JSON.stringify(productoSeleccionado));

  // Redirigimos automáticamente al usuario a la vista de la tabla comparativa
  window.location.href = "comparar.html";
}

// ============================================================
// 7. REGISTRO DE EVENTOS DEL DOM PROTEGIDO (DOMContentLoaded)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // Arranque inicial del catálogo
  inicializarCatalogo();

  // Guardamos los registros de eventos de forma segura verificando que existan en el HTML
  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", () => {
      limiteActual += INCREMENTO;
      renderizarProductos();
    });
  }

  if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      aplicarFiltros();
    });
  }

  if (priceRange) {
    priceRange.addEventListener("input", (event) => {
      if (priceValue) priceValue.textContent = `$${event.target.value}`;
      aplicarFiltros();
    });
  }

  if (topNavCategories) {
    topNavCategories.addEventListener("click", (event) => {
      const boton = event.target.closest("button");
      if (!boton) return;

      Array.from(topNavCategories.querySelectorAll("button")).forEach(btn => {
        btn.className = "hover:bg-white/10 px-3 py-1.5 rounded transition font-sans cursor-pointer";
      });
      boton.className = "flex items-center space-x-1 hover:bg-white/10 px-3 py-1.5 rounded transition font-sans cursor-pointer bg-white/20 font-semibold";

      const categoria = boton.getAttribute("data-category");
      aplicarFiltros(categoria);
    });
  }

  if (asideCategories) {
    asideCategories.addEventListener("click", (event) => {
      const boton = event.target.closest("button");
      if (!boton) return;

      Array.from(asideCategories.querySelectorAll("button")).forEach(btn => {
        btn.className = "text-left px-2 py-1.5 rounded-md transition-colors hover:bg-secondary/60 text-muted-foreground cursor-pointer";
      });
      boton.className = "text-left px-2 py-1.5 rounded-md transition-colors bg-secondary font-semibold text-[var(--price)] cursor-pointer";

      const categoria = boton.getAttribute("data-category");
      aplicarFiltros(categoria);
    });
  }
});