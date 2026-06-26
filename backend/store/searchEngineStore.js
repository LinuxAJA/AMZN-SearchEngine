const Product = require("../models/Product");

class SearchEngineStore {
    constructor() {
        this.productos = {};
    }

    guardarProducto(data) {
        const producto = new Product(data);
        // isNew indica si NO existía antes (true = nuevo, false = ya estaba)
        const isNew = !this.productos[producto.id];
        // Lo guardamos usando su id como clave. Si ya existía, lo reemplaza.
        this.productos[producto.id] = producto;

        return { producto, isNew };
    }

    // Indica si un id ya está guardado. Boolean() lo convierte en true/false.
    has(id) {
        return Boolean(this.productos[id]);
    }

    // Devuelve un Pokémon por su id, o null si no existe.
    get(id) {
        return this.productos[id] || null;
    }

    // Object.values() devuelve un arreglo con todos los Pokémon guardados.
    list() {
        return Object.values(this.productos);
    }

    // GETTER: cuenta cuántos Pokémon hay guardados.
    // Object.keys() devuelve un arreglo con todas las claves (los id).
    get size() {
        return Object.keys(this.productos).length;
    }
}

module.exports = SearchEngineStore;