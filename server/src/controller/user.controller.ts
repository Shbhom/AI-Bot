import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/error.utils";
import bcrypt from "bcrypt"
import { prisma } from "..";
import { signJwt } from "../utils/jwt.utils";

export async function registerController(req: Request, res: Response, next: NextFunction) {
    try {
        const { firstName, lastName, email, password, role }: { firstName: string, lastName: string | undefined, email: string, password: string, role: string | null } = req.body
        if (!firstName || !email || !password) {
            throw new CustomError("empty fields", 400)
        }
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const data: any = {
            firstName: firstName,
            email: email,
            password: hash
        }
        if (lastName) {
            data.lastName = lastName
        }
        if (role) {
            data.role = role
        }
        const newUser = await prisma.user.create({ data: data, select: { id: true, firstName: true, email: true } })
        const accessToken = signJwt({ user: newUser }, "15m")
        const refreshToken = signJwt({ userId: newUser!.id }, "2d")
        res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, maxAge: 15 * 60 * 1000 })
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, maxAge: 2 * 24 * 60 * 60 * 1000 })
        res.status(201).json({
            message: "New user created Successfully",
            newUser
        })
    } catch (err: any) {
        return next(err)
    }
}

export async function loginController(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password }: { email: string, password: string } = req.body
        if (!email || !password) {
            throw new CustomError("empty fields", 400)
        }
        const user = await prisma.user.findUnique({ where: { email: email }, select: { id: true, firstName: true, email: true, password: true } })
        if (!user) {
            throw new CustomError("invalid credentials", 403)
        }
        const isValid = await bcrypt.compare(password, user!.password) ? true : false
        if (isValid) {
            const accessToken = signJwt({ user: user }, "15m")
            const refreshToken = signJwt({ userId: user!.id }, "2d")
            res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, maxAge: 15 * 60 * 1000 })
            res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, maxAge: 2 * 24 * 60 * 60 * 1000 })
            res.status(200).json({
                message: `welcome user ${user.firstName}`,
            })
        } else {
            throw new CustomError("invalid credentials", 403)
        }
    } catch (err: any) {
        return next(err)
    }
}

export async function getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { user } = req
        if (user) {
            return res.status(200).json({
                userDetail: user
            })
        } else {
            throw new CustomError("Unauthorized re-login to continue", 401)
        }
    } catch (err: any) {
        return next(err)
    }

}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    if (!id || typeof id !== "string") {
        throw new CustomError("invalid id", 400)
    }
    const user = await prisma.user.findUnique({ where: { id: id }, select: { id: true, firstName: true, email: true } })

    if (user) {
        res.status(200).json({
            "message": "user found",
            user: user
        })
    } else {
        throw new CustomError("user not found", 404)
    }
}

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
    const users = await prisma.user.findMany()
    if (users) {
        res.status(200).json({
            "message": "user found",
            user: users
        })
    } else {
        throw new CustomError("user not found", 404)
    }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
    const { firstName, lastName, email, password, role }: { firstName: string, lastName: string | undefined, email: string, password: string, role: string | null } = req.body
    const { user } = req
    if (!user) {
        throw new CustomError("Unauthorized re-login to continue", 401)
    }
    const data: any = {}
    if (firstName) {
        data.firstName = firstName
    }
    if (lastName) {
        data.lastName = lastName
    }
    const updateUser = await prisma.user.update({ where: { id: user!.id }, data: data })
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { user } = req
        if (!user) {
            throw new CustomError("Unauthorized re-login to continue", 401)
        }
        const deleteUser = await prisma.user.delete({ where: { id: user!.id } })
        res.status(204).json({
            "message": "user deleted successfully",
            user: deleteUser
        })
    } catch (err: any) {
        return next(err)
    }
}


