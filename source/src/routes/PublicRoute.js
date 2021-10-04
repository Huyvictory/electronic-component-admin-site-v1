import React from 'react';
import { Route } from 'react-router-dom';

import PublicLayout from '../compoments/common/appLayout/PublicLayout';

const PublicRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
            <PublicLayout>
                <Component {...props} />
            </PublicLayout>
        )
    } />
);

export default PublicRoute;
