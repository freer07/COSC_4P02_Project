import React from 'react';
import propTypes from 'prop-types';

const MessageList = ({messages}) => {
	return (
		<div className="message-list">
			<ul >
				{messages.map((message, index) => {
					const authorClass = message.author === 'visitor' ? 'message visitor' : 'message chatbot';
					return (
						<li key={index} className={index + 1 === messages.length ?
							authorClass + ' last-message' : authorClass
						}>
							<div className="inner-message">
								<div className="message-text">{message.text}</div>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

MessageList.propTypes = {
	messages: propTypes.array.isRequired
};

export default MessageList;