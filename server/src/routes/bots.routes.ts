import express from "express"
const botsRouter = express.Router()
import { upload } from "../utils/multer.utils"
import { createBots, updateBot, updateBotConfig } from "../controller/bot.controller"

botsRouter.post("/create", upload.single("doc"), createBots)
botsRouter.patch("/update/:id", updateBotConfig)
botsRouter.put("/update/:id", upload.single("doc"), updateBot)

export default botsRouter
