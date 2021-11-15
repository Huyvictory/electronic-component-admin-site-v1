import reduxHelper from '../utils/redux';

export const reduxUtil = reduxHelper('PROVINCE');

const { defineAction, createActionWithLoading, createAction } = reduxUtil;

export const actionTypes = {
    GET_PROVINCE_LIST: defineAction('GET_PROVINCE_LIST'),
    GET_PROVINCE_BY_ID: defineAction('GET_PROVINCE_BY_ID'),
    CREATE_PROVINCE: defineAction('CREATE_PROVINCE'),
    UPDATE_PROVINCE: defineAction('UPDATE_PROVINCE'),
    DELETE_PROVINCE: defineAction('DELETE_PROVINCE'),
}

export const actions = {
    getProvinceList: createActionWithLoading(actionTypes.GET_PROVINCE_LIST),
    getProvinceById: createAction(actionTypes.GET_PROVINCE_BY_ID),
    createProvince: createAction(actionTypes.CREATE_PROVINCE),
    updateProvince: createAction(actionTypes.UPDATE_PROVINCE),
    deleteProvince: createActionWithLoading(actionTypes.DELETE_PROVINCE)
}