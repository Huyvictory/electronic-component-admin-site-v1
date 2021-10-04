import { actionTypes, reduxUtil } from '../actions/customer';

const { createReducer, defineActionSuccess, defineActionLoading, defineActionFailed } = reduxUtil;
const {
    GET_CUSTOMER_LIST,
    DELETE_CUSTOMER,
} = actionTypes;

const initialState = { 
    customerData: {},
    tbCustomerLoading: false,
};

const reducer = createReducer({
    [defineActionLoading(GET_CUSTOMER_LIST)]: (state) => {
        return {
            ...state,
            tbCustomerLoading: true
        }
    },
    [defineActionSuccess(GET_CUSTOMER_LIST)]: (state, { customerData }) => {
        return {
            ...state,
            customerData,
            tbCustomerLoading: false
        }
    },
    [defineActionLoading(DELETE_CUSTOMER)]: (state) => {
        return {
            ...state,
            tbCustomerLoading: true
        }
    },
    [defineActionFailed(DELETE_CUSTOMER)] : (state) =>{
        return {
            ...state,
            tbCustomerLoading: false,
        }
    },
    initialState
})

export default {
    reducer
};
