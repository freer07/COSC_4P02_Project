import React, { useState } from 'react';

const SendMessageForm = ({sendMessage}) => {


    const [message, setMessage] = useState("")

    const handleOnChange = newMessage => {
        if(newMessage !== message){
            setMessage(newMessage);
        }
    };

    const handleSubmit = event => {
        event.preventDefault()
        if(message){
            sendMessage(message)
            setMessage("");
        }
    };

    return (
        <form
        onSubmit={e => {handleSubmit(e)}}
        className="send-message-form">
            <input
                onChange={e => handleOnChange(e.target.value)}
                value={message}
                placeholder="Send a message..."
                type="text" />
            <button className='submit-button' role="button" onClick={e => {handleSubmit(e)}}>Send</button>
        </form>
    )
}

export default SendMessageForm