import reduxHelper from '../utils/redux';

export const reduxUtil = reduxHelper('CATEGORY');

const { defineAction, createActionWithLoading, createAction } = reduxUtil;

export const actionTypes = {
    GET_CATEGORY_LIST: defineAction('GET_CATEGORY_LIST'),
    CREATE_CATEGORY: defineAction('CREATE_CATEGORY'),
    GET_CATEGORY_BY_ID: defineAction('GET_CATEGORY_BY_ID'),
    UPDATE_CATEGORY: defineAction('UPDATE_CATEGORY'),
    DELETE_CATEGORY: defineAction('DELETE_CATEGORY'),
}

export const actions = {
    getCategoriesList: createActionWithLoading(actionTypes.GET_CATEGORY_LIST),
    createCategory: createAction(actionTypes.CREATE_CATEGORY),
    getCategoryById: createAction(actionTypes.GET_CATEGORY_BY_ID),
    updateCategory: createAction(actionTypes.UPDATE_CATEGORY),
    deleteCategory: createActionWithLoading(actionTypes.DELETE_CATEGORY)
}