// "http" es un MÓDULO NATIVO de Node.js: no requiere instalar nada
// (no usamos Express ni librerías externas). Sirve para crear servidores.
const http = require('http');
// Importamos nuestra clase de almacenamiento.
const SearchEngineStore = require("./store/SearchEngineStore");

// ============================================================
// CLASE PokedexServer (Programación Orientada a Objetos)
// ------------------------------------------------------------
// Agrupa toda la lógica del servidor: recibe peticiones, decide qué
// hacer según la ruta y guarda los Pokémon usando PokemonStore.
// ============================================================
class SearchEngineServer {
    constructor(port) {
        this.port = port;
        // Cada servidor tiene su propio almacén (composición de objetos).
        this.store = new SearchEngineStore();
        // Creamos el servidor. Por cada petición, llamamos a handleRequest.
        this.server = http.createServer((req, res) => this.manejadorDePeticiones(req, res));
    }
    // Encabezados CORS: permiten que el navegador (en otro puerto) pueda
    // hacer peticiones a este servidor. Sin esto, el navegador las bloquea.
    setCabecerasCors(res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    // Función auxiliar para responder con datos en formato JSON.
    // statusCode es el código HTTP (200 = ok, 404 = no encontrado, etc.).
    enviarJson(res, statusCode, payload) {
        res.writeHead(statusCode, { "Content-Type": "application/json" });
        // JSON.stringify convierte el objeto de JS en texto para enviarlo.
        res.end(JSON.stringify(payload));
    }

    // Lee el cuerpo (body) de la petición. Los datos llegan en "pedazos"
    // (chunks), por eso los vamos juntando hasta que termina la transmisión.
    // Devolvemos una PROMESA porque la lectura es asíncrona.
    leerBody(req) {
        return new Promise((resolve, reject) => {
            let raw = "";
            // Evento "data": llega un pedazo de información.
            req.on("data", (chunk) => {
                raw += chunk;
            });
            // Evento "end": ya llegaron todos los pedazos.
            req.on("end", () => {
                try {
                    // JSON.parse convierte el texto recibido en un objeto de JS.
                    resolve(raw ? JSON.parse(raw) : {});
                } catch (error) {
                    reject(error);
                }
            });
            // Evento "error": algo falló durante la lectura.
            req.on("error", reject);
        });
    }

    // "Router" simple: decide qué hacer según el método y la URL.
    manejadorDePeticiones(req, res) {
        this.setCabecerasCors(res);

        // OPTIONS es una petición previa que hace el navegador para CORS.
        // Respondemos 204 (sin contenido) para autorizarla.
        if (req.method === "OPTIONS") {
            res.writeHead(204);
            res.end();
            return;
        }

        if (req.method === 'GET' && req.url === '/saludo') {
            this.enviarJson(res, 200, { mensaje: 'Hola Desde el Servidor Node'});
            return;
        }

        // POST /product -> guardar un Producto.
        if (req.method === "POST" && req.url === "/product") {
            this.manejadorDeGuardado(req, res);
            return;
        }

        // GET /products -> devolver la lista de Pokémon guardados.
        if (req.method === "GET" && req.url === "/products") {
            this.enviarJson(res, 200, {
                count: this.store.size,
                pokemons: this.store.list(),
            });
            return;
        }

        // Si no coincide ninguna ruta, respondemos 404 (no encontrado).
        this.enviarJson(res, 404, { error: "Ruta no encontrada" });
    }

    // Maneja el guardado de un Pokémon (es async porque espera el body).
    async manejadorDeGuardado(req, res) {
        try {
            // await espera a que la promesa de readBody se resuelva.
            const data = await this.leerBody(req);

            // Validación: si faltan datos clave, respondemos error 400.
            if (!data.id || !data.title) {
                this.enviarJson(res, 400, { error: "Datos del Producto incompletos" });
                return;
            }

            // Guardamos en memoria usando el almacén.
            const { producto, isNew } = this.store.guardarProducto(data);
            // Mostramos el mensaje EN LA TERMINAL (no en el navegador).
            this.guardarLog(producto, isNew);

            this.enviarJson(res, 200, {
                message: "Pokémon guardado en el servidor",
                total: this.store.size,
            });
        } catch (error) {
            // Si el JSON estaba mal formado, readBody lanza un error y caemos aquí.
            this.enviarJson(res, 400, { error: "JSON inválido" });
        }
    }

    // Imprime en la terminal información del Pokémon recién guardado.
    guardarLog(pokemon, isNew) {
        const action = isNew ? "GUARDADO" : "ACTUALIZADO";
        console.log("----------------------------------------");
        // Usamos el método describe() del objeto Pokemon (POO).
        console.log(`[${action}] ${pokemon.describe()}`);
        console.log(`Producto/s en memoria: ${this.store.size}`);
        console.log("Lista actual:", this.store.list().map((p) => p.label).join(" | "));
        console.log("----------------------------------------");
    }

    // Pone el servidor a "escuchar" peticiones en el puerto indicado.
    start() {
        // Si el puerto ya está ocupado, mostramos un mensaje claro y salimos
        // en vez de dejar que el programa se caiga con un error feo.
        this.server.on("error", (error) => {
            if (error.code === "EADDRINUSE") {
                console.error(`El puerto ${this.port} ya está en uso. Cierra el otro servidor o usa otro puerto.`);
                process.exit(1);
            }
            throw error;
        });

        this.server.listen(this.port, () => {
            console.log(`Servidor AMZN-SearchEngine escuchando en http://localhost:${this.port}`);
        });
    }
}

// Creamos una instancia del servidor en el puerto 3000 y lo iniciamos.
const server = new SearchEngineServer(3000);
server.start();