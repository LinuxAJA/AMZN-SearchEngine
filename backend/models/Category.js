// ============================================================
// CLASE Category (Programación Orientada a Objetos)
// ------------------------------------------------------------
// Representa la categoría de un producto.
// La API devuelve la categoría como un texto, pero esta clase
// permite encapsular su comportamiento.
// ============================================================

class Category {

    // El constructor recibe el nombre de la categoría.
    constructor(name) {
        this.name = name;
    }

    // GETTER: devuelve el nombre de la categoría en mayúsculas.
    get label() {
        return this.name.toUpperCase();
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

module.exports = Category;