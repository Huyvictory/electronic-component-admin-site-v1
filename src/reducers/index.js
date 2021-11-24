import { combineReducers } from 'redux';
import appCommon from './appCommon';
import account from './account';
import user from './user';
import groupPermission from './groupPermission';
import settings from './setting';
import customer from './customer';
import category from './category';
import product from './product';
import province from './province';
import news from './news';
import orders from './orders';

const rootReducer = combineReducers({
    appCommon: appCommon.reducer,
    account: account.reducer,
    user: user.reducer,
    groupPermission: groupPermission.reducer,
    settings: settings.reducer,
    customer: customer.reducer,
    category: category.reducer,
    product: product.reducer,
    province: province.reducer,
    news: news.reducer,
    orders: orders.reducer
});

export default rootReducer;