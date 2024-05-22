import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client'
import State from './state';
import VideoPlayer from './Components/VideoPlayer';
import Notifications from './Components/Notifications';
import Options from './Components/Options';
import Peer from 'simple-peer';
import './init'


function App() {

  const socket = useRef();
  const [message, setMessage] = useState();
  // for calling
  const [stream, setStream] = useState(null)
  const [me, setMe] = useState('');
  const [call, setCall] = useState(null)
  const [callAccepted, setCallAccepted] = useState(false)
  const [callEnded, setCallEnded] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    socket.current = io("ws://localhost:3000")
  }, [])

  // For message
  useEffect(() => {
    socket.current.emit("send-message", 'this is test message 👌');
  }, [])

  useEffect(() => {
    socket.current.on("recived-message", (message) => {
      console.log(message, "this is the message from socket");
      setMessage(message)
    });
  }, [])

  // get permission microphone
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        // video ifream 
        myVideo.current.srcObject = currentStream;
      })

    socket.current.on('me', (id) => {
      setMe(id)
    })

    socket.current.on('calluser', ({ from, name: callerName, signal }) => {
      setCall({ isRecievedCall: true, from, name: callerName, signal })
    })
  }, [])

  const answeCall = () => {
    setCallAccepted(true)
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    })

    peer.on('signal', (data) => {
      socket.current.emit('answercall', { signal: data, to: call.from });
    })

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    })

    peer.signal(call.signal)
    connectionRef.current = peer;
  }

  const callUser = (id) => {
    if (!stream) {
      console.error('Stream is not available');
      return;
    }

    try {
      // let peer;
      // try {
      //   peer = new Peer({
      //     initiator: true,
      //     trickle: false,
      //     stream,
      //   });
      // } catch (peerError) {
      //   console.error('Error initializing Peer:', peerError);
      //   throw peerError; // Re-throw to catch it in the outer catch block
      // }

      // console.log('Peer initialized:', peer);
      let peer;
      try {
        peer = new Peer({ initiator: true, trickle: false });
        console.log('Peer initialized:', peer);
      } catch (peerError) {
        console.error('Error initializing Peer:', peerError);
        throw peerError; // Re-throw to catch it in the outer catch block
      }

      peer.addStream(stream);

      peer.on('signal', (data) => {
        console.log('Signal event triggered');
        console.log('Signal data:', data);
        socket.current.emit('calluser', { userToCall: id, signalData: data, from: me, name });
      });

      peer.on('stream', (currentStream) => {
        console.log('Stream event triggered');
        console.log('Received remote stream:', currentStream);
        userVideo.current.srcObject = currentStream;
      });

      peer.on('error', (err) => {
        console.error('Peer error:', err);
      });

      socket.current.on('callaccepted', (signal) => {
        console.log('Call accepted with signal:', signal);
        setCallAccepted(true);
        peer.signal(signal);
      });

      connectionRef.current = peer;

    } catch (error) {
      console.error('Error during callUser execution:', error);
    }
  }

  const leaveCall = () => {
    setCallEnded(true)
    connectionRef.current.destroy()
    window.location.reload();
  }

  return (
    <>
      <h1 className="text-3xl font-bold underline">
        Video Chat App 🚀🚀🚀
      </h1>
      <VideoPlayer name={name} callAccepted={callAccepted} callEnded={callEnded} myVideo={myVideo} userVideo={userVideo} stream={stream} call={call} />
      <Notifications />
      <Options setName={setName} me={me} name={name} callAccepted={callAccepted} callEnded={callEnded} answeCall={answeCall} callUser={callUser} stream={stream} leaveCall={leaveCall} call={call} />
    </>
  )
}

export default App


/*
  socket client connectin
  socket server connectin
  emit
  on
  method //function
*/ 