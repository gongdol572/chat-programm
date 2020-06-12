var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//1~4번 째 줄 : 통신을 위해 express 모듈과 socket.io 모듈을 가져온다.
app.get("/",function(req, res){
  res.sendfile("client.html");
});
//6~8번 째 줄：서버를 실행시켰을 때,  localhost/:3000으로 들어오면 client.html 파일을 열어준다.
var count=1;
io.on('connection', function(socket){ //11번째 줄 : 사용자가 웹사이트 접속 시 , connection 이벤트가 생성되고, 사용자에 대한 socket 오브젝트가 생성된다.
  console.log('user connected: ', socket.id);
  var name = "user" + count++;
  io.to(socket.id).emit('change name',name);
  //13~14번째 줄 : 본인이 몇 번째 사용자인지 정의해준다. (n 번째 손님) 그 후, emit 함수을 통해 이벤트를 서버에서 클라이언트로 전달한다.

  socket.on('disconnect', function(){ //16번 째 줄 : 사용자가 사이트에서 disconnect 시 서버의 로그에 사용자가 disconnect 되었음을 알려준다.
    console.log('user disconnected: ', socket.id);
  });
  
  socket.on('send message', function(name,text){ //20번 째 줄 socket.on(‘send message’, function(name,text)) : send message 라는 이벤트를 받았을 때, 전달받은 메시지를 io.emit 해서 접속 사용자들에게 receive message를 보낸다.
    var msg = name + ' : ' + text;
    console.log(msg);
    io.emit('receive message', msg);
  });
});

http.listen('3000', function(){ //http.listen(‘3000’, funcion()) :  cmd 창에서 node server.js를 사용해 server를 활성화 시킬 때 서버는 3000번 포트를 활성화 시켜 서버를 연다.

  console.log("server on!");
});
