import React from 'react'

const MessageList = ({messages}) => {
  return (
      <div className="message-list">
        <ul >
            {messages.map((message, index) => {
                const authorClass = message.author === "visitor" ? "message visitor" : "message chatbot"
                return (
                    <li key={index} className={index + 1 === messages.length ? authorClass + " last-message" : authorClass}>
                        <div className='inner-message'>
                            <div>{message.text}</div>
                        </div>
                    </li>
                )
            })}
        </ul>
      </div>
  )
}

export default MessageList