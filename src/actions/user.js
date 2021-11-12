import reduxHelper from '../utils/redux';

export const reduxUtil = reduxHelper('USER');

const { defineAction, createActionWithLoading, createAction } = reduxUtil;

export const actionTypes = {
    GET_USER_ADMIN_LIST: defineAction('GET_USER_ADMIN_LIST'),
    SEARCH_SHOP_ACCOUNT: defineAction('SEARCH_SHOP_ACCOUNT'),
    GET_USER_BY_ID: defineAction('GET_USER_BY_ID'),
    CREATE_USER: defineAction('CREATE_USER'),
    UPDATE_USER: defineAction('UPDATE_USER'),
    DELETE_ADMIN: defineAction('DELETE_ADMIN'),
    GET_SHOP_ACCOUNT_LIST: defineAction('GET_SHOP_ACCOUNT_LIST'),
    GET_SHOP_ACCOUNT_BY_ID: defineAction('GET_SHOP_ACCOUNT_BY_ID'),
    DELETE_SHOP_ACCOUNT: defineAction('DELETE_SHOP_ACCOUNT'),
}

export const actions = {
    getUserAdminList: createActionWithLoading(actionTypes.GET_USER_ADMIN_LIST),
    getShopAccountList: createActionWithLoading(actionTypes.GET_SHOP_ACCOUNT_LIST),
    getUserById: createAction(actionTypes.GET_USER_BY_ID),
    getShopAccountById: createAction(actionTypes.GET_SHOP_ACCOUNT_BY_ID),
    createUser: createAction(actionTypes.CREATE_USER),
    updateUser: createAction(actionTypes.UPDATE_USER),
    deleteAdmin: createActionWithLoading(actionTypes.DELETE_ADMIN),
    deleteShopAccount: createAction(actionTypes.DELETE_SHOP_ACCOUNT),
    searchShopAccount: createAction(actionTypes.SEARCH_SHOP_ACCOUNT),
}