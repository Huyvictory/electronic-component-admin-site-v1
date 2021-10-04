import { combineReducers } from 'redux';
import appCommon from './appCommon';
import account from './account';
import user from './user';
import groupPermission from './groupPermission';
import settings from './setting';
import customer from './customer';
import category from './category';
import product from './product';

const rootReducer = combineReducers({
    appCommon: appCommon.reducer,
    account: account.reducer,
    user: user.reducer,
    groupPermission: groupPermission.reducer,
    settings: settings.reducer,
    customer: customer.reducer,
    category: category.reducer,
    product: product.reducer,
});

export default rootReducer;