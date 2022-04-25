import React from 'react';
import propTypes from 'prop-types';
import './MessageList.scss';
import cx from 'classnames';
import { CHATBOT_IDENTIFIER, VISITOR_IDENTIFIER } from '../../constants/constants.js';

function MessageList({ messages }) {

	const modifyMessageToHaveAnchor = (chatBotMessage) => {
		let match = chatBotMessage.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig);
		if (match){
			let modifiedMessage = chatBotMessage;
			match.map(url => {
				modifiedMessage = <span>{modifiedMessage.replace(url,'')} <a href={url}
					className="anchor-link">{url}</a></span>;
			});
			return modifiedMessage;
		}

		return chatBotMessage;
	};
	return (
		<div className="message-list">
			<ul>
				{
					messages.map(({author, text}, index) => {
						let modifiedText = author === CHATBOT_IDENTIFIER
							? modifyMessageToHaveAnchor(text)
							:<span>{text}</span>;
						return (
							<li key={index} className={cx('message', {
								[VISITOR_IDENTIFIER]: author === VISITOR_IDENTIFIER,
								[CHATBOT_IDENTIFIER]: author === CHATBOT_IDENTIFIER,
								['last-message']: index + 1 === messages.length
							})}>
								<div className="inner-message">
									<div className="message-text">{modifiedText}</div>
								</div>
							</li>
						);
					})
				}
			</ul>
		</div>
	);
}

MessageList.propTypes = {
	messages: propTypes.array.isRequired
};

export default MessageList;