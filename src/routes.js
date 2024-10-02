import { randomUUID } from 'node:crypto'
import { Database } from "./database.js"
import { buildRoutePath } from './utils/build-route-path.js'
import { csvIterator } from './utils/csv-iterator.js'

const database = new Database()
const date = new Date()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query
            const tasks = database.select('tasks', search ? {
                title: search, description: search
            } : null)

            return res.end(JSON.stringify(tasks))
        },
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: async (req, res) => {
            const { title, description, csv } = req.body
            if(Boolean(csv)) {
                await csvIterator()

                return res.writeHead(201).end()
            } else {
                const task = {
                    id: randomUUID(),
                    completed: false,
                    created_at: date.toLocaleString(),
                    completed_at: null,
                    updated_at: null,
                }
    
                if(title) {
                    task.title = title
                }
    
                if(description) {
                    task.description = description
                }
    
                const taskCreated = database.insert('tasks', task)

                return res.writeHead(201).end(JSON.stringify(taskCreated))
            }

        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body
            const task = {updated_at: date.toLocaleString()}

            if(title) {
                task.title = title
            }

            if(description) {
                task.description = description
            }
            
            const updatedTask = database.update('tasks', id, task)

            if(!updatedTask) {
                return res.writeHead(404).end(JSON.stringify({message: 'Task not found!'}))
            }

            return res.writeHead(201).end(JSON.stringify(updatedTask))
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const deleted = database.delete('tasks', id)

            if(!deleted) {
                return res.writeHead(404).end(JSON.stringify({message: 'Task not found!'}))
            }

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params
            const completedTask = database.complete('tasks', id)

            if(!completedTask) {
                return res.writeHead(404).end(JSON.stringify({message: 'Task not found!'}))
            }
            return res.writeHead(200).end(JSON.stringify(completedTask))
        }
    },
]