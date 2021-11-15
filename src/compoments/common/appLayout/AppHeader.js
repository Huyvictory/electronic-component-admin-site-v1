import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Avatar } from 'antd';
import {
    DownOutlined,
    UserOutlined,
    LoginOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import { AppConstants, LayoutConfigs } from '../../../constants';
const {  Header } = Layout;
const SubMenu = Menu.SubMenu;

class AppHeader extends Component {

    render() {
        const { onLogout , userData, onToggleNavSide, navSidercollapsed } = this.props;

        return (
            <Header className="app-header"
                style={{
                    position: 'fixed',
                    zIndex: 1,
                    width: `calc(100% - ${navSidercollapsed ? LayoutConfigs.NAV_WIDTH_COLLAPSED : LayoutConfigs.NAV_WIDTH_EXPANDED}px)`
                }}
            >
                <span className="icon-collapsed" onClick={onToggleNavSide}>
                    {
                        navSidercollapsed
                        ?
                        <MenuUnfoldOutlined/>
                        :
                        <MenuFoldOutlined/>
                    }
                </span>
                <Menu
                    mode="horizontal"
                    className="menu-top-right"
                >
                    <SubMenu
                        title={
                            <span className="submenu-title-wrapper">
                                <Avatar icon={<UserOutlined/>} src={userData.avatar ? `${AppConstants.contentRootUrl}/${userData.avatar}` : null}/>
                                {userData.fullName || ''}
                                <DownOutlined/>
                            </span>}
                        className="overlay-panel-submenu"
                        >
                        <Menu.Item key="/profile">
                            <Link to="/profile">
                                <UserOutlined/>
                                <span>Hồ sơ</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item onClick={onLogout}>
                            <LoginOutlined/>
                            <span>Đăng xuất</span>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Header>
        )
    }
}

export default AppHeader;
