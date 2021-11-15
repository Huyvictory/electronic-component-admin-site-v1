import { actions as appCommonActions, actionTypes as appCommonTypes } from './appCommon';
import { actions as accountActions, actionTypes as accountTypes } from './account';
import { actions as userActions, actionTypes as userTypes } from './user';
import { actions as groupPermissionActions, actionTypes as groupPermissionTypes } from './groupPermission';
import { actions as settingActions, actionTypes as settingTypes} from './setting';
import { actions as customerActions, actionTypes as customerTypes} from './customer';
import { actions as categoryActions, actionTypes as categoryTypes } from './category';
import { actions as productActions, actionTypes as productTypes } from './product';
import { actions as provinceActions, actionTypes as provinceTypes} from './province';

export const actions = {
    ...appCommonActions,
    ...accountActions,
    ...userActions,
    ...groupPermissionActions,
    ...settingActions,
    ...customerActions,
    ...categoryActions,
    ...productActions,
    ...provinceActions
}

export const types = {
    ...appCommonTypes,
    ...accountTypes,
    ...userTypes,
    ...groupPermissionTypes,
    ...settingTypes,
    ...customerTypes,
    ...categoryTypes,
    ...productTypes,
    ...provinceTypes
}