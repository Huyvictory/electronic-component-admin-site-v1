import reduxHelper from '../utils/redux';

export const reduxUtil = reduxHelper('ADDRESS');

const { defineAction, createActionWithLoading, createAction } = reduxUtil;

export const actionTypes = {
    GET_ADDRESS_LIST: defineAction('GET_ADDRESS_LIST'),
    GET_ADDRESS_BY_ID: defineAction('GET_ADDRESS_BY_ID'),
    UPDATE_ADDRESS: defineAction('UPDATE_ADDRESS'),
    DELETE_ADDRESS: defineAction('DELETE_ADDRESS'),
    CREATE_ADDRESS: defineAction('CREATE_ADDRESS'),
}

export const actions = {
    getAddressList: createActionWithLoading(actionTypes.GET_ADDRESS_LIST),
    getAddressById: createAction(actionTypes.GET_ADDRESS_BY_ID),
    updateAddress: createAction(actionTypes.UPDATE_ADDRESS),
    deleteAddress: createActionWithLoading(actionTypes.DELETE_ADDRESS),
    createAddress: createAction(actionTypes.CREATE_ADDRESS),
}