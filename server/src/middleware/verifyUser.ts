import { Request, Response, NextFunction } from "express";
import { signJwt, verfiyJwt } from "../utils/jwt.utils";
import { prisma } from "..";
import { CustomError } from "../utils/error.utils";
//a middleware which verifies the jwt and adds the user field in the req object
export async function verifyUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { accessToken, refreshToken } = req.cookies
        const { decode: accessDecode, expired: accessExpired } = accessToken ? verfiyJwt(accessToken) : { decode: null, expired: true }
        if (accessDecode) {
            //@ts-ignore
            req.user = accessDecode.user
            return next()
        }
        const { decode: refreshDecode, expired: refreshExpired } = accessExpired && refreshToken ? verfiyJwt(refreshToken) : { decode: null, expired: true }
        //@ts-ignore
        const user = refreshDecode ? await prisma.user.findUnique({ where: { id: refreshDecode.userId }, select: { id: true, firstName: true, email: true } }) : null
        if (user) {
            const newAccessToken = signJwt({ user: user }, "15m")
            const newRefreshToken = signJwt({ userId: user.id }, "2d")
            const newUser = verfiyJwt(newAccessToken)
            //@ts-ignore
            req.user = newUser.decode!.user
            res.cookie("accessToken", newAccessToken, { httpOnly: true, secure: true, maxAge: 15 * 60 * 1000 })
            res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true, maxAge: 2 * 24 * 60 * 60 * 1000 })
            return next()
        } else {
            return next(new CustomError("Unauthorized re-login to continue", 401))
        }
    } catch (err: any) {
        return next(err)
    }
}