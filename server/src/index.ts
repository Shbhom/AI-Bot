import express from "express"
import cookieParser from "cookie-parser"
import { PrismaClient } from '@prisma/client'
import "dotenv/config"
import { errorHandler } from "./utils/error.utils"
import userRouter from "./routes/user.routes"
import botsRouter from "./routes/bots.routes"
import { HuggingFaceInferenceEmbeddings } from "langchain/embeddings/hf";
import { pinecone } from "./utils/bot.utils"


const port = process.env.PORT
const app = express()

export const prisma = new PrismaClient()
export const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HF_API_KEY as string, // In Node.js defaults to process.env.HUGGINGFACEHUB_API_KEY
});

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use("/api/user", userRouter)
app.use("/api/bot", botsRouter)
app.use(errorHandler)

app.listen(port, async () => {
    await prisma.$connect().then(() => { console.log("Connected to DB") })
    console.log(`app is listening to port ${port}`)
})