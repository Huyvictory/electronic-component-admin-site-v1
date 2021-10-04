import reduxHelper from '../utils/redux';

export const reduxUtil = reduxHelper('SETTING');

const { defineAction, createActionWithLoading, createAction } = reduxUtil;

export const actionTypes = {
    GET_SETTINGS_LIST: defineAction('GET_SETTINGS_LIST'),
    CREATE_SETTING: defineAction('CREATE_SETTING'),
    GET_SETTING_BY_ID: defineAction('GET_SETTING_BY_ID'),
    UPDATE_SETTING: defineAction('UPDATE_SETTING'),
    DELETE_SETTING: defineAction('DELETE_SETTING'),
}

export const actions = {
    getSettingsList: createActionWithLoading(actionTypes.GET_SETTINGS_LIST),
    createSetting: createAction(actionTypes.CREATE_SETTING),
    getSettingById: createAction(actionTypes.GET_SETTING_BY_ID),
    updateSetting: createAction(actionTypes.UPDATE_SETTING),
    deleteSetting: createActionWithLoading(actionTypes.DELETE_SETTING)
}