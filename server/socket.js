const io = require('socket.io')(3000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

// console.log('socket is it successfull');

io.on("connection", (socket) => {
    // console.log('socket is connected successfully', socket.id);
    socket.on("send-message", (message) => {
        // console.log(message);
        socket.emit("recived-message", message);
    })

    // for calling // my joining here
    socket.emit('me', socket.id)

    socket.on('disconnect', () => {
        socket.broadcast.emit("call ended")
    })

    socket.on('calluser', ({ userToCall, signalData, from, name }) => {
        console.log({ userToCall, signalData, from, name });
        io.to(userToCall).emit("calluser", {
            signal: signalData, from, name
        })
    })

    socket.on('answercall', (data) => {
        io.to(data.to).emit('callended', data.signal)
    })

})

io.on("error", (error) => {
    console.error(error);
})