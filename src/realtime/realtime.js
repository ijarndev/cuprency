import express from 'express'
import { Server } from "socket.io"
import { createServer } from 'node:http'
import { getAllCurrencies, getCurrencyValue } from '../database.js'

const PORT = process.env.RTS_PORT
let CLIENTS = []

const app = express()
const server = createServer(app)
const IO = new Server(server, { cors: { origin: '*' } })

server.listen(PORT, () => {
    console.log('Realtime server running on port', PORT)
})

IO.on('connection', (socket) => {
    CLIENTS.push({
        id: socket.id,
        host: socket.handshake.headers.host,
        client_type: socket.handshake.headers.client_type
    })

    console.clear()
    console.log(CLIENTS)

    socket.on('update', (data) => {
        socket.broadcast.emit('update', data)
    })

    getAllCurrencies().then(data => { socket.emit('update', data) })

    socket.on('disconnect', () => {
        const clientIndex = CLIENTS.findIndex(client => client.id === socket.id)
        CLIENTS.splice(clientIndex, 1)
    })
})

app.get('/realtime', (req, res) => {
    res.sendFile(process.cwd() + '/src/realtime/web-view/index.html')
})