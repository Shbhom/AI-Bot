import { Request, Response, NextFunction, query } from "express";
import { CustomError } from "../utils/error.utils";
import { embeddings, prisma } from "..";
import { parsePdf } from "../utils/pdf.utils";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import path from "path";
import { Document } from "langchain/document"
import { pinecone, uploadToPinecone } from "../utils/bot.utils";

export async function getAllBots(req: Request, res: Response, next: NextFunction) {
    try {
        const { user } = req
        if (!user) {
            throw new CustomError("Unauthorized re-login to continue", 401)
        }
        const bots = await prisma.bot.findMany({ where: { userId: user!.id }, select: { id: true, title: true, destinationUrl: true, tokensUtilized: true } })
        return res.status(200).json({
            message: "successfull",
            bots
        })
    } catch (err: any) {
        return next(err)
    }
}

export async function getBotsById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const bots = await prisma.bot.findUnique({ where: { id: id }, select: { id: true, title: true, destinationUrl: true, tokensUtilized: true } })
        return res.status(200).json({
            message: "successfull",
            bots
        })
    } catch (err: any) {
        return next(err)
    }
}

export async function createBots(req: Request, res: Response, next: NextFunction) {
    try {
        const { user } = req
        if (!user) {
            throw new CustomError("Unauthorized re-login to continue", 401)
        }
        const { title, destinationUrl, companyName }: { title: string, destinationUrl: string, companyName: string } = req.body
        if (!title || typeof title !== "string") {
            throw new CustomError("invalid title", 400)
        }
        if (!destinationUrl || typeof destinationUrl !== "string") {
            throw new CustomError("invalid title", 400)
        }
        if (!companyName || typeof companyName !== "string") {
            throw new CustomError("invalid title", 400)
        }
        const { file } = req
        if (file!.mimetype !== "application/pdf") {
            throw new CustomError("invalid file type please provide pdfs", 400)
        }
        const text = await parsePdf(path.resolve(file!.path))
        let docs: Document[] = [];
        let data: string = ''
        for (const chunk of text) {
            data += chunk
        }
        console.log(data)
        var regex = /Q\d+:/g;

        var matches = data.match(regex) as string[];

        var parts = data.split(regex);

        for (var i = 0; i < parts.length - 1; i++) {
            parts[i] = matches[i - 1] + parts[i];
        }

        for (let chunk of parts) {
            if (typeof chunk !== "string") {
                continue
            }
            const doc = new Document({ pageContent: chunk, metadata: { destinationUrl } })
            docs.push(doc)
        }
        await uploadToPinecone(docs, embeddings)

        const bot = await prisma.bot.create({ data: { title: title, destinationUrl: destinationUrl, userId: req.user!.id } })

        //todo: give script tag to user as json

        res.status(200).json({
            title,
            destinationUrl,
            file
        })
    } catch (err: any) {
        return next(err)
    }
}

export async function updateBotConfig(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const { title, destinationUrl }: { title: string, destinationUrl: string } = req.body
        let data: any = {}
        if (title && typeof title === "string") {
            data.title = title
        }
        if (destinationUrl && typeof destinationUrl === "string") {
            data.destinationUrl = destinationUrl
        }
        const updatedBot = await prisma.bot.update({ where: { id: id }, data: data, select: { title: true, destinationUrl: true, tokensUtilized: true } })
        return res.status(200).json({
            message: "successfuly updated bot config",
            bot: updatedBot
        })

    } catch (err: any) {
        return next(err)
    }

}

export async function updateBot(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    if (!id || typeof id !== "string") {
        throw new CustomError("invalid id", 400)
    }
    const bot = await prisma.bot.findUnique({ where: { id: id }, select: { id: true, title: true, destinationUrl: true, tokensUtilized: true } })
    if (!bot) {
        throw new CustomError("bot not found", 404)
    }
    const { file } = req
    if (!file || file!.mimetype !== "application/pdf") {
        throw new CustomError("no file provided or invalid file type requires PDF", 400)
    }
    //todo: delete old embeddings
    const vectorstore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex: pinecone.index(process.env.PINECONE_INDEX as string) })
    const result = await vectorstore.similaritySearch("", 1000, { PineconeMetaData: { destinationUrl: bot.destinationUrl } })
    console.log(result)

    return res.status(200).json({
        message: "Docs updated successfully"
    })


    // const text = await parsePdf(path.resolve(file!.path))
    // let docs: Document[] = [];
    // let data: string = ''
    // for (const chunk of text) {
    //     data += chunk
    // }
    // console.log(data)
    // var regex = /Q\d+:/g;

    // var matches = data.match(regex) as string[];

    // var parts = data.split(regex);

    // for (var i = 0; i < parts.length - 1; i++) {
    //     parts[i] = matches[i - 1] + parts[i];
    // }

    // for (let chunk of parts) {
    //     if (typeof chunk !== "string") {
    //         continue
    //     }
    //     const doc = new Document({ pageContent: chunk, metadata: { destinationUrl: bot.destinationUrl } })
    //     docs.push(doc)
    // }
    // await uploadToPinecone(docs, embeddings)

}