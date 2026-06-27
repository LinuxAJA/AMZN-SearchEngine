/* =============================================================
 * api.js  —  CAPA DE ACCESO A DATOS (servicio)
 * -------------------------------------------------------------
 * Aquí vive TODA la comunicación con la API de FakeStoreAPI.
 *   - fetch()         -> hace la petición HTTP y devuelve una Promesa
 *   - async / await   -> escribir código asíncrono que se lee como síncrono
 *   - manejo de errores con try/catch y respuestas HTTP no exitosas
 * ============================================================= */

// URL base de la API. Si en el futuro cambia, solo se edita aquí.
const API_BASE_URL = 'https://fakestoreapi.com';

/**
    * Error personalizado para distinguir un "no encontrado" (404)
    * de un error de red u otro problema. Así la UI puede mostrar
    * mensajes distintos según el caso.
 */
class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'ApiError';
        this.status = status; // código HTTP (404, 500, etc.) o null si fue red
    }
}

/**
    * ENDPOINT #1 — "Get a Single Product"
    * GET /productos/{id}
    *
    * Busca un producto por su identificador único.
    *
    * @param {number|string} id  Identificador del producto (ej: 3)
    * @returns {Promise<Object>} Promesa que resuelve con el objeto `photo`
    * @throws {ApiError} Si el ID no existe (404) o si falla la red
    */
async function obtenerProductoPorId(id) {
    // 1) Validación básica del parámetro antes de gastar una petición.
    const idLimpio = Number(id);
    if (!Number.isInteger(idLimpio) || idLimpio <= 0) {
        throw new ApiError('El ID debe ser un número entero positivo.', null);
    }

    const url = `${API_BASE_URL}/products/${idLimpio}`;

    try {
        // 2) fetch devuelve una Promesa; con await esperamos la respuesta.
        const respuesta = await fetch(url);

        // 3) fetch NO lanza error en 404/500: hay que revisarlo a mano.
        if (respuesta.status === 404) {
            throw new ApiError(`No existe ningun producto con el ID ${idLimpio}.`, 404);
        }
        if (!respuesta.ok) {
            throw new ApiError(`Error del servidor (HTTP ${respuesta.status}).`, respuesta.status);
        }

        // 4) Convertimos el cuerpo a JSON (también es una Promesa -> await).
        const datos = await respuesta.json();

        // 5) La API envuelve el resultado en { photo: {...} }. Lo devolvemos limpio.
        return datos;
    } catch (error) {
        // Si ya es un ApiError, lo relanzamos tal cual.
        if (error instanceof ApiError) {
            throw error;
        }
        // Cualquier otra cosa (sin internet, CORS, JSON inválido) cae aquí.
        throw new ApiError('No se pudo conectar con la API. Revisa tu conexión.', null);
    }
}

/**
    * ENDPOINT #2 — "Get all Products"
    * GET /productos
    *  
    * Devuelve un json de todos los productos disponibles.
    *
    * @throws {ApiError} Si el ID no existe (404) o si falla la red
*/
async function obtenerProductos() {
    const url = `${API_BASE_URL}/products`;

    try {
        const respuesta = await fetch(url);

        if (respuesta.status === 404) {
            throw new ApiError(`No existen productos.`, 404);
        }
        if (!respuesta) {
            throw new ApiError(`Error del servidor (HTTP ${respuesta.status}).`, respuesta.status);
        }

        const datos = await respuesta.json();

        return datos;
    } catch (error) {

        if (error instanceof ApiError) {
            throw error;
        }
        // Cualquier otra cosa (sin internet, CORS, JSON inválido) cae aquí.
        throw new ApiError('No se pudo conectar con la API. Revisa tu conexión.', null);
    }
}

/**
    * ENDPOINT #3 — "Get Categories"
    * GET /productos/categories
    *  
    * Devuelve un json de todos las categorias disponibles.
    *
    * @throws {ApiError} Si el ID no existe (404) o si falla la red
*/
async function obtenerCategorias() {
    const url = `${API_BASE_URL}/products/categories`;

    try {
        const respuesta = await fetch(url);

        if (respuesta.status === 404) {
            throw new ApiError(`No existen productos.`, 404);
        }
        if (!respuesta) {
            throw new ApiError(`Error del servidor (HTTP ${respuesta.status}).`, respuesta.status);
        }

        const datos = await respuesta.json();

        return datos;
    } catch (error) {

        if (error instanceof ApiError) {
            throw error;
        }
        // Cualquier otra cosa (sin internet, CORS, JSON inválido) cae aquí.
        throw new ApiError('No se pudo conectar con la API. Revisa tu conexión.', null);
    }
}

/**
    * ENDPOINT #4 — "Get Product by Category
    * GET /productos/category/${encodeURIComponent(category)}
    *  
    * Devuelve un json de todos las categorias disponibles.
    *
    * @throws {ApiError} Si el ID no existe (404) o si falla la red
*/
async function obtenerProductosPorCategoria(category) {
    const url = `${API_BASE_URL}/products/category/${encodeURIComponent(category)}`;

    try {
        const respuesta = await fetch(url);

        if (respuesta.status === 404) {
            throw new ApiError(`No existen productos con esta categoria.`, 404);
        }
        if (!respuesta) {
            throw new ApiError(`Error del servidor (HTTP ${respuesta.status}).`, respuesta.status);
        }

        const datos = await respuesta.json();

        return datos;
    } catch (error) {

        if (error instanceof ApiError) {
            throw error;
        }
        // Cualquier otra cosa (sin internet, CORS, JSON inválido) cae aquí.
        throw new ApiError('No se pudo conectar con la API. Revisa tu conexión.', null);
    }
}

// Exponemos el servicio en un único objeto global para que app.js lo use.
// (Trabajamos sin módulos ES para poder abrir el HTML directamente.)
window.FakeStoreAPI = {
    obtenerProductoPorId,
    obtenerProductos,
    obtenerProductosPorCategoria,
    obtenerCategorias,
    ApiError,
};
