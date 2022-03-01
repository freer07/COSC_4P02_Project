import './App.css';
import Header from './components/Header';
import MessageList from './components/MessageList';
import SendMessageForm from './components/SendMessageForm';
import Sidebar from "./components/Sidebar";

import React, { useState, useEffect } from 'react';

var localStorage = window.localStorage;

function App() {
	
	const [messages, setMessages] = useState(JSON.parse(localStorage.getItem('messages')) || [])
	const [activeSidebar, setactiveSidebar] = useState(false)
	const [darkTheme, setdarkTheme] = useState(JSON.parse(localStorage.getItem('darktheme')) || false)

	const sendMessage = (message) => {
		let newMessages = [...messages, {author:"visitor", text: message}]
		setMessages(newMessages)
		const chatBotMessage = getChatBotResponse(message)
		chatBotMessage.then(data => {
			setMessages([...newMessages, {author:"chatbot", text: data.responses[0].text}])
		})
		.catch(function() {
        	console.error("failed to fetch bot response");
			setMessages([...newMessages, {author:"chatbot", text: "Unable to reach the chatbot."}])
    	});
	};
	const toggleSidebar = () =>{
		setactiveSidebar(!activeSidebar)
	}

	const downloadChatLog = () => {
		if(window.confirm("Download chat history?")){
			const element = document.createElement("a");
			let chatLogHistory = ""
			for (let index = 0; index < messages.length; index++) {
				chatLogHistory += messages[index].author + ": " + messages[index].text + "\n"
			}
			const file = new Blob([chatLogHistory], {
				type: "text/plain"
			});
			element.href = URL.createObjectURL(file);
			element.download = "chathistory.txt";
			document.body.appendChild(element);
			element.click();
		}
  	};

	const refreshChat = () =>{
		console.log("refresh Chat Log")
		if(window.confirm("Are you sure you want to clear the chat history?")){
			setMessages([])
			localStorage.setItem('messages', JSON.stringify([]));
			localStorage.setItem('conversationID', JSON.stringify(""));
		}
	}

	const toggleDarkTheme = () =>{
		localStorage.setItem('darktheme', JSON.stringify(!darkTheme));
		setdarkTheme(!darkTheme)
	}

	const returnToMain = () =>{
		console.log("return to main")
	}

	useEffect(() => {
		const handleEsc = (event) => {
			if (event.keyCode === 27) {
				setactiveSidebar(false)
			}
		};
    	window.addEventListener('keydown', handleEsc);
		return () => {
			window.removeEventListener('keydown', handleEsc);
    	};
	}, []);

	useEffect(() => {
		var recentMessageElement = document.querySelector(".last-message");
		if(typeof recentMessageElement !== undefined && recentMessageElement !== null ){
			recentMessageElement.scrollIntoView();
		}
		if(messages.length !== 0){
			localStorage.setItem('messages', JSON.stringify(messages));
		}
	}, [messages]);

	const appClassNames = (activeSidebar ? ' active-sidebar':'') + (darkTheme ? ' dark-theme':'')
	return (
		<div className={`app${appClassNames}`}>
			<div className="overlay"></div>
			<Sidebar  toggleSidebar={toggleSidebar} sidebarFunctions={{downloadChatLog, refreshChat, toggleDarkTheme, returnToMain}}/>
			<Header toggleSidebar={toggleSidebar}/>
			<MessageList messages={messages} />
			<SendMessageForm messages={messages} sendMessage={sendMessage} />
		</div>
	);
}

const getChatBotResponse = (visitorMessage) =>{
	let conversationID = JSON.parse(localStorage.getItem('conversationID'));
	if(!conversationID){
		conversationID = Math.random().toString(36).slice(2);
		localStorage.setItem('conversationID', JSON.stringify(conversationID));
	}
	const url = "https://www.advenship.com/api/v1/bots/brock-university/converse/"+conversationID
	const data = {type: "text", text: visitorMessage}
	return fetch(url, {
		method: "POST",
		headers: {'Content-Type': 'application/json'}, 
		body: JSON.stringify(data)
	}).then(response => response.json())
	.catch(function() {
		console.log("Can't reach url, potential CORS issue");
	});
}

export default App;
