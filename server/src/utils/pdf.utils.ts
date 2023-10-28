import pdf from "pdf-parse"
import * as fs from "fs/promises"

export async function parsePdf(pdfPath: string) {
    const pdfData = await fs.readFile(pdfPath)
    const pdfText = await pdf(pdfData)

    const qNa = pdfText.text.split("\n")
    return qNa.filter(chunk => chunk.trim() !== "")
}