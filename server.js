const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.get('/', (req,res) =>  {
  res.sendFile(__dirname + '/index.html')
})

let connectedUser = []

//socket.io connect
io.on("connection", socket => {
  console.log('a user connected')
  let userName = ''
  //Login
  socket.on('login', (name, callback) => {
    //如果名子是空的，做一點事
    if(name.trim().length === 0 ) {
      //沒安排事
      return
    }
    callback(true)
    userName = name
    connectedUser.push(userName)
    updateUserName()
    
  })

  //Recive chat message
  socket.on('chat message', msg => {
    
    //Emit message data
    io.emit('output', {
      name: userName,
      msg: msg
    })


  })


  // Disconnect
  socket.on('disconnect', () => {
    console.log('a user disconnected')
    connectedUser.splice(connectedUser.indexOf(userName), 1)
    console.log(connectedUser)
    updateUserName()
    
  })

  //Update username
  function updateUserName() {
    io.emit("loadUser", connectedUser)
  }

})


server.listen(port, () => console.log(`Server running on port ${port}`))