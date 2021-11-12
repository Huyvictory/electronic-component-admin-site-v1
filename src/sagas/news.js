import { call, put, takeLatest } from 'redux-saga/effects';

import { sendRequest } from '../services/apiService';
import { actionTypes, reduxUtil } from '../actions/news';
import apiConfig from '../constants/apiConfig';
import { handleApiResponse } from '../utils/apiHelper';

const { defineActionLoading, defineActionSuccess, defineActionFailed } = reduxUtil;

const {
    GET_NEWS_LIST,
    GET_NEWS_BY_ID,
    GET_CATEGORY_TYPE,
    UPDATE_NEWS,
    DELETE_NEWS,
    CREATE_NEWS,
} = actionTypes;


function* getNewsList({ payload: { params } }) {

    const apiParams = apiConfig.news.getNewsList;
    const searchParams = { page: params.page, size: params.size };
    if(params.search) {
        if(params.search.name) {
            searchParams.name = params.search.name
        }
    }
    if(params.categoryId) {
        searchParams.categoryId = params.categoryId
    }
    try {
        const result = yield call(sendRequest, apiParams, searchParams);
        yield put({
            type: defineActionSuccess(GET_NEWS_LIST),
            newsData: result.responseData && result.responseData.data,
        });
    }
    catch(error) {
        yield put({ type: defineActionFailed(GET_NEWS_LIST) });
    }
}

function* getCategoryType({payload: {params}}) {
    const apiParams = apiConfig.category.getTypeCategory;
    const searchParams = { page: params.page, size: params.size };

    console.log('running');

    if(params.kind)
    {
        searchParams.kind = params.kind
    }
    try {
        const result = yield call (sendRequest, apiParams, searchParams);
        yield put({
            type: defineActionSuccess(GET_CATEGORY_TYPE),
            newsCategoryType: result.responseData && result.responseData.data
        })
    }
    catch(error) {
        yield put({type: defineActionFailed(GET_CATEGORY_TYPE)});
    }
}

function* getNewsById({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = {
            ...apiConfig.news.getNewsById,
            path: `${apiConfig.news.getNewsById.path}/${params.id}`
        }
        const result = yield call(sendRequest, apiParams);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* createNews({payload: { params, onCompleted, onError }}){
    try {
        const apiParams = apiConfig.news.createNews;
        const result = yield call(sendRequest, apiParams, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* updateNews({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = apiConfig.news.updateNews;
        const result = yield call(sendRequest, apiParams, params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

function* deleteNews({ payload: { params, onCompleted, onError } }) {
    try {
        const apiParams = {
            ...apiConfig.news.deleteNews,
            path: `${apiConfig.news.deleteNews.path}/${params.id}`
        }
        const { success, responseData } = yield call(sendRequest, apiParams);
        handleApiResponse({ success, responseData }, onCompleted, onError);

        if(!success || !responseData.result)
            yield put({ type: defineActionFailed(DELETE_NEWS) });
    }
    catch(error) {
        yield put({ type: defineActionFailed(DELETE_NEWS) });
        onError(error);
    }
}

const sagas = [
    takeLatest(defineActionLoading(GET_NEWS_LIST),getNewsList),
    takeLatest(defineActionLoading(GET_CATEGORY_TYPE), getCategoryType),
    takeLatest(GET_NEWS_BY_ID, getNewsById),
    takeLatest(UPDATE_NEWS, updateNews),
    takeLatest(CREATE_NEWS, createNews),
    takeLatest(defineActionLoading(DELETE_NEWS), deleteNews),
]

export default sagas;