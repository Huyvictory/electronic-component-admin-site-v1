import reduxHelper from '../utils/redux';

export const reduxUtil = reduxHelper('PROVINCE');

const { defineAction, createActionWithLoading, createAction } = reduxUtil;

export const actionTypes = {
    GET_PROVINCE_LIST: defineAction('GET_PROVINCE_LIST'),
    GET_PROVINCE_BY_ID: defineAction('GET_PROVINCE_BY_ID'),
    CREATE_PROVINCE: defineAction('CREATE_PROVINCE'),
    UPDATE_PROVINCE: defineAction('UPDATE_PROVINCE'),
    DELETE_PROVINCE: defineAction('DELETE_PROVINCE'),
    GET_PROVINCE_COMBOBOX_LIST: defineAction('GET_PROVINCE_COMBOBOX_LIST'),
    GET_DISTRICT_COMBOBOX_LIST: defineAction('GET_DISTRICT_COMBOBOX_LIST'),
    GET_COMMUNE_COMBOBOX_LIST: defineAction('GET_COMMUNE_COMBOBOX_LIST'),
}

export const actions = {
    getProvinceList: createActionWithLoading(actionTypes.GET_PROVINCE_LIST),
    getProvinceById: createAction(actionTypes.GET_PROVINCE_BY_ID),
    createProvince: createAction(actionTypes.CREATE_PROVINCE),
    updateProvince: createAction(actionTypes.UPDATE_PROVINCE),
    deleteProvince: createActionWithLoading(actionTypes.DELETE_PROVINCE),
    getProvinceComboboxList: createAction(actionTypes.GET_PROVINCE_COMBOBOX_LIST),
    getDistrictComboboxList: createAction(actionTypes.GET_DISTRICT_COMBOBOX_LIST),
    getCommuneComboboxList: createAction(actionTypes.GET_COMMUNE_COMBOBOX_LIST),
}