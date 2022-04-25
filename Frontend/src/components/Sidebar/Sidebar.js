import React from 'react';
import './Sidebar.scss';
import cx from 'classnames';
import {
	MenuButton,
	DownloadButton,
	RefreshButton,
	LogOutButton
} from '../../icons/icons.js';
import propTypes from 'prop-types';

function Sidebar({ darkTheme, toggleSidebar, sidebarFunctions }) {
	const {downloadChatLog, refreshChat, toggleDarkTheme, returnToMain} = sidebarFunctions;
	const sidebarNavItems = [
		{
			text: 'Chat Log',
			identifier: 'chat-log-item',
			icon: <DownloadButton className="menu-icon" width="30px" height="30px"/>,
			to: '/',
			section: '',
			function: downloadChatLog
		},
		{
			text: 'Refresh Chat',
			identifier: 'refresh-chat-item',
			icon: <RefreshButton className="menu-icon" width="30px" height="30px"/>,
			to: '/',
			section: '',
			function: refreshChat
		},
		{
			text: 'Dark Theme',
			identifier: 'dark-theme-item',
			icon: <div className="switch">
				<input className={cx({['is_checked']: darkTheme})}
					type="checkbox" defaultChecked={darkTheme}/>
				<div className={cx({['is_checked']: darkTheme})}></div>
			</div>,
			to: '/',
			section: '',
			function: toggleDarkTheme
		},
		{
			text: 'Return',
			identifier: 'return-item',
			icon: <LogOutButton className="menu-icon" width="30px" height="30px"/>,
			to: '/',
			section: '',
			function: returnToMain
		},
	];

	return <div className="sidebar">
		<div className="sidebar-header">
			<span className="menu-button"><MenuButton className="menu-icon"
				onClick={() =>{toggleSidebar();}} width="40px" height="40px"/>
			</span>
		</div>
		<div className="sidebar-menu">
			{
				sidebarNavItems.map((menuItem, index) => (
					<div role="button" tabIndex={0} key={index} onClick={() => {menuItem.function();}}
						onKeyDown={() => {}}>
						<div className={cx('sidebar-menu-item', menuItem.identifier)}>
							<div className="sidebar-menu-item-text">
								{menuItem.text}
							</div>
							<div className="sidebar-menu-item-icon">
								{menuItem.icon}
							</div>
						</div>
					</div>
				))
			}
		</div>
	</div>;
}

Sidebar.propTypes = {
	darkTheme: propTypes.bool.isRequired,
	toggleSidebar: propTypes.func.isRequired,
	sidebarFunctions: propTypes.object.isRequired
};

export default Sidebar;