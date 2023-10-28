import { Request, Response, NextFunction } from "express"


export class CustomError extends Error {
    public statusCode: number
    constructor(message: string, statusCode?: number) {
        super(message)
        this.statusCode = statusCode || 500
    }
}

export async function errorHandler(err: CustomError, req: Request, res: Response, next: NextFunction) {
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            message: err.message
        })
    } else {
        return res.status(500).json({
            message: err.message
        })
    }
}