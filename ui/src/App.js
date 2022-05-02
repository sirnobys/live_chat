import './App.css';
import React from 'react';

import Main from './components/Main';
import Login from './components/Forms/Login';
import { useAuth0 } from "@auth0/auth0-react";
import { FormContext } from './context/FormContext';
import axios from 'axios'
import io from 'socket.io-client'

const socket = io('http://localhost:5000')

function App() {
  const [messages, setMessages] = React.useState([])
  const [message, setMessage] = React.useState("")
  const [room, setRoom] = React.useState("")
  const [blockedUsers, setBlockedUsers] = React.useState([])
  const [users, setUsers] = React.useState([])
  const [email, setEmail] = React.useState("")
  const [chatInfo, setChatInfo] = React.useState({})
  const [activeUsers, setActiveUsers] = React.useState([])

  const { user } = useAuth0()
  const host = 'http://localhost'
  const port = '5000'
  const url = host + ':' + port

  const fetchData = (url) => {
    axios.get(url).then((res) => {
      console.log(res);
      setUsers(res.data.users)
      setMessages(res.data.messages)
      setBlockedUsers(res.data.block)
    })
  }



  function setSocketListeners() {

    socket.on('message_sent', (data) => {
      data['received'] = Date.now()
      setMessages(data)
      console.log('message',data);
    })

    socket.on('user_activated', (data) => {
      setActiveUsers(Object.values(data))
    })

    socket.on('user_deactivated', (data) => {
      setActiveUsers(Object.values(data))
    })

    socket.on('user_blocked', (data) => {
      fetchData(url)
    })

  }

  React.useEffect(() => {
    fetchData(url)
    setSocketListeners()
  }, [])

  return (
    <FormContext.Provider value={{ users, blockedUsers, room, messages, setMessages, chatInfo, setChatInfo, user, socket, email, setEmail, message, setMessage, activeUsers, setActiveUsers }}>
      <div>
        {user ? <Main />  : <Login />}
      </div>
    </FormContext.Provider>

  );
}

export default App;
