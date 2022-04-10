import React from 'react';
import propTypes from 'prop-types';
import './MessageList.scss';
import cx from 'classnames';

function MessageList({ messages }) {

	return (
		<div className="message-list">
			<ul>
				{
					messages.map((message, index) => {
						return (
							<li key={index} className={cx('message', {
								['visitor']: message.author === 'visitor',
								['chatbot']: message.author !== 'visitor',
								['last-message']: index + 1 === messages.length
							})}>
								<div className="inner-message">
									<div className="message-text">{message.text}</div>
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