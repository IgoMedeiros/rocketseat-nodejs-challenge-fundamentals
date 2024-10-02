import fs from 'node:fs/promises'

const databasePath = new URL('../database.json', import.meta.url)

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf-8').then((data) => {
            this.#database = JSON.parse(data) || {}
        }).catch(() => {
            this.#persist()
        })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database), 'utf-8')
    }

    select(table, search) {
        let data = this.#database[table] ?? []

        if(search) {
            data = data.filter(item => {
                const match = Object.entries(search).some(([key, value]) => {
                    return item[key].toLowerCase().includes(value.toLowerCase())
                })

                return match
            })
        }

        return data
    }

    insert(table, data) {
        this.#database[table] = [...(this.#database[table] ?? []), data]
        this.#persist()

        return data
    }

    update(table, id, updatedData) {
        const index = this.#database[table].findIndex(item => item.id === id)

        if(index !== -1) {
            this.#database[table][index] = {...this.#database[table][index], ...updatedData}
            this.#persist()

            return updatedData
        }

        return null
    }

    delete(table, id) {
        const index = this.#database[table].findIndex(item => item.id === id)

        if(index !== -1) {
            this.#database[table].splice(index, 1)
            this.#persist()

            return true
        }

        return false
    }

    complete(table, id) {
        const index = this.#database[table].findIndex(item => item.id === id)

        if(index !== -1) {
            this.#database[table][index].completed = true
            this.#database[table][index].completed_at = new Date().toLocaleString()
            this.#persist()

            return this.#database[table][index]
        }

        return null
    }
}