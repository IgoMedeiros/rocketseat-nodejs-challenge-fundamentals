import { generate } from 'csv-generate'
import { parse } from 'csv-parse'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import { Database } from '../database.js'

const csvFile = new URL('../../tasks.csv', import.meta.url)
const database = new Database()

export async function csvIterator() {
    const content = await fs.readFile(csvFile, 'utf-8')
    const records = parse(content, {columns: true})
    
    for await (const record of records) {
        const task = {
            id: randomUUID(),
            title: record.title,
            description: record.description,
            completed: false,
            created_at: new Date().toLocaleString(),
            completed_at: null,
            updated_at: null,
        }

        database.insert('tasks', task)
    }
}