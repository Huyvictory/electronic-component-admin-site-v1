import reduxHelper from '../utils/redux';

export const reduxUtil = reduxHelper('GROUP_PERMISSION');

const { defineAction, createActionWithLoading, createAction } = reduxUtil;

export const actionTypes = {
    GET_GROUP_PERMISSION_LIST: defineAction('GET_GROUP_PERMISSION_LIST'),
    SEARCH_GROUP_PERMISSION: defineAction('SEARCH_GROUP_PERMISSION'),
    GET_PERMISSION_LIST: defineAction('GET_PERMISSION_LIST'),
    GET_GROUP_PERMISSION_BY_ID: defineAction('GET_GROUP_PERMISSION_BY_ID'),
    CREATE_GROUP_PERMISSION: defineAction('CREATE_GROUP_PERMISSION'),
    UPDATE_GROUP_PERMISSION: defineAction('UPDATE_GROUP_PERMISSION'),
    DELETE_GROUP_PERMISSION: defineAction('DELETE_GROUP_PERMISSION'),
}

export const actions = {
    getGroupPermissionList: createActionWithLoading(actionTypes.GET_GROUP_PERMISSION_LIST),
    searchGroupPermission: createActionWithLoading(actionTypes.SEARCH_GROUP_PERMISSION),
    getPermissionList: createActionWithLoading(actionTypes.GET_PERMISSION_LIST),
    getGroupPermissionById: createAction(actionTypes.GET_GROUP_PERMISSION_BY_ID),
    createGroupPermission: createAction(actionTypes.CREATE_GROUP_PERMISSION),
    updateGroupPermission: createAction(actionTypes.UPDATE_GROUP_PERMISSION),
    deleteGroupPermission: createAction(actionTypes.DELETE_GROUP_PERMISSION)
}