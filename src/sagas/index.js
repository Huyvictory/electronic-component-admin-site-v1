import { all } from 'redux-saga/effects';
import appCommon from './appCommon';
import account from './account';
import user from './user';
import groupPermission from './groupPermission';
import setting from './setting';
import customer from './customer';
import category from './category';
import product from './product';
<<<<<<< HEAD:source/src/sagas/index.js
import province from './province';
=======
import news from './news';
>>>>>>> dev:src/sagas/index.js

const sagas = [
    ...appCommon,
    ...account,
    ...user,
    ...groupPermission,
    ...setting,
    ...customer,
    ...category,
    ...product,
<<<<<<< HEAD:source/src/sagas/index.js
    ...province
=======
    ...news,
>>>>>>> dev:src/sagas/index.js
];

function* rootSaga() {
    yield all(sagas);
}

export default rootSaga;
