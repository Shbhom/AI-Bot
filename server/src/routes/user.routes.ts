import express, { Request, Response } from "express"
import { deleteUser, getAllUsers, getCurrentUser, getUserById, loginController, registerController, updateUser } from "../controller/user.controller"
import { verifyUser } from "../middleware/verifyUser"
const userRouter = express.Router()

userRouter.post("/register", registerController)
userRouter.post("/login", loginController)
userRouter.get("/me", verifyUser, getCurrentUser)
userRouter.get("/:id", verifyUser, getUserById)// get User by id
userRouter.patch("/me", verifyUser, updateUser) //update current user
userRouter.delete("/me", verifyUser, deleteUser) //delete current user

export default userRouter