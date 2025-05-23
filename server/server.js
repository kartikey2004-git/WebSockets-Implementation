import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const port = 3000;

const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  }, // similar to CORS package
}); // Socket ka instance create kr liya  --> io : server/circuit

// cors ka package jaise API mein use krna hai , toh humein middleware pass krna padega

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("hello ji");
});

// Adds the listener function as an event listener --> jaise hi client side pe koi bhi socket connect hoga toh console hoga

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  /* 

  ---> Emits to this client. 

  socket.emit("greeting","Welcome to the server")

  socket.broadcast.emit("greeting",` ${socket.id} join the server `,)  
  
  */

  //  jaise message event trigger ho frontend se toh data milega and usko console kr rhe hai

  //  iss method se hum data access kr skte hai backend mein , so ab humein iss message ko baaki logo ko dikhana hai woh depend krta hai scenarios pe

  socket.on("message", ({ message, room }) => {
    console.log(message, room);

    // to() : a room, or an array of rooms  and Targets a room when emitting.

    socket.to(room).emit("recieve-message", message);
  });

  // and agar hum io ki jagah socket bhi likh de toh same kaam krega kyuki jab hum to() lagayenge to socket.io doesn't matter

  // brodcast mein jo bhi message ek user/socket bhejega wo use nhi milega uske alawa sabko milega

  // io means server/circuit jisse message saare users/sockets pe chala jayega

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User joined room ${room}`);
  });

  // jab hum baat kr rhe socket ki toh individual socket jisne req kri wo hi join krega room ko

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// app internally http server create kr rha hota hai ( naye server ka instance create hoga aise )

/* 

do socket connect ho chuke server pe 

--> socket.emit krne pe jo particular socket hota usi ko message jayega

--> socket.broadcast.emit krne jo particular socket hai uspe nhi jayega message baaki saare sockets mein jayega 


usually hum emit nhi krte hai server , hum listener lagate hai server pe and emit frontend se krte hai  and jo listener hote hai unke andar se emit krte hai


Now we have to see ki Socket1/user1 and user3/Socket3 hi aapas mein baat krein ( personal chat )


iske liye hum use krenge rooms ka , particular room mein bhejenge message , jaise ki humein pata hai , har ek socket already room mein hota hai , toh jo uski id hai ( wo room mein already hai )



*/
