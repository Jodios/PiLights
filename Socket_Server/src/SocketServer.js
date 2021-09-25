const Websocket = require('ws');
const express = require('express');

const port = 8080;
var status = {
    state: "color",
    hex: "#AD5050",
    message: {}
}


const app = express();
app.get("/", (req, res) => {
    let response = {
        "status": "UP" 
    };
    res.send(response)
});
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


const socketServer = new Websocket.Server({ server: app });
socketServer.on('connection', (socket) => {

    socket.send(JSON.stringify(status));

    console.log(`${socket} connected. ${socketServer.clients.size} clients currently connected.`);

    socket.on('close', () => { console.log(`${socket} disconnected.`) });

    socket.on('message', (message) => {
        console.log(`Client posted ${message}`);
        let data = JSON.parse(message);
        if (data['hex'])
            status = { hex: data['hex'], state: `Color: ${data['hex']}` }
        if (data['command'])
            status = { hex: data['hex'], state: `Command: ${data['command']}` }
        status['message'] = data;

        socketServer.clients.forEach(client => {
            if (client != socket)
                client.send(JSON.stringify(status));
        });
    })

});