import React from 'react';

import { actions } from '../../../actions';

const { getUserData } = actions;

const ElementWithPermission = ({children, permissions}) => {
    const userData = getUserData();
    return (
        <>
            {
                permissions.some(permission=>userData.permissions.indexOf(permission) < 0) ? null : children
            }
        </>
    );
}

export default ElementWithPermission;