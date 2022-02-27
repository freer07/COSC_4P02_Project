import './App.css';
import Header from './components/Header';
import MessageList from './components/MessageList';
import SendMessageForm from './components/SendMessageForm';
import Sidebar from "./components/Sidebar";

import React, { useState, useEffect } from 'react';

function App() {
	const [messages, setMessages] = useState([])
	const [activeSidebar, setactiveSidebar] = useState(false)

	const sendMessage = (message) => {
		setMessages([...messages, {author:"visitor", content: message}])
	};
	const toggleSidebar = () =>{
		setactiveSidebar(!activeSidebar)
	}

	const downloadChatLog = () => {
		const element = document.createElement("a");
		let chatLogHistory = ""
		for (let index = 0; index < messages.length; index++) {
			console.log(messages[index])
			chatLogHistory += messages[index].author + ": " + messages[index].content + "\n"
		}
		const file = new Blob([chatLogHistory], {
			type: "text/plain"
		});
		element.href = URL.createObjectURL(file);
		element.download = "chathistory.txt";
		document.body.appendChild(element);
		element.click();
  	};

	const refreshChat = () =>{
		console.log("refresh Chat Log")
		if(window.confirm("Are you sure you want to clear the chat history?")){
			setMessages([])
		}
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

	return (
		<div className={`app${activeSidebar? ' active-sidebar':''}`}>
			<div className="overlay"></div>
			<Sidebar  toggleSidebar={toggleSidebar} sidebarFunctions={{downloadChatLog, refreshChat, returnToMain}}/>
			<Header toggleSidebar={toggleSidebar}/>
			<MessageList messages={messages} />
			<SendMessageForm sendMessage={sendMessage} />
		</div>
	);
}



export default App;
