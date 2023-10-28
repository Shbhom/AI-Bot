import express, { Request, Response } from "express"
import { getAllUsers, getCurrentUser, getUserById, loginController, registerController } from "../controller/user.controller"
import { verifyUser } from "../middleware/verifyUser"
const userRouter = express.Router()

userRouter.post("/register", registerController)
userRouter.post("/login", loginController)
userRouter.get("/me", verifyUser, getCurrentUser)
userRouter.get("/:id", verifyUser, getUserById)// get User by id
userRouter.get("/me", verifyUser, getAllUsers)
// userRouter.get("/me",verifyUser,getCurrentUser) update user by id
// userRouter.get("/me",verifyUser,getCurrentUser) delete user by id

export default userRouter