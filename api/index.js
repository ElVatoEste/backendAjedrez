const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Permite solicitudes desde cualquier origen
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
});

// Configura CORS para todas las rutas
app.use(cors({
    origin: '*', // Permite solicitudes desde cualquier origen
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('unirseSala', (idSala) => {
        socket.join(idSala);
        console.log(`Cliente unido a la sala: ${idSala}`);
    });

    socket.on('movimiento', (data) => {
        const { idSala, movimiento } = data;
        socket.to(idSala).emit('movimiento', movimiento);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
