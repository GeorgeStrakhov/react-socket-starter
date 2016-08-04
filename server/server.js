import path from 'path';
import http from 'http';
import express from 'express';
import fallback from 'express-history-api-fallback';
import socketio from 'socket.io';

//settings
const env = (process.env.NODE_ENV == 'production') ? 'prod' : 'dev';
const isDev = (env == 'dev');
const settings = {
  env: env,
  port: (isDev) ? 4242 : process.env.PORT
};

//server config
const app = express();
const root = __dirname + '/public'
const server = http.Server(app);
app.use(express.static(root))
app.use(fallback('index.html', { root: root }))
const io = socketio(server);

//socket.io
let numberOfClients = 0;
io.on('connection', function(socket) {
  numberOfClients++;
  console.log('New client connected: '+socket.id);
  let c = 1;
  const inter = setInterval(()=>{
    c++;
    socket.emit('updateCounter', {
      c: c,
      numberOfClients: numberOfClients
    });
    console.log(c);
  }, 1000);
  socket.on('disconnect', ()=>{
    clearInterval(inter);
    numberOfClients--;
  });

});

//start server
server.listen(settings.port);
