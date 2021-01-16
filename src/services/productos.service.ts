import { Producto, BaseProducto } from "../models/producto.interface";
import { Productos } from "../models/productos.interface";

//Datos harcodeados

let productos: Productos = {
    1: {
        id: 1,
        nombre: "Hamburguesa",
        precio: 599,
        descripcion: "Hamburguesa básica",
        imagen: "https://cdn.auth0.com/blog/whatabyte/burger-sm.png"
    },
    2: {
        id: 2,
        nombre: "Pizza",
        precio: 299,
        descripcion: "Pizza básica",
        imagen: "https://cdn.auth0.com/blog/whatabyte/pizza-sm.png"
    },
    3: {
        id: 3,
        nombre: "Te",
        precio: 199,
        descripcion: "Te rojo",
        imagen: "https://cdn.auth0.com/blog/whatabyte/tea-sm.png"
    }
};


//Métodos de los servicios

export const findAll = async (): Promise<Producto[]> => Object.values(productos);

export const find = async (id: number): Promise<Producto> => productos[id];

export const create = async (nuevoProducto: BaseProducto): Promise<Producto> => {
    //En plan sencillo, imponemos que el id es el date, numero de mseg. entre 1/01/1970 y fecha actual
    const id = new Date().valueOf();

    productos[id] = {
        id,
        ...nuevoProducto,
    };

    return productos[id];
};

export const update = async (id: number, datosProductoActualizado: BaseProducto): Promise<Producto | null> => {
    const productoEncontrado = await find(id);

    if (!productoEncontrado) {
        return null;
    }

    productos[id] = { id, ...datosProductoActualizado };

    return productos[id];
};

export const remove = async (id: number): Promise<null | void> => {
    const productoEncontrado = await find(id);

    if (!productoEncontrado) {
        return null;
    }
  
    delete productos[id];
  };

