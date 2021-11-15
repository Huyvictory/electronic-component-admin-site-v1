import reduxHelper from '../utils/redux';

export const reduxUtil = reduxHelper('NEWS');

const { defineAction, createActionWithLoading, createAction } = reduxUtil;

export const actionTypes = {
    GET_NEWS_LIST: defineAction('GET_NEWS_LIST'),
    GET_CATEGORY_TYPE: defineAction('GET_CATEGORY_TYPE'),
    CREATE_NEWS: defineAction('CREATE_NEWS'),
    GET_NEWS_BY_ID: defineAction('GET_NEWS_BY_ID'),
    UPDATE_NEWS: defineAction('UPDATE_NEWS'),
    DELETE_NEWS: defineAction('DELETE_NEWS'),
}

export const actions = {
    getNewsList: createActionWithLoading(actionTypes.GET_NEWS_LIST),
    getCategoryType: createActionWithLoading(actionTypes.GET_CATEGORY_TYPE),
    createNews: createAction(actionTypes.CREATE_NEWS),
    getNewsById: createAction(actionTypes.GET_NEWS_BY_ID),
    updateNews: createAction(actionTypes.UPDATE_NEWS),
    deleteNews: createActionWithLoading(actionTypes.DELETE_NEWS)
}