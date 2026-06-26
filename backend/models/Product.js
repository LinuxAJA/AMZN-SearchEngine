// ============================================================
// CLASE Product (Programación Orientada a Objetos)
// ------------------------------------------------------------
// Representa un producto obtenido desde la Fake Store API.
// Un producto está compuesto por una categoría y una
// calificación (Rating).
// ============================================================

const Category = require('./Category')
const Rating = require('./Rating');

class Product {

    // El constructor recibe un objeto con la misma estructura
    // que devuelve la API y copia sus propiedades al objeto.
    constructor({ id, title, price, description, category, image, rating}) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.description = description;
        this.category = new Category(category);
        this.image = image;
        // Guardamos la fecha y hora exacta en que se creó este objeto.
        this.rating = rating ? new Rating(rating) : null;
        this.savedAt = new Date();
    }

    // GETTER: devuelve una etiqueta legible del producto.
    get label() {
        return `#${this.id} ${this.title}`;
    }

    // GETTER: devuelve el precio con formato monetario.
    get formattedPrice() {
        return `$${this.price.toFixed(2)}`;
    }

    // MÉTODO: genera una descripción completa del producto.
    describe() {
        return `${this.label} 
        Precio: $${this.formattedPrice} 
        Calificación: ${this.rating.describe()}
        Descripción: ${this.description}`;
    }

    /// MÉTODO: controla cómo se convierte el objeto a JSON.
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            price: this.price,
            description: this.description,
            category: this.category,
            image: this.image,
            rating: this.rating,
            // toISOString() convierte la fecha a texto estándar:
            // "2026-06-25T14:30:00.000Z"
            savedAt: this.savedAt.toISOString()
        };
    }
}

// Exportamos la clase para poder importarla en otros archivos con:
// const Product = require('./Product');
module.exports = Product;