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
console.log(req);
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