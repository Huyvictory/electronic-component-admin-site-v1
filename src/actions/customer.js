import reduxHelper from '../utils/redux';

export const reduxUtil = reduxHelper('CUSTOMER');

const { defineAction, createActionWithLoading, createAction } = reduxUtil;

export const actionTypes = {
    GET_CUSTOMER_LIST: defineAction('GET_CUSTOMER_LIST'),
    GET_CUSTOMER_BY_ID: defineAction('GET_CUSTOMER_BY_ID'),
    UPDATE_CUSTOMER: defineAction('UPDATE_CUSTOMER'),
    DELETE_CUSTOMER: defineAction('DELETE_CUSTOMER'),
    CREATE_CUSTOMER: defineAction('CREATE_CUSTOMER'),
}

export const actions = {
    getCustomerList: createActionWithLoading(actionTypes.GET_CUSTOMER_LIST),
    getCustomerById: createAction(actionTypes.GET_CUSTOMER_BY_ID),
    updateCustomer: createAction(actionTypes.UPDATE_CUSTOMER),
    deleteCustomer: createActionWithLoading(actionTypes.DELETE_CUSTOMER),
    createCustomer: createAction(actionTypes.CREATE_CUSTOMER),
}