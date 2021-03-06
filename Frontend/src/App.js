import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header/Header';
import MessageList from './components/MessageList/MessageList';
import SendMessageForm from './components/SendMessageForm/SendMessageForm';
import Sidebar from './components/Sidebar/Sidebar';
import cx from 'classnames';
import { CHATBOT_IDENTIFIER, VISITOR_IDENTIFIER } from './constants/constants.js';

var localStorage = window.localStorage;

function App() {
	const [messages, setMessages] = useState(JSON.parse(localStorage.getItem('messages')) || []);
	const [activeSidebar, setactiveSidebar] = useState(false);
	const [darkTheme, setdarkTheme] = useState(JSON.parse(localStorage.getItem('darktheme')) || false);

	const sendMessage = (message) => {
		let newMessages = [...messages, {author: VISITOR_IDENTIFIER, text: message}];
		setMessages(newMessages);
		const chatBotMessage = getChatBotResponse(message);
		chatBotMessage.then(data => {
			const newMessage = data.responses[0].text;
			setMessages([...newMessages, {author: CHATBOT_IDENTIFIER, text: newMessage.trim()}]);
		})
			.catch(function() {
				console.error('failed to fetch bot response');
				setMessages([...newMessages, {author: CHATBOT_IDENTIFIER, text: 'Unable to reach the chatbot.'}]);
			});
	};

	const toggleSidebar = () => {
		setactiveSidebar(!activeSidebar);
	};

	const downloadChatLog = () => {
		if (window.confirm('Download chat history?')) {
			const element = document.createElement('a');
			let chatLogHistory = '';
			for (let index = 0; index < messages.length; index++) {
				chatLogHistory += messages[index].author + ': ' + messages[index].text + '\n';
			}
			const file = new Blob([chatLogHistory], {
				type: 'text/plain'
			});
			element.href = URL.createObjectURL(file);
			element.download = 'chathistory.txt';
			document.body.appendChild(element);
			element.click();
		}
	};

	const refreshChat = () => {
		if (window.confirm('Are you sure you want to clear the chat history?')) {
			sendChatbotGreeting();
			localStorage.setItem('messages', JSON.stringify(messages));
			localStorage.setItem('conversationID', JSON.stringify(''));
		}
	};

	const toggleDarkTheme = () => {
		localStorage.setItem('darktheme', JSON.stringify(!darkTheme));
		setdarkTheme(!darkTheme);
	};

	const returnToMain = () => {

	};

	const sendChatbotGreeting = () => {
		const chatBotMessage = getChatBotResponse('hello');
		chatBotMessage.then(data => {
			const newMessage = data.responses[0].text;
			setMessages([{author: CHATBOT_IDENTIFIER, text: newMessage.trim()}]);
		})
			.catch(function() {
				console.error('failed to fetch bot response');
				setMessages([{author: CHATBOT_IDENTIFIER, text: 'Unable to reach the chatbot.'}]);
			});
	};

	useEffect(() => {

		if (!messages.length) {
			sendChatbotGreeting();
		}
		const handleEsc = (event) => {
			if (event.keyCode === 27) {
				setactiveSidebar(false);
			}
		};
		window.addEventListener('keydown', handleEsc);
		return () => {
			window.removeEventListener('keydown', handleEsc);
		};
	}, []);

	useEffect(() => {
		var recentMessageElement = document.querySelector('.last-message');
		if (typeof recentMessageElement !== 'undefined' && recentMessageElement !== null ) {
			recentMessageElement.scrollIntoView();
		}
		if (messages.length !== 0) {
			localStorage.setItem('messages', JSON.stringify(messages));
		}
	}, [messages]);


	return (
		<div className={cx('app', {
			['active-sidebar']: activeSidebar,
			['dark-theme']: darkTheme
		})}>
			<div role="button" tabIndex={0} className="overlay" onClick={() => {setactiveSidebar(false);}}
				onKeyDown={() => {setactiveSidebar(false);}}></div>
			<Sidebar darkTheme={darkTheme} toggleSidebar={toggleSidebar}
				sidebarFunctions={{downloadChatLog, refreshChat, toggleDarkTheme, returnToMain}}/>
			<Header toggleSidebar={toggleSidebar}/>
			<MessageList messages={messages} />
			<SendMessageForm messages={messages} sendMessage={sendMessage} />
		</div>
	);
}

const getChatBotResponse = (visitorMessage) => {
	let conversationID = JSON.parse(localStorage.getItem('conversationID'));
	if (!conversationID) {
		conversationID = Math.random().toString(36).slice(2);
		localStorage.setItem('conversationID', JSON.stringify(conversationID));
	}
	const url = 'https://www.advenship.com/api/v1/bots/brockbot/converse/'+conversationID;
	const data = {type: 'text', text: visitorMessage};
	return fetch(url, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(data)
	}).then(response => response.json())
		.catch(function() {
			console.error('Can\'t reach url, potential CORS issue');
		});
};

export default App;
