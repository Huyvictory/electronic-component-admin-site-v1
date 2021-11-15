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
import NewsCategoryListPage from '../containers/category/newsCategoryListPage';
import ImportCategoryListPage from '../containers/category/ImportCategoryListPage';
import ExportCategoryListPage from '../containers/category/ExportCategoryListPage';
import ProductCategoryListPage from '../containers/category/ProductCategoryListPage';
import ProductListPage from '../containers/product/ProductListPage';
<<<<<<< HEAD:source/src/routes/index.js
import ProductListPageChildren from '../containers/product/ProductListPageChildren';
import ProvinceListPage from '../containers/province/ProvinceListPage';
=======
import NewsListPage from '../containers/news/NewsListPage';

>>>>>>> dev:src/routes/index.js
const RootRoute = () => {
    const {
        admin,
        login,
        profile,
        forbidden,
        setting,
        groupPermission,
        customer,
        newscategory,
        importcategory,
        exportcategory,
        productCategory,
        product,
<<<<<<< HEAD:source/src/routes/index.js
        province
=======
        news
>>>>>>> dev:src/routes/index.js
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
                <PrivateRoute exact path={productCategory.path} component={ProductCategoryListPage}/>
                <PrivateRoute exact path={newscategory.path} component={NewsCategoryListPage}/>
                <PrivateRoute exact path = {importcategory.path} component = {ImportCategoryListPage}></PrivateRoute>
                <PrivateRoute exact path = {exportcategory.path} component={ExportCategoryListPage}></PrivateRoute>
                <PrivateRoute exact path = {product.path} component={ProductListPage}></PrivateRoute>
<<<<<<< HEAD:source/src/routes/index.js
                <PrivateRoute exact path = {product.path + "/:id"} component={ProductListPage}></PrivateRoute>
                <PrivateRoute exact path = {product.childrenKeys[0]} component={ProductListPageChildren}></PrivateRoute>
                <PrivateRoute exact path = {province.path} component={ProvinceListPage}></PrivateRoute>
=======
                <PrivateRoute exact path = {news.path} component={NewsListPage}></PrivateRoute>

>>>>>>> dev:src/routes/index.js
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
