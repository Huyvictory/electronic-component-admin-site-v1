import { call, put, takeLatest } from 'redux-saga/effects';

import { sendRequest } from '../services/apiService';
import { actionTypes, reduxUtil } from '../actions/address';
import apiConfig from '../constants/apiConfig';
import { handleApiResponse } from '../utils/apiHelper';

const { defineActionLoading, defineActionSuccess, defineActionFailed } = reduxUtil;

const {
    GET_ADDRESS_LIST,
    GET_ADDRESS_BY_ID,
    UPDATE_ADDRESS,
    DELETE_ADDRESS,
    CREATE_ADDRESS,
} = actionTypes;


function* getAddressList({ payload: { params } }) {

    const apiParams = apiConfig.address.getList;
    const searchParams = { page: params.page, size: params.size };
    if(params.customerId) {
        searchParams.customerId = params.customerId;
    }
    if(params.search) {
        if(params.search.name) {
            searchParams.name = params.search.name
        }
        if(params.search.phone) {
            searchParams.phone = params.search.phone
        }
    }
    try {
        const result = yield call(sendRequest, apiParams, searchParams);
        yield put({
            type: defineActionSuccess(GET_ADDRESS_LIST),
            addressData: result.responseData && result.responseData.data,
        });
    }
    catch(error) {
        yield put({ type: defineActionFailed(GET_ADDRESS_LIST) });
    }
}

function* getAddressById({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = {
            ...apiConfig.address.getById,
            path: `${apiConfig.address.getById.path}/${params.id}`
        }
        const result = yield call(sendRequest, apiParams);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* createAddress({payload: { params, onCompleted, onError }}){
    try {
        const apiParams = apiConfig.address.create;
        const result = yield call(sendRequest, apiParams, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* updateAddress({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = apiConfig.address.update;
        const result = yield call(sendRequest, apiParams, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* deleteAddress({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = {
            ...apiConfig.address.delete,
            path: `${apiConfig.address.delete.path}/${params.id}`
        }
        const result = yield call(sendRequest, apiParams);
        handleApiResponse(result, onCompleted, onError);

        const { success, responseData } = result;
        if(!success || !responseData.result)
            yield put({ type: defineActionFailed(DELETE_ADDRESS) });
    }
    catch(error) {
        yield put({ type: defineActionFailed(DELETE_ADDRESS) });
        onError(error);
    }
}

const sagas = [
    takeLatest(defineActionLoading(GET_ADDRESS_LIST), getAddressList),
    takeLatest(GET_ADDRESS_BY_ID, getAddressById),
    takeLatest(UPDATE_ADDRESS, updateAddress),
    takeLatest(CREATE_ADDRESS, createAddress),
    takeLatest(defineActionLoading(DELETE_ADDRESS), deleteAddress),
]

export default sagas;