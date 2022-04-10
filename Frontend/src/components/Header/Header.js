import React from 'react';
import { MenuButton } from '../../icons/icons.js';
import propTypes from 'prop-types';
import './Header.scss';

function Header({ toggleSidebar }) {
	return (
		<div className="header">
			<span className="menu-button header-menu-icon"><MenuButton
				className="menu-icon" onClick={() =>{toggleSidebar();}} width="40px" height="40px"/></span>
			<p className="title" >Brock Bot</p>
		</div>
	);
}

Header.propTypes = {
	toggleSidebar: propTypes.func.isRequired
};

export default Header;