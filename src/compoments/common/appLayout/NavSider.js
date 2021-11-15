import React, { Component } from 'react';
import { Layout, Menu, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { navMenuConfig } from '../../../constants/menuConfig';
import logoUrl from '../../../assets/images/logo.jpg';
import { AppConstants } from '../../../constants'

const { Sider } = Layout;
const { SubMenu } = Menu;

const findNavMenuActive = (navMenu, pathname) => {

    const menuActive = Object.keys(navMenu).find(navMenuKey => {
        if(navMenu[navMenuKey].children)
        {
            return  !!navMenu[navMenuKey].children.find(
                navChild => (
                        navChild.path === pathname
                        || navChild.childrenKeys?.includes(pathname)
                    )
            ) || pathname.startsWith(navMenu[navMenuKey].path + '/');
        }
        else if(navMenu[navMenuKey].path === pathname)
            return true;
        else if(navMenu[navMenuKey].childrenKeys) {
            return true;
        }
        return false;
    });
    return menuActive;
} 

const findNavMenuItemActive = (navMenu, pathname) => {
    let menuList = [];
    Object.keys(navMenu).forEach(menuKey => {
        const menuItem = navMenu[menuKey];
        if(menuItem.children) {
            menuList = menuList.concat(menuItem.children)
        }
        else {
            menuList.push(menuItem);
        }
    });

    const activeMenu = menuList.find(menuItem => {
        if(menuItem.childrenKeys && menuItem.childrenKeys.some(menuChildPath => pathname === menuChildPath))
            return true;
        return pathname === menuItem.path;
    });
    if(activeMenu) {
        return activeMenu.path;
    }
    return pathname;
} 

class NavSider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loadingMenuItem: null,
        }
    }

    handleLoadingMenuItem = (menuPath) => {
        this.setState({loadingMenuItem: menuPath})
        return true;
    }

    render() {
        const { onToggleNavSide, currentPathname, navSidercollapsed, userData } = this.props;
        const {
            loadingMenuItem,
        } = this.state;
        const availableMenu = navMenuConfig.filter(navMenu => {
            if(navMenu.children) {
                navMenu.children = navMenu.children.filter(navMenuChild => {
                    if(navMenuChild.permissions)
                        return userData.permissions?.indexOf(navMenuChild.permissions[0]) > -1;
                    return true;
                });

                return !!(navMenu.children.length > 0 || navMenu.handleOnClick);
            }
            else if(navMenu.permissions) {
                return userData.permissions?.indexOf(navMenu.permissions[0]) > -1;
            }
            return true;
        });
        const menuActive = findNavMenuActive(availableMenu, currentPathname);
        const menuItemActive = findNavMenuItemActive(availableMenu, currentPathname);
        return (
            <Sider
                style={{
                    // overflow: 'auto',
                    // height: '100vh',
                    // position: 'fixed',
                    // left: 0,
                    // zIndex:2,
                    // width: navSidercollapsed ? LayoutConfigs.NAV_WIDTH_COLLAPSED : LayoutConfigs.NAV_WIDTH_EXPANDED
                }}
                // collapsible
                collapsed={navSidercollapsed}
                onCollapse={onToggleNavSide}
                className={navSidercollapsed ? 'nav-sider nav-sider__collapsed' : 'nav-sider nav-sider__expanded'}
                >
                <div className={navSidercollapsed ? 'logo logo__collapsed' : 'logo logo__expanded'} style={{ width: '100%' }}>
                    <img src={userData.logo ? `${AppConstants.contentRootUrl}/${userData.logo}` : logoUrl} alt="Mira"/>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[menuItemActive]}
                    className="custom-nav"
                    defaultOpenKeys={[menuActive]}
                >
                    {availableMenu.map((navMenuItem, idx) =>
                        navMenuItem.children
                        ?
                        <SubMenu
                            style={!navSidercollapsed ? { paddingLeft: '0 34px 0 10px' } : null}
                            key={idx}
                            title={
                                <>
                                <span className="title">
                                    {
                                        navMenuItem.icon
                                    }
                                    <span>{navMenuItem.label}</span>
                                </span>
                                {
                                    navMenuItem.iconAfter && navMenuItem.iconAfter(this.props, `${window.location.host}/login/${userData.id}`)
                                }
                                <Spin size="small" spinning={loadingMenuItem === navMenuItem.path}></Spin>
                                </>
                            }
                            className="custom-sub-nav"
                            onTitleClick={
                                () => {
                                    navMenuItem.handleOnClick && navMenuItem.handleOnClick(this.props, this.handleLoadingMenuItem)
                                }
                            }
                        >
                            {
                                (
                                        currentPathname === navMenuItem.path
                                    || currentPathname?.startsWith(navMenuItem.path + '/')
                                )
                                && navMenuItem.handleOnClick && navMenuItem.handleOnClick(this.props, this.handleLoadingMenuItem)
                            }
                            {
                                navMenuItem.children.map(navChildMenu => {
                                    return (
                                        <Menu.Item key={navChildMenu.key || navChildMenu.path}>
                                            <Link to={navChildMenu.path}>
                                                <span>{navChildMenu.label}</span>
                                            </Link>
                                        </Menu.Item>
                                    )
                                })
                            }
                        </SubMenu>
                        :
                        <Menu.Item
                            className="custom-nav-item"
                            key={navMenuItem.path}
                            style={!navSidercollapsed ? { paddingLeft: '0 34px 0 10px' } : null}
                            >
                            <Link to={navMenuItem.path}>
                                <span>
                                    {
                                        navMenuItem.icon
                                    }
                                    
                                    <span>{navMenuItem.label}</span>
                                </span>
                            </Link>
                        </Menu.Item>
                    )}     
                </Menu>
            </Sider>
        )
    }
}

export default NavSider;
