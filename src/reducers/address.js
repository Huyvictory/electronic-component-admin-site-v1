import { actionTypes, reduxUtil } from '../actions/address';

const { createReducer, defineActionSuccess, defineActionLoading, defineActionFailed } = reduxUtil;
const {
    GET_ADDRESS_LIST,
    DELETE_ADDRESS,
} = actionTypes;

const initialState = { 
    addressData: {},
    tbAddressLoading: false,
};

const reducer = createReducer({
    [defineActionLoading(GET_ADDRESS_LIST)]: (state) => {
        return {
            ...state,
            tbAddressLoading: true
        }
    },
    [defineActionSuccess(GET_ADDRESS_LIST)]: (state, { addressData }) => {
        return {
            ...state,
            addressData,
            tbAddressLoading: false
        }
    },
    [defineActionLoading(DELETE_ADDRESS)]: (state) => {
        return {
            ...state,
            tbAddressLoading: true
        }
    },
    [defineActionFailed(DELETE_ADDRESS)] : (state) =>{
        return {
            ...state,
            tbAddressLoading: false,
        }
    },
    initialState
})

export default {
    reducer
};
