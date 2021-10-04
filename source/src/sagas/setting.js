import { call, put, takeLatest } from 'redux-saga/effects';

import { sendRequest } from '../services/apiService';
import { actionTypes, reduxUtil } from '../actions/setting';
import apiConfig from '../constants/apiConfig';
import { handleApiResponse } from '../utils/apiHelper';

const { defineActionLoading, defineActionSuccess, defineActionFailed } = reduxUtil;

const {
    GET_SETTINGS_LIST,
    DELETE_SETTING,
} = actionTypes;


function* getSettingsList({ payload: { params } }) {

    const apiParams = apiConfig.setting.getSettingsList;
    const searchParams = { page: params.page, size: params.size };
    if(params.search) {
        if(params.search.key) {
            searchParams.key = params.search.key
        }
        if(params.search.group) {
            searchParams.group = params.search.group
        }
    }
    try {
        const result = yield call(sendRequest, apiParams, searchParams);
        yield put({
            type: defineActionSuccess(GET_SETTINGS_LIST),
            settingsData: result.responseData && result.responseData.data
        });
    }
    catch(error) {
        yield put({ type: defineActionFailed(GET_SETTINGS_LIST) });
    }
}

function* createSetting({payload: { params, onCompleted, onError }}){
    try {
        const apiParams = apiConfig.setting.createSetting;
        const result = yield call(sendRequest, apiParams, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* getSettingById({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = {
            ...apiConfig.setting.getSettingById,
            path: `${apiConfig.setting.getSettingById.path}/${params.id}`
        }
        const result = yield call(sendRequest, apiParams);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* updateSetting({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = apiConfig.setting.updateSetting;
        const result = yield call(sendRequest, apiParams, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* deleteSetting({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = {
            ...apiConfig.setting.deleteSetting,
            path: `${apiConfig.setting.deleteSetting.path}/${params.id}`
        }
        const result = yield call(sendRequest, apiParams);
        handleApiResponse(result, onCompleted, onError);

        const { success, responseData } = result;
        if(!success || !responseData.result)
            yield put({ type: defineActionFailed(DELETE_SETTING) });
    }
    catch(error) {
        yield put({ type: defineActionFailed(DELETE_SETTING) });
        onError(error);
    }
}

const sagas = [
    takeLatest(defineActionLoading(GET_SETTINGS_LIST), getSettingsList),
    takeLatest(actionTypes.CREATE_SETTING, createSetting),
    takeLatest(actionTypes.GET_SETTING_BY_ID, getSettingById),
    takeLatest(actionTypes.UPDATE_SETTING, updateSetting),
    takeLatest(defineActionLoading(DELETE_SETTING), deleteSetting),
]

export default sagas;