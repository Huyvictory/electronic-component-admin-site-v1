import React from 'react';
import { Switch, BrowserRouter, Redirect } from 'react-router-dom';

import { sitePathConfig } from '../constants/sitePathConfig';

import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

import LoginPage from '../containers/account/LoginPage';
import ProfilePage from '../containers/account/ProfilePage';

// import DashBoard from '../containers/Dashboard';
import UserAdminListPage from '../containers/users/UserAdminListPage';

import NotFound from '../compoments/common/NotFound';
import Forbidden from '../containers/Forbidden';
// import ErrorServer from '../containers/ErrorServer';
// import Layout from '../components/layout/Layout';
import SettingsListPage from '../containers/settings/SettingsListPage';
import GroupPermissionListPage from '../containers/groupPermission/GroupPermissionListPage';
import CustomerListPage from '../containers/customer/CustomerListPage';
import CategoryExportListPage from '../containers/category/CategoryExportListPage';
import CategoryExportListPageChild from '../containers/category/CategoryExportListPageChild';
import CategoryImportListPage from '../containers/category/CategoryImportListPage';
import CategoryImportListPageChild from '../containers/category/CategoryImportListPageChild';
import CategoryProductListPage from '../containers/category/CategoryProductListPage';
import CategoryProductListPageChild from '../containers/category/CategoryProductListPageChild';
import ProductListPage from '../containers/product/ProductListPage';

const RootRoute = () => {
    const {
        admin,
        login,
        profile,
        forbidden,
        setting,
        groupPermission,
        customer,
        categoryExport,
        categoryImport,
        categoryProduct,
        product,
    } = sitePathConfig;

    return (
        <BrowserRouter>
            <Switch>
                {/* <Redirect exact from="/" to="/delivery/deliveryorder"/>
                {
                    routes.map((MyRoute, index) => ({...MyRoute, key: index}))
                } */}
                <Redirect exact from="/" to={{
                    pathname: admin.path,
                    state: { isRedirectToHomePage: true }
                }}/>
                <PublicRoute exact path={login.path} component={LoginPage} />
                <PrivateRoute exact path={profile.path} component={ProfilePage}/>
                <PrivateRoute exact path={admin.path} component={UserAdminListPage}/>

                <PrivateRoute exact path={setting.path} component={SettingsListPage}/>
                <PrivateRoute exact path={groupPermission.path} component={GroupPermissionListPage}/>
                <PrivateRoute exact path={customer.path} component={CustomerListPage}/>
                <PrivateRoute exact path={categoryExport.path} component={CategoryExportListPage}/>
                <PrivateRoute exact path={categoryExport.childrenKeys[0]} component={CategoryExportListPageChild}/>
                <PrivateRoute exact path={categoryImport.path} component={CategoryImportListPage}/>
                <PrivateRoute exact path={categoryImport.childrenKeys[0]} component={CategoryImportListPageChild}/>
                <PrivateRoute exact path={categoryProduct.path} component={CategoryProductListPage}/>
                <PrivateRoute exact path={categoryProduct.childrenKeys[0]} component={CategoryProductListPageChild}/>
                <PrivateRoute exact path={product.path + "/:id"} component={ProductListPage}/>

                {/* Error Page */}
                <PrivateRoute exact path={forbidden.path} component={Forbidden}/>
                {/* <Route exact path="/error" component={ErrorServer} /> */}
                {/* 404 Page */}
                <PublicRoute component={NotFound} />
            </Switch>
        </BrowserRouter>
    )
}

export default RootRoute;
