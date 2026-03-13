import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import SOCKET_URL from '../../config';
const useSocket = (url=SOCKET_URL) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io.connect(url);

    socketInstance.on("connect", () => {
      // // console.log("Connected to server");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [url]);

  return socket;
};

export default useSocket;
