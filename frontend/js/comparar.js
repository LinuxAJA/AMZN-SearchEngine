// Configuración de la URL del backend y estado global con objetos de la clase Product
const BACKEND_URL = "http://localhost:3000";
let productosAComparar = []; 
let opcionesCategoria = [];   

// Captura de los elementos interactivos del HTML (DOM)
const tablaContenido = document.getElementById("tabla-matriz-contenido");
const selectorProductos = document.getElementById("selector-productos-categoria");
const loadingSpinnerComp = document.getElementById("loadingSpinnerComparar");

/*Evento principal: Se ejecuta automáticamente cuando la página termina de cargar*/
document.addEventListener("DOMContentLoaded", async () => {
  // Recupera el producto seleccionado en la página principal desde el LocalStorage
  const productoInicialGuardado = localStorage.getItem("producto_inicial_comparar");

  if (!productoInicialGuardado) {
    alert("No has seleccionado ningún producto para comparar. Volviendo a la tienda.");
    window.location.href = "index.html";
    return;
  }

  // Convierte el texto JSON en un objeto y lo transforma en una instancia de la clase Product
  const datosCrudos = JSON.parse(productoInicialGuardado);
  const productoInicial = new Product(datosCrudos); 
  
  // Guarda el objeto de tipo Product en el estado global
  productosAComparar.push(productoInicial);
  
  // Dibuja la tabla en pantalla y busca los productos similares en la API
  renderizarTablaEstiloShopNova();
  await cargarOpcionesDeMismaCategoria(datosCrudos.category);
});

/* Llama a la API para traer todos los productos que compartan la misma categoría*/
async function cargarOpcionesDeMismaCategoria(categoria) {
  if (loadingSpinnerComp) loadingSpinnerComp.classList.remove("hidden"); 
  try {
    // Usa la función de api.js para obtener los productos por su categoría
    const datos = await window.FakeStoreAPI.obtenerProductosPorCategoria(categoria);
    
    // Filtra la lista para que en el menú no aparezca el producto que ya estamos comparando
    opcionesCategoria = datos.filter(prod => prod.id !== productosAComparar[0].id);
    
    llenarSelectorOpciones(); // Llena el menú desplegable del HTML
  } catch (error) {
    console.error("Error al cargar la categoría:", error);
  } finally {
    if (loadingSpinnerComp) loadingSpinnerComp.classList.add("hidden"); 
  }
}

/*Llena el menú desplegable (<select>) con los nombres y precios de los productos*/
function llenarSelectorOpciones() {
  if (!selectorProductos) return;
  
  // POO: Usamos el GETTER .category.label del primer producto para el título en mayúsculas
  let opcionesHTML = `<option value="" disabled selected>${productosAComparar[0].category.label}</option>`;
  
  opcionesCategoria.forEach(prod => {
    opcionesHTML += `<option value="${prod.id}">${prod.title} — $${prod.price.toFixed(2)}</option>`;
  });
  
  selectorProductos.innerHTML = opcionesHTML;
}

/*Detecta cuando el usuario selecciona un nuevo producto del menú desplegable*/
if (selectorProductos) {
  selectorProductos.addEventListener("change", (event) => {
    const idSeleccionado = parseInt(event.target.value);
    if (!idSeleccionado) return;

    if (productosAComparar.length >= 4) {
      alert("¡Límite alcanzado! Solo puedes contrastar un máximo de 4 productos simultáneamente.");
      selectorProductos.value = "";
      return;
    }

    // Validación: Evita volver a agregar un producto que ya está en la tabla
    const yaExiste = productosAComparar.some(p => p.id === idSeleccionado);
    if (yaExiste) {
      alert("Este producto ya se encuentra en la tabla comparativa.");
      selectorProductos.value = "";
      return;
    }

    const datosProducto = opcionesCategoria.find(p => p.id === idSeleccionado);
    if (datosProducto) {
      // POO: Transforma los datos sueltos de la API en una nueva instancia de la clase Product
      productosAComparar.push(new Product(datosProducto));
      renderizarTablaEstiloShopNova(); 
    }
    selectorProductos.value = ""; 
  });
}

/**Motor de renderizado: Construye la tabla usando los Getters de las clases*/
function renderizarTablaEstiloShopNova() {
  if (!tablaContenido) return;

  const totalColumnas = productosAComparar.length;
  const anchoColumna = 80 / totalColumnas; 

  // FILA 1: Contiene las imágenes, el título y el botón para eliminar de la tabla
  let html = `
    <tr class="border-b bg-slate-50/60">
      <td class="w-[20%] p-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Producto</td>
  `;
  productosAComparar.forEach(prod => {
    html += `
      <td class="p-6 relative border-l border-slate-100" style="width: ${anchoColumna}%">
        <button onclick="quitarProducto(${prod.id})" 
                class="absolute top-3 right-3 text-slate-400 hover:text-red-500 text-sm font-bold cursor-pointer transition-colors">
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
  for (let i = totalColumnas; i < 3; i++) {
    html += `<td class="p-4 border-l border-slate-100 bg-slate-50/20 text-center text-xs text-slate-300">Vacante</td>`;
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
    html += `<td class="p-4 border-l border-slate-100 text-xs text-slate-500 leading-relaxed line-clamp-4 select-none">${prod.description}</td>`;
  });
  for (let i = totalColumnas; i < 3; i++) html += `<td class="border-l border-slate-100 bg-slate-50/20"></td>`;
  html += `</tr>`;

  // FILA 6: Botones para enviar el objeto completo al backend de Node.js
  html += `<tr class="bg-slate-50/40"><td class="p-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Acción</td>`;
  productosAComparar.forEach(prod => {
    html += `
      <td class="p-4 border-l border-slate-100 text-center">
        <button onclick="guardarFavoritoEnNode(${prod.id})" 
                class="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs py-2 px-3 rounded shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1">
          <span>🛒</span> Añadir Favorito
        </button>
      </td>
    `;
  });
  for (let i = totalColumnas; i < 3; i++) html += `<td class="border-l border-slate-100 bg-slate-50/20"></td>`;
  html += `</tr>`;

  tablaContenido.innerHTML = html; // Inserta de golpe todo el HTML generado dinámicamente
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

// Registra las funciones en el objeto global del navegador (window) para que el HTML dinámico las lea
window.quitarProducto = quitarProducto;
window.guardarFavoritoEnNode = guardarFavoritoEnNode;