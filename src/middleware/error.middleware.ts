import HttpException from "../common/http-exception";
import { Request, Response, NextFunction } from "express";

//Para que express entienda que es un manejador de error, debe tener exactamente los cuatro parámetros
export const errorHandler = (error: HttpException, request: Request, response: Response, next: NextFunction) => {
    const status = error.statusCode || error.status || 500;

    response.status(status).send(error);
};