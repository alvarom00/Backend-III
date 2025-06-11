import { promises as fs } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const readJSON = async (filePath) => {
    try {
        const data = await fs.readFile(join(__dirname, '../data', filePath), 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        return []
    }
}

const writeJSON = async (filePath, data) => {
    await fs.writeFile(join(__dirname, '../data', filePath), JSON.stringify(data, null, 2))
}

export { readJSON, writeJSON }
