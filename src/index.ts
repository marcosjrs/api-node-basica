import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import {productosRouter} from "./routers/productos.router";

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
app.use("/api/productos",productosRouter);

//Levantamos el servidor
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });