/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useMemo } from "react";

function App() {
  // creating the socket

  // useMemo will only recompute the memoized value when one of the deps has changed.

  // cookie accept krne ke liye

  const socket = useMemo(() => io("http://localhost:3000", {
    withCredentials: true
  }), []);

  // isse socket sirf component mount hone pr / page refresh hone pe  hi create hoga

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");

  const [socketId, setSocketId] = useState("");

  const [allMessages, setAllMessages] = useState([]);

  const [roomName, setRoomName] = useState("")

  console.log(allMessages);

  // but jaise hi message ki value change hoti  hai component re-render ho rha hai and socket baar badal rha hai - useMemo solve this


  const joinRoomHandler = (e) => {
    e.preventDefault() // jaise hi event trigger ho refresh na ho page
    
    console.log("Joining room:", roomName);
    
    socket.emit("join-room",roomName)
    setRoomName("")
  }


  const handleSubmit = (e) => {
    e.preventDefault(); // jaise hi event trigger ho refresh na ho page

    socket.emit("message", { message, room });
    setMessage("");
  };


  // ye io  default mein URL , matlab jo frontend ka URL hai uspe  backend dhundega kyuki dono ka same URl hona chahiye

  // Dono URl alag hai , toh CORS(cross origin resource sharing policies ) ke chalte block ho jayega

  // first time rendering mein useeffect chalega bss dependency khali se

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });

    // message recieved krne ke liye

    socket.on("recieve-message", (recieveMessage) => {
      console.log(recieveMessage);

      setAllMessages((allMessages) => [...allMessages, recieveMessage]);
    });

    socket.on("greeting", (res) => {
      console.log(res);
    }); // Adds the listener function as an event listener

    return () => {
      socket.disconnect();
    };
  }, []);

  // hum kr skte hai disconnect event ko trigger , kyuki useffect mein clean up function , jab component unmount hota hai

  // save krne pe refresh hoga and react ka feature hai , useeffect run hone se pehle cleanup function run hota hai

  return (
    <Container maxWidth="sm">
      <Box sx={{height: 150}}/>
      <Typography variant="h3" component="div" gutterBottom>
        Welcome to Socket.io
      </Typography>


      <Typography variant="h5" component="div" gutterBottom>
        {socketId}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>

        <TextField 
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}

        id="outlined-basic" 
        label="Room Name" 
        variant="outlined"
        />


        <Button type="submit" variant="contained" color="primary">
          Join Room
        </Button>
      </form>




      <form onSubmit={handleSubmit}>
        <TextField 
        value={message}
        onChange={(e) => setMessage(e.target.value)}

        id="outlined-basic" 
        label="Message" 
        variant="outlined"/>


        <TextField 
        value={room}
        onChange={(e) => setRoom(e.target.value)}

        id="outlined-basic" 
        label="Room" 
        variant="outlined"/>


        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>

      </form>

      <Stack>
        {allMessages.map((m,i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>

    </Container>
  );
}

export default App;


// http://localhost:3000/socket.io/' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.


// room id starting mein isliye nhi dikh rhi hai , kyuki jab tak component render ho rha hai , uss timetak instance create nhi hota hai , disconnected hota hai , isliye id nhi dikh rhi hai


// useState is a Hook in React that lets you add state to functional components.


// State is data that changes over time in your component and  When state changes, React re-renders the component to reflect the new value.


// niche list ayegi messages ki usse render kr skte hai , so humara connection ab shi kaam kr rha hai



// Now ab we have to see that ki hum group kaise banayenge and kisi user/socket ko  room join krwana ho  ----> ( room specific join kaise krayenge user/socket ko )



// join room button pe ek event trigger krna hai , naya room create krna hai and kaise krenge let we'll figure it out ---> joinRoomHandler function
