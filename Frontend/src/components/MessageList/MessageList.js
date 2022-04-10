import React from 'react';
import propTypes from 'prop-types';
import './MessageList.scss';
import cx from 'classnames';
import { CHATBOT_IDENTIFIER, VISITOR_IDENTIFIER } from '../../constants/constants.js';

function MessageList({ messages }) {

	return (
		<div className="message-list">
			<ul>
				{
					messages.map(({author, text}, index) => {
						return (
							<li key={index} className={cx('message', {
								[VISITOR_IDENTIFIER]: author === VISITOR_IDENTIFIER,
								[CHATBOT_IDENTIFIER]: author === CHATBOT_IDENTIFIER,
								['last-message']: index + 1 === messages.length
							})}>
								<div className="inner-message">
									<div className="message-text">{text}</div>
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