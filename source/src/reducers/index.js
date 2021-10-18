import { combineReducers } from 'redux';
import appCommon from './appCommon';
import account from './account';
import user from './user';
import groupPermission from './groupPermission';
import settings from './setting';
import customer from './customer';
import category from './category';

const rootReducer = combineReducers({
    appCommon: appCommon.reducer,
    account: account.reducer,
    user: user.reducer,
    groupPermission: groupPermission.reducer,
    settings: settings.reducer,
    customer: customer.reducer,
<<<<<<< HEAD
    category: category.reducer,

=======
    category: category.reducer
>>>>>>> huy_dev
});

export default rootReducer;