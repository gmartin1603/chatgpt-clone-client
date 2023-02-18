import React from "react"
import SvgComponent from "../assets/ChatGptSvg"
import avatar from "../assets/default-avatar.png"

const ChatMessage = ({message}) => {



  return (
    <div className={`chat-message ${message.user === "gpt" && "chatgpt"}`}>
        <div className={`chat-message-center ${message.user !== "gpt" && "user"}`}>
            <div className={`avatar ${message.user === "gpt" && "chatgpt"}`}>
               { message.user === "gpt"?
                <SvgComponent/>
                    :
                <img className="avatar" src={avatar} alt="avatar" />
                }
            </div>
            <div className="message">
            {message.message}
            </div>
        </div>
    </div>
  )
}

export default ChatMessage
