import { call, put, takeLatest } from 'redux-saga/effects';

import { sendRequest } from '../services/apiService';
import { actionTypes, reduxUtil } from '../actions/product';
import apiConfig from '../constants/apiConfig';
import { handleApiResponse } from '../utils/apiHelper';

const { defineActionLoading, defineActionSuccess, defineActionFailed } = reduxUtil;

const {
    GET_PRODUCT_LIST,
    GET_PRODUCT_BY_ID,
    UPDATE_PRODUCT,
    DELETE_PRODUCT,
    CREATE_PRODUCT,
    GET_PRODUCT_CATEGORY_AUTO_COMPLETE,
} = actionTypes;


function* getProductList({ payload: { params } }) {

    const apiParams = apiConfig.product.getList;
    const searchParams = { page: params.page, size: params.size };

    if(params.categoryId) {
        searchParams.categoryId = params.categoryId
    }

    if(params.search) {
        if(params.search.name) {
            searchParams.name = params.search.name
        }
        if(params.search.status) {
            searchParams.status = params.search.status
        }
    }
    try {
        const result = yield call(sendRequest, apiParams, searchParams);
        yield put({
            type: defineActionSuccess(GET_PRODUCT_LIST),
            productData: result.responseData && result.responseData.data,
        });
    }
    catch(error) {
        yield put({ type: defineActionFailed(GET_PRODUCT_LIST) });
    }
}

function* getProductById({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = {
            ...apiConfig.product.getById,
            path: `${apiConfig.product.getById.path}/${params.id}`
        }
        const result = yield call(sendRequest, apiParams);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* createProduct({payload: { params, onCompleted, onError }}){
    try {
        const apiParams = apiConfig.product.create;
        const result = yield call(sendRequest, apiParams, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* updateProduct({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = apiConfig.product.update;
        const result = yield call(sendRequest, apiParams, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* deleteProduct({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = {
            ...apiConfig.product.delete,
            path: `${apiConfig.product.delete.path}/${params.id}`
        }
        const { success, responseData } = yield call(sendRequest, apiParams);
        handleApiResponse({ success, responseData }, onCompleted, onError);

        if(!success || !responseData.result)
            yield put({ type: defineActionFailed(DELETE_PRODUCT) });
    }
    catch(error) {
        yield put({ type: defineActionFailed(DELETE_PRODUCT) });
        onError(error);
    }
}

function* getCategoryAutoComplete({ payload: { params, onCompleted, onError } }) {

    const apiParams = apiConfig.product.categoryAutoComplete;
    const searchParams = {};
    if(params.kind) {
        searchParams.kind = params.kind;
    }
    try {
        const { success, responseData } = yield call(sendRequest, apiParams, searchParams);
        if (success && responseData.result) {
            onCompleted && onCompleted(responseData.data?.data || [])
            yield put({
                type: defineActionSuccess(GET_PRODUCT_CATEGORY_AUTO_COMPLETE),
                categoryAutoComplete: responseData.data?.data || [] ,
            })
        } else {
            onError && onError(responseData)
        }
    }
    catch(error) {
        yield put({ type: defineActionFailed(GET_PRODUCT_CATEGORY_AUTO_COMPLETE) });
    }
}

const sagas = [
    takeLatest(defineActionLoading(GET_PRODUCT_LIST), getProductList),
    takeLatest(GET_PRODUCT_BY_ID, getProductById),
    takeLatest(UPDATE_PRODUCT, updateProduct),
    takeLatest(CREATE_PRODUCT, createProduct),
    takeLatest(defineActionLoading(DELETE_PRODUCT), deleteProduct),
    takeLatest(GET_PRODUCT_CATEGORY_AUTO_COMPLETE, getCategoryAutoComplete),
]

export default sagas;