API básica en Node
===
Se trata de unas pruebas, realizando una api básica con TypeScript y siguiendo una entrada del blog de auth0.com. No usa ninguna base de datos externa, se "guarda" en memoria; es simplemente para realizar unas pruebas y como mucho algún día aspirar al inicio de un skeleton en algún proyecto muy pequeño.

Instalaciones iniciales y configuraciones
===

```
npm init -y
npm i express dotenv cors helmet
npm i -D typescript
npm i -D @types/node @types/express @types/dotenv @types/cors @types/helmet
npm i -D ts-node-dev
```

Helmet agrega una capa de seguridad contra ataques comunes.
ts-node-dev es para usar desde un script, para recompilar el TypeScript.


Creación del tsconfig.json, mediante npx, para configurar el TypeScript (lo dejaremos con la configuración de fábrica), ejecutando:
```
npx tsc --init
```

Creamos un archivo .env a mano, y para configurar una variable que usaremos para indentificar el puerto, le añadimos en el .env el contenido:
```
PORT=7000
```

En el "scripts" del package.json, le añadimos:
```
"dev": "ts-node-dev --respawn --pretty --transpile-only src/index.ts"
```

Creación del servidor express con TypeScript
===

Creamos la carpeta src y dentro de ella un archivo index.ts que inicialmente tendrá, obviamente esto se modificará con el transcurso del desarrollo de la API
```
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";

//Recogida de la configuración
dotenv.config();

//Comprobaciones básicas
if (!process.env.PORT) {
    process.exit(1);
 }

//Variables
const PORT: number = parseInt(process.env.PORT as string, 10); 
const app = express();

//Configuration del servidor Express
app.use(helmet());
app.use(cors());
app.use(express.json());

//Levantamos el servidor
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
```

Levantamiento del servidor básico
---

Tras esto, para levantar el servidor, usando lo que acabamos de hacer, podríamos ejecutar:
``` 
npm run dev
``` 

Creación de Modelos de datos
====
Dentro de src creamos la carpeta models y dentro de ella producto.interface.ts, quedando src/models/producto.interface.ts:
```
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
```

Dentro de src creamos la carpeta models y dentro de ella productos.interface.ts, quedando src/models/productos.interface.ts:
```
import { Producto } from "./producto.interface";

export interface Productos {
  [key: number]: Producto;
}
```



Creación del Servicio
====
Dentro de src creamos la carpeta services y dentro de ella productos.service.ts, quedando src/services/productos.service.ts:
```
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
    ...
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
```


Enrutado de los servicios
====
Dentro de src creamos la carpeta routers y dentro de ella productos.router.ts, quedando src/routers/productos.router.ts:
```
import express, { Request, Response } from "express";
import * as ProductoService from "../services/productos.service";
import { BaseProducto, Producto } from "../models/producto.interface";

//Instanciamos un enrutador
export const productosRouter = express.Router();

//Configuramos rutas y sus handlers
productosRouter.get("/", async (req: Request, res: Response) => {
    try {
        const productos: Producto[] = await ProductoService.findAll();

        res.status(200).send(productos);
    } catch (e) {
        res.status(500).send(e.message);
    }
});


// GET productos/:id
productosRouter.get("/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    try {
        const producto: Producto = await ProductoService.find(id);

        if (producto) {
            return res.status(200).send(producto);
        }

        res.status(404).send("producto no encontrado");
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// POST productos
productosRouter.post("/", async (req: Request, res: Response) => {
    try {
        const producto: BaseProducto = req.body;

        const nuevoProducto = await ProductoService.create(producto);

        res.status(201).json(nuevoProducto);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// PUT productos/:id
productosRouter.put("/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    try {
        const datosProductoAActualizar: Producto = req.body;

        const productoExistente: Producto = await ProductoService.find(id);

        if (productoExistente) {
            const productoActualizado = await ProductoService.update(id, datosProductoAActualizar);
            return res.status(200).json(productoActualizado);
        }

        const nuevoProducto = await ProductoService.create(datosProductoAActualizar);

        res.status(201).json(nuevoProducto);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// DELETE productos/:id
productosRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);
        await ProductoService.remove(id);

        res.sendStatus(204);
    } catch (e) {
        res.status(500).send(e.message);
    }
});
```

Luego añadimos estos enrutados a nuestro servidor Express, en index.ts:
```
import {productosRouter} from "./routers/productos.router";
```

Y después, para que las peticiones a resolver partan de laurl de /api/productos/...,  añadimos, a continuación de la linea de app.use(express.json()): 
```
app.use("/api/productos",productosRouter);
```

Pruebas
===
Por ejemplo desde el postman, se puede:
- crear un GET con url http://localhost:7000/api/productos y devolverá la colleción de productos.
- crear un GET con url http://localhost:7000/api/productos/2 y devolverá el producto 2
- crear un DELETE con url http://localhost:7000/api/productos/2 y luego probar el GET del mismo producto para ver que se ha eliminado.
- crear un POST con url http://localhost:7000/api/productos ,  en los Headers añadir entrada con KEY: Content-Type y VALUE: application/json, luego le pasamos los datos en el campo raw de la pestaña Body:
```
    {
    "nombre": "Ensalada",
    "precio": 499,
    "descripcion": "Comida sana",
    "imagen": "https://cdn.auth0.com/blog/whatabyte/salad-sm.png"
    }
```
devolverá el mismo objeto json pasado pero con el "id" del nuevo producto