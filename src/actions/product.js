import reduxHelper from '../utils/redux';

export const reduxUtil = reduxHelper('PRODUCT');

const { defineAction, createActionWithLoading, createAction } = reduxUtil;

export const actionTypes = {
    GET_PRODUCT_LIST: defineAction('GET_PRODUCT_LIST'),
    GET_CATEGORY_TYPE: defineAction('GET_CATEGORY_TYPE'),
    CREATE_PRODUCT: defineAction('CREATE_PRODUCT'),
    GET_PRODUCT_BY_ID: defineAction('GET_PRODUCT_BY_ID'),
    UPDATE_PRODUCT: defineAction('UPDATE_PRODUCT'),
    DELETE_PRODUCT: defineAction('DELETE_PRODUCT'),
}

export const actions = {
    getProductList: createActionWithLoading(actionTypes.GET_PRODUCT_LIST),
    getCategoryType: createActionWithLoading(actionTypes.GET_CATEGORY_TYPE),
    createProduct: createAction(actionTypes.CREATE_PRODUCT),
    getProductById: createAction(actionTypes.GET_PRODUCT_BY_ID),
    updateProduct: createAction(actionTypes.UPDATE_PRODUCT),
    deleteProduct: createActionWithLoading(actionTypes.DELETE_PRODUCT)
}