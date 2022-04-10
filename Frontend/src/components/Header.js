import React from 'react';
import {ReactComponent as MenuButton} from '../icons/menu.svg';
import propTypes from 'prop-types';

const Header = ({ toggleSidebar }) => {
	return (<>
		<div className="header">
			<span className="menu-button header-menu-icon"><MenuButton
				className="menu-icon" onClick={() =>{toggleSidebar();}} width="40px" height="40px"/></span>
			<p className="title" >BU Bot</p>
		</div>
	</>
	);
};

Header.propTypes = {
	toggleSidebar: propTypes.func.isRequired
};

export default Header;