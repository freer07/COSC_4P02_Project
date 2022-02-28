import './Sidebar.css';
import {ReactComponent as MenuButton} from '../icons/menu.svg';
import {ReactComponent as DownloadButton} from '../icons/download.svg';
import {ReactComponent as RefreshButton} from '../icons/refresh.svg';
import {ReactComponent as LogOutButton} from '../icons/log-out.svg';

const Sidebar = ({toggleSidebar, sidebarFunctions}) => {
    const {downloadChatLog, refreshChat, toggleDarkTheme, returnToMain} = sidebarFunctions
    const sidebarNavItems = [
        {
            text: 'Chat Log',
            identifier: "chat-log-item",
            icon: <DownloadButton className='menu-icon' width="30px" height="30px"/>,
            to: '/',
            section: '',
            function: downloadChatLog
        },
        {
            text: 'Refresh Chat',
            identifier: "refresh-chat-item",
            icon: <RefreshButton className='menu-icon' width="30px" height="30px"/>,
            to: '/',
            section: '',
            function: refreshChat

        },
        {
            text: 'Dark Theme',
            identifier: "dark-theme-item",
            icon: <label className="switch"><input type="checkbox" onChange={toggleDarkTheme}/><div></div></label>,
            to: '/',
            section: '',
            function: () =>{}

        },

        {
            text: 'Return',
            identifier: "return-item",
            icon: <LogOutButton className='menu-icon' width="30px" height="30px"/>,
            to: '/',
            section: '',
            function: returnToMain

        },

    ]

    return <div className='sidebar'>
        <div className='sidebar-header'>
            <span className='menu-button'><MenuButton className='menu-icon' onClick={() =>{toggleSidebar()}} width="40px" height="40px"/></span>
        </div>
        <div  className="sidebar-menu">
            {
                sidebarNavItems.map((menuItem, index) => (
                    <div key={index} onClick={() => {menuItem.function()}}>
                        <div className={`sidebar-menu-item ${menuItem.identifier}`}>
                            
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
};

export default Sidebar;