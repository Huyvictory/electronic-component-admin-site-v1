import { call, put, takeLatest } from 'redux-saga/effects';

import { sendRequest } from '../services/apiService';
import { actionTypes, reduxUtil } from '../actions/orders';
import apiConfig from '../constants/apiConfig';
import { handleApiResponse } from '../utils/apiHelper';

const { defineActionLoading, defineActionSuccess, defineActionFailed } = reduxUtil;

const {
    GET_ORDERS_LIST,
    GET_ORDERS_BY_ID,
    UPDATE_ORDERS,
    UPDATE_STATE_ORDERS,
    CANCEL_ORDERS,
} = actionTypes;


function* getOrdersList({ payload: { params } }) {
    const apiParams = apiConfig.orders.getOrdersList;
    const searchParams = { page: params.page, size: params.size };

    if(params.customerId) {
        searchParams.customerId = params.customerId
    }
    
    if(params.search) {
        if(params.search.code) {
            searchParams.code = params.search.code
        }
        if(params.search.state) {
            searchParams.state = params.search.state
        }
    }
    
    try {
        const result = yield call(sendRequest, apiParams, searchParams);
        yield put({
            type: defineActionSuccess(GET_ORDERS_LIST),
            ordersData: result.responseData && result.responseData.data,
        });
    }
    catch(error) {
        yield put({ type: defineActionFailed(GET_ORDERS_LIST) });
    }
}

function* getOrdersById({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = {
            ...apiConfig.orders.getOrdersrbyId,
            path: `${apiConfig.orders.getOrdersrbyId.path}/${params.id}`
        }
        const result = yield call(sendRequest, apiParams);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* updateStateOrders({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = apiConfig.orders.updateOrdersByState;
        const result = yield call(sendRequest, apiParams, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* updateOrders({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = apiConfig.orders.updateOrders;
        const result = yield call(sendRequest, apiParams, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* cancelOrders({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = apiConfig.orders.updateOrdersCancel;
        const result = yield call(sendRequest, apiParams, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}



const sagas = [
    takeLatest(defineActionLoading(GET_ORDERS_LIST), getOrdersList),
    takeLatest(GET_ORDERS_BY_ID, getOrdersById),
    takeLatest(UPDATE_STATE_ORDERS, updateStateOrders),
    takeLatest(UPDATE_ORDERS, updateOrders),
    takeLatest(CANCEL_ORDERS, cancelOrders),
]

export default sagas;