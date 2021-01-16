/**
 * Se usará para representar los datos base de los productos 
 * (por ejemplo cuando el producto no tiene id, porque no está "persistido" )
 */
export interface BaseProducto {
    nombre: string;
    precio: number;
    descripcion: string;
    imagen: string;
}

/**
 * Se usará para representar un producto ya "persistido"
 */
export interface Producto extends BaseProducto {
    id: number;
}