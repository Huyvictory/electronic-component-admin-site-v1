import { call, put, takeLatest } from 'redux-saga/effects';

import { sendRequest } from '../services/apiService';
import { actionTypes, reduxUtil } from '../actions/product';
import apiConfig from '../constants/apiConfig';
import { handleApiResponse } from '../utils/apiHelper';

const { defineActionLoading, defineActionSuccess, defineActionFailed } = reduxUtil;

const {
    GET_PRODUCT_LIST,
    GET_PRODUCT_BY_ID,
    GET_CATEGORY_TYPE,
    UPDATE_PRODUCT,
    DELETE_PRODUCT,
    CREATE_PRODUCT,
} = actionTypes;


function* getProductList({ payload: { params } }) {

    const apiParams = apiConfig.product.getProductList;
    const searchParams = { page: params.page, size: params.size };
    if(params.search) {
        if(params.search.name) {
            searchParams.name = params.search.name
        }
    }
    if(params.categoryId) {
        searchParams.categoryId = params.categoryId
    }

    if(params.parentId) {
        searchParams.parentId = params.parentId
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

function* getCategoryType({payload: {params}}) {
    const apiParams = apiConfig.category.getTypeCategory;
    const searchParams = { page: params.page, size: params.size };


    if(params.kind)
    {
        searchParams.kind = params.kind
    }

    try {
        const result = yield call (sendRequest, apiParams, searchParams);
        yield put({
            type: defineActionSuccess(GET_CATEGORY_TYPE),
            productCategoryType: result.responseData && result.responseData.data
        })
    }
    catch(error) {
        yield put({type: defineActionFailed(GET_CATEGORY_TYPE)});
    }
}

function* getProductById({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = {
            ...apiConfig.product.getProductById,
            path: `${apiConfig.product.getProductById.path}/${params.id}`
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
        const apiParams = apiConfig.product.createProduct;
        const result = yield call(sendRequest, apiParams, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* updateProduct({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = apiConfig.product.updateProduct;
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
            ...apiConfig.product.deleteProduct,
            path: `${apiConfig.product.deleteProduct.path}/${params.id}`
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

const sagas = [
    takeLatest(defineActionLoading(GET_PRODUCT_LIST),getProductList),
    takeLatest(defineActionLoading(GET_CATEGORY_TYPE), getCategoryType),
    takeLatest(GET_PRODUCT_BY_ID, getProductById),
    takeLatest(UPDATE_PRODUCT, updateProduct),
    takeLatest(CREATE_PRODUCT, createProduct),
    takeLatest(defineActionLoading(DELETE_PRODUCT), deleteProduct),
]

export default sagas;