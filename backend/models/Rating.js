// ============================================================
// CLASE Rating (Programación Orientada a Objetos)
// ------------------------------------------------------------
// Representa la calificación de un producto.
// Se crea a partir del objeto "rating" recibido desde la API.
// ============================================================

class Rating {

    // El constructor recibe un objeto con las propiedades rate (calificación) y count (cantidad de reseñas).
    constructor({rate, count}) {
        this.rate = rate;
        this.count = count;
    }

    // GETTER: convierte la calificación numérica (0 a 5) en una representación visual con estrellas.
    get stars() {
        const filled = Math.round(this.rate); // estrellas llenas
        const empty = 5 - filled; // estrellas vacías
        return "★".repeat(filled) + "☆".repeat(empty);
    }

    // GETTER: formatea el conteo con la palabra "reseña/s"
    get reviews() {
        return `${this.count} reseña${this.count === 1 ? "" : "s"}`;
    }

    // MÉTODO: genera una descripción legible de la calificación.
    describe() {
        return `${this.stars} (${this.rate}/5, ${this.reviews})`
    }

    // MÉTODO: controla cómo se convierte el objeto a JSON.
    toJSON() {
        return {
            rate: this.rate,
            count: this.count,
        };
    }
}

module.exports = Rating;