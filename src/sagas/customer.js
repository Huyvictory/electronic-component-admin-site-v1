import { call, put, takeLatest } from 'redux-saga/effects';

import { sendRequest } from '../services/apiService';
import { actionTypes, reduxUtil } from '../actions/customer';
import apiConfig from '../constants/apiConfig';
import { handleApiResponse } from '../utils/apiHelper';

const { defineActionLoading, defineActionSuccess, defineActionFailed } = reduxUtil;

const {
    GET_CUSTOMER_LIST,
    GET_CUSTOMER_BY_ID,
    UPDATE_CUSTOMER,
    DELETE_CUSTOMER,
    CREATE_CUSTOMER,
} = actionTypes;


function* getCustomerList({ payload: { params } }) {

    const apiParams = apiConfig.customer.getCustomerList;
    const searchParams = { page: params.page, size: params.size };
    
    if(params.search) {
        if(params.search.fullName) {
            searchParams.fullName = params.search.fullName
        }
        if(params.search.phone) {
            searchParams.phone = params.search.phone
        }
        if(params.search.status || params.search.status === 0) {
            searchParams.status = params.search.status
        }
    }
    try {
        const result = yield call(sendRequest, apiParams, searchParams);
        yield put({
            type: defineActionSuccess(GET_CUSTOMER_LIST),
            customerData: result.responseData && result.responseData.data,
        });
    }
    catch(error) {
        yield put({ type: defineActionFailed(GET_CUSTOMER_LIST) });
    }
}

function* getCustomerById({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = {
            ...apiConfig.customer.getCustomerById,
            path: `${apiConfig.customer.getCustomerById.path}/${params.id}`
        }
        const result = yield call(sendRequest, apiParams);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* createCustomer({payload: { params, onCompleted, onError }}){
    try {
        const apiParams = apiConfig.customer.createCustomer;
        const result = yield call(sendRequest, apiParams, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* updateCustomer({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = apiConfig.customer.updateCustomer;
        const result = yield call(sendRequest, apiParams, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* deleteCustomer({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = {
            ...apiConfig.customer.deleteCustomer,
            path: `${apiConfig.customer.deleteCustomer.path}/${params.id}`
        }
        const result = yield call(sendRequest, apiParams);
        handleApiResponse(result, onCompleted, onError);

        const { success, responseData } = result;
        if(!success || !responseData.result)
            yield put({ type: defineActionFailed(DELETE_CUSTOMER) });
    }
    catch(error) {
        yield put({ type: defineActionFailed(DELETE_CUSTOMER) });
        onError(error);
    }
}

const sagas = [
    takeLatest(defineActionLoading(GET_CUSTOMER_LIST), getCustomerList),
    takeLatest(GET_CUSTOMER_BY_ID, getCustomerById),
    takeLatest(UPDATE_CUSTOMER, updateCustomer),
    takeLatest(CREATE_CUSTOMER, createCustomer),
    takeLatest(defineActionLoading(DELETE_CUSTOMER), deleteCustomer),
]

export default sagas;