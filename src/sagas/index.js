import { all } from 'redux-saga/effects';
import appCommon from './appCommon';
import account from './account';
import user from './user';
import groupPermission from './groupPermission';
import setting from './setting';
import customer from './customer';
import category from './category';
import product from './product';
import address from './address';
import province from './province';
import news from './news';
import orders from './orders';

const sagas = [
    ...appCommon,
    ...account,
    ...user,
    ...groupPermission,
    ...setting,
    ...customer,
    ...category,
    ...product,
    ...address,
    ...province,
    ...news,
    ...orders
];

function* rootSaga() {
    yield all(sagas);
}

export default rootSaga;
