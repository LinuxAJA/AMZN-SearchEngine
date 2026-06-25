const http = require('http');

const PORT = 3000;

const CABECERAS_CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, text/html'
},
const server = http.createServer((req, res) => {
     // Responder a la petición preflight (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.writeHead(204, );
        res.end();
        return;
    }

    // Manejar diferentes rutas manualmente
    if (req.url === '/') {
        res.statusCode = 200;
        res.end('<h1>Bienvenido a mi servidor nativo</h1>');
    } else if (req.url === '/api') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ mensaje: 'Hola desde la API' }));
    } else {
        res.statusCode = 404;
        res.end('<h1>Ruta no encontrada</h1>');
    }
});

server.listen(PORT, 'localhost', () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
