import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";

export const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
    environment: process.env.PINECONE_ENV as string
})

export async function uploadToPinecone(docs: any, embeddings: any, destinationUrl: string, maxConcurrency?: number) {
    const index = pinecone.Index(process.env.PINECONE_INDEX as string)
    let options: any = {
        pineconeIndex: index,

    }
    if (maxConcurrency) {
        options.maxConcurrency = maxConcurrency
    }
    await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex: index, filter: { destinationUrl: { $eq: destinationUrl } }
    })
}