import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { useContext } from "react";
import { FormContext } from "../../context/FormContext";

export default function ChatWdget() {
  const {
    chatInfo,
    message,
    messages,
    setMessage,
    setChatInfo,
    socket,
    user,
    users,
    data,
  } = useContext(FormContext);
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!chatInfo.name) {
    return "open message";
  }
  let room = [user.email, chatInfo.email].sort();
  room = room.join("|")
  const submit = (e) => {
    e.preventDefault();
    socket.emit("send_message", {
      room: room,
      message: message,
      sender: user?.email,
      receiver: chatInfo?.email,
      sent: Date.now(),
    });

    setMessage("");
  };

  const blockUser=()=>{
    socket.emit("block_user", {
      user: user.email,
      blocked_user: chatInfo.email,
    });
  }

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const messageBox = () => {
    return (
      <div
        style={{
          bottom: "0",
          position: "fixed",
          zIndex: "1",
          backgroundColor: "white",
          marginBottom: "10px",
          width: "100%",
        }}
      >
        <form onSubmit={(e) => submit(e)}>
          <TextField
            style={{ width: "50%" }}
            id="outlined-textarea"
            label="Type message"
            multiline
            required
            value={message}
            onChange={(e) => handleChange(e)}
          />
          <Button
            className="mt-2 m-2"
            variant="contained"
            endIcon={<SendIcon />}
            type="submit"
            // onClick={() => submit()}
          >
            Send
          </Button>
        </form>
      </div>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <div class="row">
        <div
          className="chat col-lg-12"
          style={{
            top: "0",
            position: "fixed",
            zIndex: "1",
            backgroundColor: "white",
          }}
        >
          <div class="chat-header clearfix">
            <div class="row">
              <div class="col-lg-12">
                <a href="javascript:void(0);">
                  <img src={chatInfo?.picture} alt="avatar" />
                </a>
                <div class="chat-about">
                  <Button variant="contained" className="float-right" size="small" color="warning" onClick={()=>blockUser()}>Block</Button>
                  <h6 class="m-b-0">{chatInfo?.name}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        <div>
          <div class="row clearfix">
            <div class="col-lg-12">
              <div class="card">
                <div class="chat">
                  <div class="chat-history">
                    <ul class="m-b-0">
                      {messages.map(
                        (e) =>
                          e.room.includes(room) && (
                            <li class="clearfix">
                              <div
                                align={
                                  e.sender == user.email ? "right" : "left"
                                }
                                class="message-data"
                              >
                                <span class="message-data-time">
                                  10:10 AM, Today
                                </span>
                              </div>
                              <div
                                class={
                                  e.sender == user.email
                                    ? "message other-message float-right"
                                    : "message my-message"
                                }
                              >
                                {e.message}
                              </div>
                            </li>
                          )
                      )}

                      {/* <li class="clearfix">
                      <div class="message-data">
                        <span class="message-data-time">10:12 AM, Today</span>
                      </div>
                      <div class="message my-message">
                        Are we meeting today?
                      </div>
                    </li>
                    <li class="clearfix">
                      <div class="message-data">
                        <span class="message-data-time">10:15 AM, Today</span>
                      </div>
                      <div class="message my-message">
                        Project has been already finished and I have results to
                        show you.
                      </div>
                    </li> */}
                    </ul>
                    {messageBox()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div ref={messagesEndRef} />
        </div>
      }
    </Box>
  );
}
