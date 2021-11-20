import { call, put, takeLatest } from 'redux-saga/effects';

import { sendRequest } from '../services/apiService';
import { actionTypes, reduxUtil } from '../actions/orders';
import apiConfig from '../constants/apiConfig';
import { handleApiResponse } from '../utils/apiHelper';

const { defineActionLoading, defineActionSuccess, defineActionFailed } = reduxUtil;

const {
    GET_ORDERS_LIST
} = actionTypes;


function* getOrdersList({ payload: { params } }) {
    const apiParams = apiConfig.orders.getOrdersList;
    const searchParams = { page: params.page, size: params.size };
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
        console.log(result.responseData);
        yield put({
            type: defineActionSuccess(GET_ORDERS_LIST),
            ordersData: result.responseData && result.responseData.data,
        });
    }
    catch(error) {
        yield put({ type: defineActionFailed(GET_ORDERS_LIST) });
    }
}



const sagas = [
    takeLatest(defineActionLoading(GET_ORDERS_LIST), getOrdersList),
]

export default sagas;