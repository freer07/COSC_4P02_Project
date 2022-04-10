import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import './SendMessageForm.scss';
import { VISITOR_IDENTIFIER } from '../../constants/constants.js';

function SendMessageForm({ messages, sendMessage }) {
	const [message, setMessage] = useState('');
	const [previousMessageIndex, setPreviousMessageIndex] = useState(-1);

	const handleOnChange = newMessage => {
		if (newMessage !== message) {
			setPreviousMessageIndex(-1);
			setMessage(newMessage);
		}
	};

	const handleSubmit = event => {
		event.preventDefault();
		const newMessage = (message.trim()).replace(/(<([^>]+)>)/gi, '');
		if (newMessage) {
			setPreviousMessageIndex(-1);
			sendMessage(newMessage);
			setMessage('');
		}
	};

	useEffect(() => {
		const handleDown = (event) => {
			const activeElement = document.activeElement;
			const messageInputField = document.getElementById('message-input-field');
			if (event.keyCode === 40 && messages.length !== 0 && messageInputField === activeElement) {
				const visitorMessages = (messages.flatMap(
					({author, text}) => author === VISITOR_IDENTIFIER ? [text] : [])
				).reverse();
				if (previousMessageIndex <= 0) {
					setMessage('');
					setPreviousMessageIndex(-1);
				} else if (previousMessageIndex >= 1 ) {
					const nextsMessageIndex = previousMessageIndex - 1;
					const messageLength = visitorMessages[nextsMessageIndex].length;
					setMessage(visitorMessages[nextsMessageIndex]);
					setPreviousMessageIndex(nextsMessageIndex);
					messageInputField.setSelectionRange(messageLength, messageLength);
				}
			}
		};
		const handleUp = (event) => {
			const activeElement = document.activeElement;
			const messageInputField = document.getElementById('message-input-field');
			if (event.keyCode === 38 && messages.length !== 0 && messageInputField === activeElement) {
				const visitorMessages = (messages.flatMap(
					({author, text}) => author === VISITOR_IDENTIFIER ? [text] : []
				)).reverse();
				const lastMessageIndex = visitorMessages.length - 1;
				if (previousMessageIndex === lastMessageIndex) {
					setMessage(visitorMessages[lastMessageIndex]);
					setPreviousMessageIndex(lastMessageIndex);
				} else if (previousMessageIndex <= visitorMessages.length ) {
					event.preventDefault();
					const nextsMessageIndex = previousMessageIndex + 1;
					const messageLength = visitorMessages[nextsMessageIndex].length;
					setMessage(visitorMessages[nextsMessageIndex]);
					setPreviousMessageIndex(nextsMessageIndex);
					messageInputField.setSelectionRange(messageLength, messageLength);
				}
			}
		};
		window.addEventListener('keydown', handleDown);
		window.addEventListener('keydown', handleUp);
		return () => {
			window.removeEventListener('keydown', handleDown);
			window.removeEventListener('keydown', handleUp);
		};
	}, [messages, previousMessageIndex]);

	return (
		<form
			onSubmit={e => {handleSubmit(e);}}
			className="send-message-form">
			<input
				id="message-input-field"
				onChange={e => handleOnChange(e.target.value)}
				value={message}
				placeholder="Send a message..."
				type="text"
				autoComplete="off"/>
			<button className="submit-button" onClick={e => {handleSubmit(e);}}>Send</button>
		</form>
	);
}

SendMessageForm.propTypes = {
	messages: propTypes.array.isRequired,
	sendMessage: propTypes.func.isRequired
};

export default SendMessageForm;