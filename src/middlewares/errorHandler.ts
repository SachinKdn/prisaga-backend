import { type ErrorRequestHandler } from "express";
import { ErrorResponse } from "../helper/response";

const errorHandler : ErrorRequestHandler = (err, req , res , next)=>{
    const response : ErrorResponse = {
        success : false,
        status: (err?.status ?? 500) as number,
        message: (err?.message ?? "Something went wrong") as string,
        data: err?.data ?? {},
    }
    res.status(response.status).send(response);
    next();
}

export default errorHandler;