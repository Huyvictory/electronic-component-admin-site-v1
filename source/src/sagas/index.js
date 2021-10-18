import { all } from 'redux-saga/effects';
import appCommon from './appCommon';
import account from './account';
import user from './user';
import groupPermission from './groupPermission';
import setting from './setting';
import customer from './customer';
import category from './category';
<<<<<<< HEAD

=======
>>>>>>> huy_dev

const sagas = [
    ...appCommon,
    ...account,
    ...user,
    ...groupPermission,
    ...setting,
    ...customer,
<<<<<<< HEAD
    ...category,
=======
    ...category
>>>>>>> huy_dev
];

function* rootSaga() {
    yield all(sagas);
}

export default rootSaga;
