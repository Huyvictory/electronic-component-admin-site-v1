import reduxHelper from '../utils/redux';

export const reduxUtil = reduxHelper('PRODUCT');

const { defineAction, createActionWithLoading, createAction } = reduxUtil;

export const actionTypes = {
    GET_PRODUCT_LIST: defineAction('GET_PRODUCT_LIST'),
    CREATE_PRODUCT: defineAction('CREATE_PRODUCT'),
    GET_PRODUCT_BY_ID: defineAction('GET_PRODUCT_BY_ID'),
    UPDATE_PRODUCT: defineAction('UPDATE_PRODUCT'),
    DELETE_PRODUCT: defineAction('DELETE_PRODUCT'),
    GET_PRODUCT_CATEGORY_AUTO_COMPLETE: defineAction('GET_PRODUCT_CATEGORY_AUTO_COMPLETE')
}

export const actions = {
    getProductList: createActionWithLoading(actionTypes.GET_PRODUCT_LIST),
    createProduct: createAction(actionTypes.CREATE_PRODUCT),
    getProductById: createAction(actionTypes.GET_PRODUCT_BY_ID),
    updateProduct: createAction(actionTypes.UPDATE_PRODUCT),
    deleteProduct: createActionWithLoading(actionTypes.DELETE_PRODUCT),
    getProductCategoryAutoComplete: createAction(actionTypes.GET_PRODUCT_CATEGORY_AUTO_COMPLETE)
}