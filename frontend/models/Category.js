// ============================================================
// CLASE Category (Programación Orientada a Objetos)
// ------------------------------------------------------------
// Representa la categoría de un producto.
// La API devuelve la categoría como un texto, pero esta clase
// permite encapsular su comportamiento.
// ============================================================

class Category {
    // Diccionario estático de traducciones para las reglas de diseño del Frontend
    static diccionarioTraducciones = {
        "electronics": "Electrónica",
        "jewelery": "Joyería",
        "men's clothing": "Ropa de Hombre",
        "women's clothing": "Ropa de Mujer"
    };

    // El constructor recibe el nombre de la categoría.
    constructor(name) {
        this.name = name;
    }

    /**
        * TRADUCTOR Y FORMATEADOR (MÉTODO / GETTER)
        * Traduce el nombre de la categoría del inglés al español y lo devuelve en MAYÚSCULAS.
        * Si la categoría no está en el diccionario, la devuelve en mayúsculas tal cual viene.
    */
    get label() {
        const nombreLimpio = this.name.toLowerCase().trim();
        const traduccion = Category.diccionarioTraducciones[nombreLimpio] || this.name;
        return traduccion
    }

    // MÉTODO: genera una descripción de la categoría.
    describe() {
        return `Categoría: ${this.label}`
    }

    // MÉTODO: controla cómo se convierte el objeto a JSON.
    toJSON() {
        return this.name;
    }
}

window.Category = Category;