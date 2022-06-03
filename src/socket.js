// import { io } from './index.js'


// io.on('connection', (socket) => {
//     console.log('New client connected')
//     console.log(socket.id)

//     socket.emit('message', {
//         message: 'Welcome to the chat app'
//     })

//     socket.on('sendMessage', (data) => {
//         console.log(data)
//         io.emit('message', data)
//     })

//     socket.on('disconnect', () => {
//         console.log('Client disconnected')
//     })
// })