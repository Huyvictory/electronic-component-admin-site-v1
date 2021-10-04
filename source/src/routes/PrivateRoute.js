import React from 'react';
import { Route } from 'react-router-dom';

import MasterLayout from '../compoments/common/appLayout/MasterLayout';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => 
            (
                <MasterLayout {...props}>
                    <Component {...props}/>
                </MasterLayout>
            )
        }
     />
);

export default PrivateRoute;
