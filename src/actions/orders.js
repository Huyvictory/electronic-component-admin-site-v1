import reduxHelper from '../utils/redux';

export const reduxUtil = reduxHelper('ORDERS');

const { defineAction, createActionWithLoading, createAction } = reduxUtil;

export const actionTypes = {
    GET_ORDERS_LIST: defineAction('GET_ORDERS_LIST'),
}

export const actions = {
    getOrdersList: createActionWithLoading(actionTypes.GET_ORDERS_LIST),
}