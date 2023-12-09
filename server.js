const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const messages = [];

io.on('connection', (socket) => {
  console.log('Novo usuário conectado');

  // Enviar as últimas 20 mensagens ao novo usuário
  socket.emit('chat history', messages.slice(-20));

  socket.on('chat message', (message) => {
    messages.push(message);
    // Manter apenas as últimas 20 mensagens
    while (messages.length > 20) {
      messages.shift();
    }
    io.emit('chat message', message);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
