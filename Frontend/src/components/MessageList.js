import React from 'react'

const MessageList = ({messages}) => {
    
  return (
      <div className="message-list">
        <ul >
            {messages.map((message, index) => {
                const authorClass = message.author === "visitor" ? "message visitor" : "message chatbot"
                return (
                    <li key={index} className={authorClass}>
                        <div className='inner-message'>
                            <div>{message.content}</div>
                        </div>
                    </li>
                )
            })}
        </ul>
      </div>
  )
}

export default MessageList